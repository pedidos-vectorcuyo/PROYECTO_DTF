
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { register } from '../services/api';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        nombre_completo: '',
        cuit: '',
        telefono: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Basic validation
        if (formData.cuit.length < 7 || formData.cuit.length > 11) {
            setError('El CUIT/DNI debe tener entre 7 y 11 caracteres.');
            setIsLoading(false);
            return;
        }

        try {
            // Prepare payload for n8n
            const payload = {
                nombre_completo: formData.nombre_completo, // Unified name
                cuit_dni: formData.cuit, // Unified ID
                telefono: formData.telefono,
                email: formData.email,
                password: formData.password
            };

            await register(payload);

            // Redirect to login on success
            navigate('/login');
        } catch (err) {
            console.error("Registration failed", err);
            setError('Error al registrarse. Verifique los datos o intente más tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-10">
            <div className="w-full max-w-[450px] bg-surface border border-gray-border rounded-card p-8 shadow-sm">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-[16px]">precision_manufacturing</span>
                        </div>
                        <span className="font-bold text-sm tracking-tight text-text-main">Vector<span className="text-primary">Cuyo</span></span>
                    </div>
                    <h1 className="text-[24px] font-bold text-text-main text-center leading-tight">Crear cuenta B2B</h1>
                    <p className="text-[14px] text-text-secondary text-center mt-2 leading-relaxed">Regístrate para acceder a herramientas profesionales de impresión</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center border border-red-100 animate-fade-in">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-medium text-text-main" htmlFor="nombre_completo">Nombre personal / empresa</label>
                        <input
                            id="nombre_completo"
                            type="text"
                            placeholder="Ej. Juan Pérez / Impresiones S.A."
                            value={formData.nombre_completo}
                            onChange={handleChange}
                            className="w-full h-[44px] bg-surface border border-gray-border rounded-lg px-3.5 text-[14px] text-text-main placeholder-text-secondary/60 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-[13px] font-medium text-text-main" htmlFor="cuit">CUIT / DNI</label>
                            <input
                                id="cuit"
                                type="text" // number type can be annoyance with leading zeros sometimes, text is safer but validate
                                inputMode="numeric"
                                pattern="[0-9]*"
                                placeholder="Sin guiones"
                                value={formData.cuit}
                                onChange={handleChange}
                                className="w-full h-[44px] bg-surface border border-gray-border rounded-lg px-3.5 text-[14px] text-text-main placeholder-text-secondary/60 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[13px] font-medium text-text-main" htmlFor="telefono">Teléfono</label>
                            <input
                                id="telefono"
                                type="tel"
                                placeholder="Cod. Área + Núm"
                                value={formData.telefono}
                                onChange={handleChange}
                                className="w-full h-[44px] bg-surface border border-gray-border rounded-lg px-3.5 text-[14px] text-text-main placeholder-text-secondary/60 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-medium text-text-main" htmlFor="email">Email corporativo</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="nombre@empresa.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full h-[44px] bg-surface border border-gray-border rounded-lg px-3.5 text-[14px] text-text-main placeholder-text-secondary/60 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-medium text-text-main" htmlFor="password">Contraseña</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Mínimo 8 caracteres"
                                value={formData.password}
                                onChange={handleChange}
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
                    <Button type="submit" className="w-full mt-4" size="lg" disabled={isLoading}>
                        {isLoading ? 'Creando cuenta...' : 'Registrar Cuenta'}
                    </Button>
                </form>
                <div className="mt-8 pt-6 border-t border-gray-border text-center">
                    <span className="text-[13px] text-text-secondary">¿Ya tienes una cuenta?</span>
                    <Link to="/login" className="text-[13px] font-bold text-primary hover:opacity-80 ml-1 transition-colors">Iniciar sesión</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
