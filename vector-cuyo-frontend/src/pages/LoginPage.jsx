
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthProvider';
import Button from '../components/ui/Button';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement actual login logic with n8n
        // Mock login for now
        const mockUser = {
            id: 1,
            nombre: "Usuario Demo",
            correo: email,
            whatsapp: "+549261000000"
        };
        login(mockUser);
        navigate('/dashboard');
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-[400px] bg-surface border border-gray-border rounded-card p-8 shadow-sm">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-6 h-6 bg-text-main rounded flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-[16px]">precision_manufacturing</span>
                        </div>
                        <span className="font-bold text-sm tracking-tight text-text-main">Vector<span className="text-primary">Cuyo</span></span>
                    </div>
                    <h1 className="text-[24px] font-bold text-text-main text-center leading-tight">Iniciar Sesión</h1>
                    <p className="text-[14px] text-text-secondary text-center mt-2 leading-relaxed">Ingresa a tu cuenta corporativa para gestionar pedidos</p>
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
                            className="w-full h-[44px] bg-white border border-gray-border rounded-lg px-3.5 text-[14px] text-text-main placeholder-text-secondary/60 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <label className="block text-[13px] font-medium text-text-main" htmlFor="password">Contraseña</label>
                            <Link to="/reset-password" className="text-[12px] font-medium text-primary hover:text-[#1e40af] transition-colors">¿Olvidaste tu contraseña?</Link>
                        </div>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-[44px] bg-white border border-gray-border rounded-lg pl-3.5 pr-10 text-[14px] text-text-main placeholder-text-secondary/60 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
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

                    <Button type="submit" className="w-full mt-2" size="lg">
                        Acceder al Workstation
                    </Button>
                </form>
                <div className="mt-8 pt-6 border-t border-gray-border text-center">
                    <span className="text-[13px] text-text-secondary">¿No tienes cuenta?</span>
                    <Link to="/register" className="text-[13px] font-bold text-primary hover:text-[#1e40af] ml-1 transition-colors">Crear cuenta B2B</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
