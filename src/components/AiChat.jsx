import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Sparkles, Loader2, MessageCircle } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { sendChatMessage } from '../services/geminiService';

const SUGGESTIONS = [
  'How much did I spend this month?',
  'What is my top expense category?',
  'Give me savings tips',
  'Analyze my spending habits',
];

export const AiChat = ({ isMobile }) => {
  const { transactions, debts } = useFinance();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || isLoading) return;

    setInput('');
    setShowSuggestions(false);
    setMessages(prev => [...prev, { role: 'user', text: userMessage, time: new Date() }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const response = await sendChatMessage(userMessage, transactions, debts, history);
      setMessages(prev => [...prev, { role: 'assistant', text: response, time: new Date() }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: `⚠️ ${error.message}`,
        time: new Date(),
        isError: true,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code style="background:var(--bg-base);padding:1px 4px;border-radius:4px;font-size:12px">$1</code>')
      .replace(/^- (.*)/gm, '• $1')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      boxShadow: 'var(--card-shadow)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flex: 1,
      minHeight: 0,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: isMobile ? '14px 16px' : '16px 20px',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        flexShrink: 0,
      }}>
        <img src="/favicon.svg" alt="ZorvyAI" style={{ width: 36, height: 36, borderRadius: 10 }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>ZorvyAI</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
            {isLoading ? 'Thinking...' : 'Ask anything about your finances'}
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 8,
          background: 'rgba(255,255,255,0.15)',
          fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: 600,
        }}>
          <Sparkles size={12} /> Gemini AI
        </div>
      </div>

      {/* Messages area */}
      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: isMobile ? '14px 12px' : '16px 18px',
        display: 'flex', flexDirection: 'column', gap: 12,
        background: 'var(--bg-base)',
      }}>
        {/* Welcome state */}
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: isMobile ? '16px 8px' : '24px 16px' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%', margin: '0 auto 12px',
              background: 'var(--accent-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MessageCircle size={24} color="var(--accent)" />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>
              Ask me anything about your finances 👋
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              I can analyze your spending, suggest savings tips, and answer questions about your transactions.
            </p>
          </div>
        )}

        {/* Suggestions */}
        {showSuggestions && messages.length === 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 8,
          }}>
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => handleSend(s)} style={{
                padding: '10px 14px', borderRadius: 12, fontSize: 13, fontWeight: 500,
                textAlign: 'left', cursor: 'pointer',
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <Sparkles size={14} style={{ flexShrink: 0 }} /> {s}
              </button>
            ))}
          </div>
        )}

        {/* Chat messages */}
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column',
            alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
            gap: 4,
          }}>
            <div style={{
              display: 'flex', alignItems: 'flex-end', gap: 8,
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              maxWidth: isMobile ? '92%' : '75%',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                  : 'linear-gradient(135deg, #10b981, #059669)',
              }}>
                {msg.role === 'user' ? <User size={14} color="#fff" /> : <Bot size={14} color="#fff" />}
              </div>
              <div style={{
                padding: '10px 14px', borderRadius: 16, fontSize: 13, lineHeight: 1.6,
                ...(msg.role === 'user' ? {
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: '#fff', borderBottomRightRadius: 4,
                } : {
                  background: 'var(--bg-surface)',
                  border: msg.isError ? '1px solid var(--danger)' : '1px solid var(--border)',
                  color: msg.isError ? 'var(--danger)' : 'var(--text-primary)',
                  borderBottomLeftRadius: 4,
                }),
              }}
                dangerouslySetInnerHTML={msg.role === 'assistant' ? { __html: formatText(msg.text) } : undefined}
              >
                {msg.role === 'user' ? msg.text : undefined}
              </div>
            </div>
            <span style={{
              fontSize: 10, color: 'var(--text-muted)',
              paddingLeft: msg.role === 'user' ? 0 : 36,
              paddingRight: msg.role === 'user' ? 36 : 0,
            }}>
              {formatTime(msg.time)}
            </span>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 36 }}>
            <div style={{
              padding: '10px 14px', borderRadius: 16, borderBottomLeftRadius: 4,
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Loader2 size={14} color="var(--accent)" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>ZorvyAI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={{
        padding: isMobile ? '12px 12px' : '14px 18px',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          borderRadius: 14, padding: '4px 4px 4px 14px',
          background: 'var(--bg-base)', border: '1px solid var(--border)',
          transition: 'border-color 0.2s',
        }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your finances..."
            disabled={isLoading}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: 14, color: 'var(--text-primary)', padding: '8px 0',
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            style={{
              width: 36, height: 36, borderRadius: 10, border: 'none',
              cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: input.trim() && !isLoading ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--bg-surface-hover)',
              color: input.trim() && !isLoading ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.2s', flexShrink: 0,
            }}
          >
            <Send size={16} />
          </button>
        </div>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8, marginBottom: 0 }}>
          Powered by Gemini AI • Your data stays in this browser
        </p>
      </div>
    </div>
  );
};
