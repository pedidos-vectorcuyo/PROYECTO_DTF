
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthProvider';
import Button from '../components/ui/Button';
import { useGoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const user = await login(email, password);
            if (user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
            setError('Credenciales inválidas. Por favor verifique sus datos.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsGoogleLoading(true);
            setError('');
            try {
                // tokenResponse.access_token is the token
                // We send it to n8n which will verify with Google's API
                const user = await loginWithGoogle(tokenResponse.access_token);
                if (user?.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } catch (err) {
                console.error(err);
                setError('Error al iniciar sesión con Google. Por favor intentá de nuevo.');
            } finally {
                setIsGoogleLoading(false);
            }
        },
        onError: () => {
            setError('La autenticación con Google fue cancelada o falló.');
        },
    });

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-[400px] bg-surface border border-gray-border rounded-card p-8 shadow-sm">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-[16px]">precision_manufacturing</span>
                        </div>
                        <span className="font-bold text-sm tracking-tight text-text-main">Vector<span className="text-primary">Cuyo</span></span>
                    </div>
                    <h1 className="text-[24px] font-bold text-text-main text-center leading-tight">Iniciar Sesión</h1>
                    <p className="text-[14px] text-text-secondary text-center mt-2 leading-relaxed">Ingresa a tu cuenta corporativa para gestionar pedidos</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
                        {error}
                    </div>
                )}

                {/* Google Sign-In Button */}
                <button
                    type="button"
                    onClick={() => handleGoogleLogin()}
                    disabled={isGoogleLoading || isLoading}
                    className="w-full flex items-center justify-center gap-3 h-[44px] bg-surface border border-gray-border rounded-lg px-4 text-[14px] font-medium text-text-main hover:bg-muted transition-colors disabled:opacity-60 disabled:cursor-not-allowed mb-5"
                >
                    {isGoogleLoading ? (
                        <span className="text-sm text-text-secondary">Conectando con Google...</span>
                    ) : (
                        <>
                            {/* Google Icon (SVG) */}
                            <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.86l6.09-6.09C34.46 3.14 29.5 1 24 1 14.82 1 6.98 6.49 3.37 14.29l7.14 5.55C12.24 13.65 17.67 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.1 24.55c0-1.64-.15-3.21-.42-4.73H24v8.96h12.42c-.54 2.9-2.16 5.36-4.6 7.02l7.14 5.55C43.23 37.43 46.1 31.38 46.1 24.55z" />
                                <path fill="#FBBC05" d="M10.51 28.16A14.5 14.5 0 0 1 9.5 24c0-1.44.24-2.84.64-4.16L3 14.29A23.5 23.5 0 0 0 .5 24c0 3.77.88 7.34 2.5 10.49l7.51-6.33z" />
                                <path fill="#34A853" d="M24 46.5c5.5 0 10.12-1.82 13.49-4.94l-7.14-5.55c-1.98 1.33-4.52 2.12-7.35 2.12-6.33 0-11.76-4.15-13.49-9.84l-7.14 5.55C6.98 41.51 14.82 46.5 24 46.5z" />
                            </svg>
                            Continuar con Google
                        </>
                    )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-gray-border"></div>
                    <span className="text-[12px] text-text-secondary font-medium">o ingresá con email</span>
                    <div className="flex-1 h-px bg-gray-border"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-medium text-text-main" htmlFor="email">Email corporativo</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="nombre@empresa.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-[44px] bg-surface border border-gray-border rounded-lg px-3.5 text-[14px] text-text-main placeholder-text-secondary/60 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <label className="block text-[13px] font-medium text-text-main" htmlFor="password">Contraseña</label>
                            <Link to="/reset-password" className="text-[12px] font-medium text-primary hover:opacity-80 transition-colors">¿Olvidaste tu contraseña?</Link>
                        </div>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-[44px] bg-surface border border-gray-border rounded-lg pl-3.5 pr-10 text-[14px] text-text-main placeholder-text-secondary/60 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                            </button>
                        </div>
                    </div>

                    <Button type="submit" className="w-full mt-2" size="lg" disabled={isLoading || isGoogleLoading}>
                        {isLoading ? 'Iniciando sesión...' : 'Acceder al Workstation'}
                    </Button>
                </form>
                <div className="mt-8 pt-6 border-t border-gray-border text-center">
                    <span className="text-[13px] text-text-secondary">¿No tienes cuenta?</span>
                    <Link to="/register" className="text-[13px] font-bold text-primary hover:opacity-80 ml-1 transition-colors">Crear cuenta B2B</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
