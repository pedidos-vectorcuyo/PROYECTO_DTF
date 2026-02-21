import React, { useState } from 'react';
import Button from '../ui/Button';
import { verifyPayment } from '../../services/api';

const PaymentModal = ({ isOpen, onClose, totalMeters, totalPrice, onPaymentVerified }) => {
    const [step, setStep] = useState(1); // 1: Summary, 2: Payment
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');
    const [cuitTitular, setCuitTitular] = useState(''); // New state for CUIT

    if (!isOpen) return null;

    const ALIAS_CBU = "jjgl.mp";

    const handleVerify = async () => {
        if (!cuitTitular) {
            setError('Por favor ingresa el CUIT/DNI desde donde realizaste el pago.');
            return;
        }

        setIsVerifying(true);
        setError('');

        // Prepare data for verification webhook
        const paymentData = {
            monto: totalPrice,
            alias: ALIAS_CBU,
            cuit_titular: cuitTitular, // Send CUIT for validation
            fecha: new Date().toISOString()
        };

        const isValid = await verifyPayment(paymentData);

        if (isValid) {
            onPaymentVerified();
        } else {
            setError('No se pudo verificar el pago. Asegúrate de que el monto sea exacto y el CUIT coincida.');
        }
        setIsVerifying(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-surface rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="bg-muted px-6 py-4 border-b border-gray-border flex justify-between items-center">
                    <h3 className="font-bold text-lg text-text-main">
                        {step === 1 ? 'Confirmar Pedido' : 'Realizar Pago'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {step === 1 ? (
                        <div className="space-y-4">
                            <div className="bg-blue-tint p-4 rounded-lg border border-primary/20">
                                <p className="text-sm text-text-secondary mb-1">Total de Metros</p>
                                <p className="text-xl font-bold text-text-main">{totalMeters.toFixed(2)} m</p>
                            </div>
                            <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                                <p className="text-sm text-text-secondary mb-1">Total a Pagar</p>
                                <p className="text-2xl font-bold text-success">${totalPrice.toLocaleString()}</p>
                            </div>
                            <p className="text-xs text-text-secondary text-center mt-4">
                                Por favor verifica que el total sea correcto antes de continuar.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <p className="text-sm text-text-secondary">Transfiere el total al siguiente Alias:</p>
                                <div className="bg-muted p-3 rounded-lg border border-gray-border inline-block px-8">
                                    <p className="text-lg font-mono font-bold text-text-main select-all">{ALIAS_CBU}</p>
                                </div>
                                <p className="text-xs text-text-secondary">Titular: Jose Gabriel Jesus Lopez</p>
                                <p className="text-xs text-text-secondary mt-1">Monto Exacto: <span className="font-bold text-lg text-success">${totalPrice.toLocaleString()}</span></p>
                            </div>

                            {/* CUIT Input Field */}
                            <div className="space-y-1.5">
                                <label className="block text-[13px] font-medium text-text-main" htmlFor="cuitPayment">
                                    CUIT/DNI del titular de la cuenta emisora
                                </label>
                                <input
                                    id="cuitPayment"
                                    type="text"
                                    placeholder="Ej. 20123456789 (Sin guiones)"
                                    className="w-full h-[40px] bg-surface border border-gray-border rounded-lg px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    value={cuitTitular}
                                    onChange={(e) => setCuitTitular(e.target.value)}
                                />
                                <p className="text-[11px] text-gray-400">Necesario para validar tu transferencia automáticamente.</p>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center border border-red-100 animate-pulse">
                                    {error}
                                </div>
                            )}

                            <div className="bg-warning/10 p-3 rounded-lg border border-warning/20 text-warning text-xs flex gap-2">
                                <span className="material-symbols-outlined text-sm mt-0.5">info</span>
                                <p>Una vez realizada la transferencia, ingresa tu CUIT/DNI y presiona "Validar Pago".</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-border flex justify-end gap-3 bg-muted/50">
                    {step === 1 ? (
                        <>
                            <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                            <Button onClick={() => setStep(2)}>Continuar</Button>
                        </>
                    ) : (
                        <>
                            <Button variant="secondary" onClick={() => setStep(1)} disabled={isVerifying}>Volver</Button>
                            <Button onClick={handleVerify} disabled={isVerifying || !cuitTitular}>
                                {isVerifying ? 'Verificando...' : 'Validar Pago'}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
