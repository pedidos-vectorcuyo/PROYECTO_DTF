import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { resetPassword } from '../services/api';

const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        setIsLoading(true);

        try {
            const response = await resetPassword(email);
            if (response && response.success) {
                setStatus({
                    type: 'success',
                    message: 'Hemos enviado un correo electrónico con tu contraseña actual. Por favor, revisa tu bandeja de entrada.'
                });
                setEmail('');
            } else {
                setStatus({
                    type: 'error',
                    message: 'No encontramos ninguna cuenta asociada a ese correo electrónico o la cuenta está inactiva.'
                });
            }
        } catch (err) {
            console.error(err);
            setStatus({
                type: 'error',
                message: 'Ocurrió un error al intentar enviar el correo. Por favor, intenta de nuevo más tarde.'
            });
        } finally {
            setIsLoading(false);
        }
    };

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
                    <h1 className="text-[24px] font-bold text-text-main text-center leading-tight">Recuperar Contraseña</h1>
                    <p className="text-[14px] text-text-secondary text-center mt-2 leading-relaxed">
                        Ingresá el correo electrónico asociado a tu cuenta para recibir tu contraseña.
                    </p>
                </div>

                {status.message && (
                    <div className={`mb-5 p-4 text-[13px] rounded-lg border text-center ${status.type === 'success'
                            ? 'bg-green-50 text-green-700 border-green-100'
                            : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="block text-[13px] font-medium text-text-main" htmlFor="email">Email</label>
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

                    <Button type="submit" className="w-full mt-2" size="lg" disabled={isLoading}>
                        {isLoading ? 'Enviando...' : 'Recuperar Contraseña'}
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-border text-center">
                    <span className="text-[13px] text-text-secondary">¿Recordaste tu contraseña?</span>
                    <Link to="/login" className="text-[13px] font-bold text-primary hover:opacity-80 ml-1 transition-colors">Volver a iniciar sesión</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
