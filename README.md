# Zorvy Finance

A modern financial dashboard application built with React and Vite. Zorvy Finance provides real-time financial insights, transaction management, and comprehensive analytics for personal finance management.

## Features

- **Dashboard**: Interactive overview of financial data with real-time updates
- **Transaction Management**: View and manage financial transactions
- **Charts & Analytics**: Visual representation of financial trends and patterns
- **Insights**: AI-powered financial insights and recommendations
- **Admin Panel**: Administrative controls and settings
- **Floating UI Elements**: Modern floating design elements for enhanced UX
- **Responsive Design**: Fully responsive design using Tailwind CSS

## Tech Stack

- **React** - UI library
- **Vite** - Next-generation build tool
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS transformation tool
- **ESLint** - Code quality tool

## Project Structure

```
src/
├── components/
│   ├── AdminPanel.jsx      # Admin controls and settings
│   ├── Charts.jsx          # Financial charts and visualizations
│   ├── Dashboard.jsx       # Main dashboard component
│   ├── Header.jsx          # Application header
│   ├── Insights.jsx        # Financial insights display
│   ├── SummaryCard.jsx     # Summary statistics cards
│   └── TransactionsList.jsx # Transaction list display
├── context/
│   └── FinanceContext.jsx  # Global finance state management
├── assets/                 # Static assets and images
├── App.jsx                 # Main App component
├── main.jsx                # Application entry point
└── index.css               # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/muhammadnavas/zorvy-finance.git
cd zorvy-finance
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

### Development
```bash
npm run dev
```
Starts the development server with hot module replacement (HMR).

### Build
```bash
npm run build
```
Creates an optimized production build.

### Preview
```bash
npm run preview
```
Preview the production build locally.

### Lint
```bash
npm run lint
```
Run ESLint to check code quality.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Author

Muhammad Navas

## Repository

[GitHub - Zorvy Finance](https://github.com/muhammadnavas/zorvy-finance)
