
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages (Placeholder imports for now)
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import OrderPanelPage from './pages/OrderPanelPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import LegalPage from './pages/LegalPage';
import AboutPage from './pages/AboutPage';
import SpecificationsPage from './pages/SpecificationsPage';
import TutorialPage from './pages/TutorialPage';

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
                        <Route path="/nosotros" element={<AboutPage />} />
                        <Route path="/especificaciones" element={<SpecificationsPage />} />
                        <Route path="/tutoriales" element={<TutorialPage />} />

                        {/* Protected Routes */}
                        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                        <Route path="/nuevo-pedido" element={<ProtectedRoute><OrderPanelPage /></ProtectedRoute>} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
