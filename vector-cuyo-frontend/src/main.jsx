import { ThemeProvider } from './context/ThemeContext';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

// Simple Error Boundary for debugging
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 20, color: 'red' }}>
                    <h1>Algo salió mal.</h1>
                    <pre>{this.state.error && this.state.error.toString()}</pre>
                </div>
            );
        }

        return this.props.children;
    }
}

const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
const IS_GOOGLE_VAL_VALID = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'undefined' && GOOGLE_CLIENT_ID !== 'null';

console.log('[DEBUG] main.jsx: VITE_GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID);
console.log('[DEBUG] main.jsx: IS_GOOGLE_VAL_VALID:', IS_GOOGLE_VAL_VALID);

const AppWithProviders = () => (
    <ThemeProvider>
        <App />
    </ThemeProvider>
);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            {IS_GOOGLE_VAL_VALID ? (
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                    <AppWithProviders />
                </GoogleOAuthProvider>
            ) : (
                <AppWithProviders />
            )}
        </ErrorBoundary>
    </React.StrictMode>,
)
