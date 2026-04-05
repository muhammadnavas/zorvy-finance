const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODELS = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-2.5-flash'];
const getApiUrl = (model) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Build a financial context summary from transactions for the AI.
 */
export const buildFinancialContext = (transactions, debts = []) => {
  if (!transactions.length && !debts.length) return 'No financial data recorded yet.';

  const income = transactions.filter(t => t.type === 'income');
  const expenses = transactions.filter(t => t.type === 'expense');
  const totalIncome = income.reduce((s, t) => s + t.amount, 0);
  const totalExpenses = expenses.reduce((s, t) => s + Math.abs(t.amount), 0);
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : 0;

  // Category breakdown
  const categorySpending = {};
  expenses.forEach(e => {
    categorySpending[e.category] = (categorySpending[e.category] || 0) + Math.abs(e.amount);
  });
  const categoryBreakdown = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .map(([cat, amt]) => `  - ${cat}: ₹${amt.toLocaleString('en-IN')}`)
    .join('\n');

  // Monthly trends
  const monthlyData = {};
  transactions.forEach(t => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyData[key]) monthlyData[key] = { income: 0, expenses: 0 };
    if (t.type === 'income') monthlyData[key].income += t.amount;
    else monthlyData[key].expenses += Math.abs(t.amount);
  });
  const monthlyTrend = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => `  - ${month}: Income ₹${data.income.toLocaleString('en-IN')}, Expenses ₹${data.expenses.toLocaleString('en-IN')}, Net ₹${(data.income - data.expenses).toLocaleString('en-IN')}`)
    .join('\n');

  // Recent transactions
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10)
    .map(t => `  - ${t.date} | ${t.type} | ${t.category} | ${t.description} | ₹${Math.abs(t.amount).toLocaleString('en-IN')}`)
    .join('\n');

  // Debt breakdown
  const totalDebt = debts.reduce((sum, d) => sum + d.currentBalance, 0);
  const debtBreakdown = debts.map(d => `  - ${d.name} (${d.type}): ₹${d.currentBalance.toLocaleString('en-IN')} / ₹${d.totalAmount.toLocaleString('en-IN')} (${d.interestRate}% interest, EMI: ₹${d.emi})`).join('\n');

  return `FINANCIAL DATA SUMMARY:
═══════════════════════
Total Income: ₹${totalIncome.toLocaleString('en-IN')} (${income.length} transactions)
Total Expenses: ₹${totalExpenses.toLocaleString('en-IN')} (${expenses.length} transactions)
Net Savings: ₹${netSavings.toLocaleString('en-IN')}
Savings Rate: ${savingsRate}%
Total Transactions: ${transactions.length}

EXPENSE BREAKDOWN BY CATEGORY:
${categoryBreakdown}

MONTHLY TRENDS:
${monthlyTrend}

RECENT TRANSACTIONS (last 10):
${recent}

DEBT & LOAN SUMMARY:
═══════════════════════
Total Outstanding Debt: ₹${totalDebt.toLocaleString('en-IN')}
${debtBreakdown}`;
};

/**
 * Send a message to Gemini with financial context.
 */
export const sendChatMessage = async (userMessage, transactions, debts = [], chatHistory = []) => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Add VITE_GEMINI_API_KEY to .env file.');
  }

  const financialContext = buildFinancialContext(transactions, debts);

  const systemPrompt = `You are ZorvyAI, a smart financial assistant built into the ZorvyFinance dashboard. 
You have access to Navas's complete financial data shown below. Use this data to provide accurate, personalized answers.

${financialContext}

GUIDELINES:
- Be concise but helpful. Use bullet points for lists.
- Always reference actual numbers from Navas's data when relevant.
- Format currency as ₹X,XX,XXX (Indian Rupee format).
- Give actionable financial advice when asked.
- If asked about data you don't have, say so honestly.
- Keep responses under 200 words unless Navas asks for detail.
- Use a friendly, professional tone.`;

  // Build conversation history for multi-turn
  const contents = [];

  // Add system context as first user message
  contents.push({
    role: 'user',
    parts: [{ text: systemPrompt + '\n\nPlease acknowledge you have my financial data and are ready to help.' }],
  });
  contents.push({
    role: 'model',
    parts: [{ text: "I have your complete financial data loaded. I can see your income, expenses, category breakdowns, and monthly trends. How can I help you today?" }],
  });

  // Add chat history
  chatHistory.forEach(msg => {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    });
  });

  // Add current message
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }],
  });

  let lastError = null;

  for (const model of MODELS) {
    try {
      const response = await fetch(getApiUrl(model), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 512,
          },
        }),
      });

      if (response.status === 429) {
        // Rate limited — try next model
        lastError = new Error(`Rate limited on ${model}`);
        continue;
      }

      if (!response.ok) {
        const error = await response.json();
        const msg = error.error?.message || `API error: ${response.status}`;
        
        // Handle specific production errors
        if (response.status === 401) {
          throw new Error('Invalid AI API key. Please check your environment configuration.');
        }
        
        // If quota exceeded, try next model
        if (msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('rate')) {
          lastError = new Error(msg);
          continue;
        }
        throw new Error(msg);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('No response from Gemini');
      return text;

    } catch (err) {
      lastError = err;
      // Only continue to next model for quota/rate errors
      if (err.message?.toLowerCase().includes('quota') || err.message?.toLowerCase().includes('rate')) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('All models failed');
};
