
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import Layout from './components/layout/Layout';

// Pages (Placeholder imports for now)
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import OrderPanelPage from './pages/OrderPanelPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import LegalPage from './pages/LegalPage';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route element={<Layout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/legal" element={<LegalPage />} />

                        {/* Protected Routes (We'll add checks later) */}
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/nuevo-pedido" element={<OrderPanelPage />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
