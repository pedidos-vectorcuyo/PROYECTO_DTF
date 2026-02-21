
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthProvider';
import { processFile } from '../utils/fileProcessor';
import { fetchPrices, submitOrder } from '../services/api';
import Button from '../components/ui/Button';
import PaymentModal from '../components/orders/PaymentModal';

const OrderPanelPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [prices, setPrices] = useState({ base: 13500, p10: 11500, p30: 10500 });
    const [clientData, setClientData] = useState({
        observaciones: ''
    });

    useEffect(() => {
        // Load prices on mount
        const loadPrices = async () => {
            const p = await fetchPrices();
            setPrices(p);
        };
        loadPrices();
    }, []);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = async (fileList) => {
        setLoading(true);

        // Process files in parallel
        const fileArray = Array.from(fileList);
        const processedFiles = await Promise.all(fileArray.map(async (file) => {
            const processed = await processFile(file);
            return {
                id: Date.now() + Math.random(),
                file: file,
                ...processed,
                copies: 1,
                options: {
                    whites: false,
                    blacks: false,
                    colors: false,
                    halftones: false
                }
            };
        }));

        setFiles(prev => [...prev, ...processedFiles]);
        setLoading(false);
    };

    const removeFile = (id) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const updateCopies = (id, delta) => {
        setFiles(prev => prev.map(f => {
            if (f.id === id) {
                const newCopies = Math.max(1, f.copies + delta);
                return { ...f, copies: newCopies };
            }
            return f;
        }));
    };

    const toggleOption = (id, optionKey) => {
        setFiles(prev => prev.map(f => {
            if (f.id === id) {
                return {
                    ...f,
                    options: { ...f.options, [optionKey]: !f.options[optionKey] }
                };
            }
            return f;
        }));
    };

    // Calculations
    const totalMeters = files.reduce((acc, curr) => {
        if (!curr.valid) return acc;
        return acc + (curr.meta.largoM * curr.copies);
    }, 0);

    const effectiveMeters = totalMeters > 0 ? Math.max(1, Math.ceil(totalMeters * 10) / 10) : 0;

    let currentPrice = prices.base;
    let tierName = "Precio Base";
    let tierColor = "bg-blue-tint text-primary border-primary/20";

    if (effectiveMeters > 30) {
        currentPrice = prices.p30;
        tierName = "GOLD (>30m)";
        tierColor = "bg-warning/10 text-warning border-warning/20";
    } else if (effectiveMeters > 10) {
        currentPrice = prices.p10;
        tierName = "MAYORISTA (>10m)";
        tierColor = "bg-success/10 text-success border-success/20";
    }

    const subtotal = effectiveMeters * prices.base;
    const total = effectiveMeters * currentPrice;
    const discount = subtotal - total;

    const handleConfirmOrder = () => {
        if (!user) {
            alert("Debes iniciar sesión para confirmar el pedido.");
            navigate('/login');
            return;
        }

        if (files.length === 0 || files.some(f => !f.valid)) {
            alert("Por favor revisa que todos los archivos sean válidos.");
            return;
        }

        setShowPaymentModal(true);
    };

    const handlePaymentVerified = async () => {
        setShowPaymentModal(false);
        await performOrderSubmission();
    };

    const performOrderSubmission = async () => {
        setSubmitting(true);
        const validFiles = files.filter(f => f.valid);
        const orderId = `PED-${Date.now()}`;
        const shortDate = new Date().toISOString().slice(2, 10).replace(/-/g, '.');
        const clientName = user.nombre || 'Cliente';

        // Upload files in parallel
        const uploadPromises = validFiles.map(async (item, i) => {
            const fd = new FormData();

            // Construct filename
            const cleanName = item.file.name.split('.').slice(0, -1).join('.');
            const propsMap = { whites: 'B', blacks: 'N', colors: 'C', halftones: 'S' };
            const activeProps = Object.keys(item.options).filter(k => item.options[k]).map(k => propsMap[k]);
            const codes = activeProps.length > 0 ? activeProps.join('') : 'Gral';
            const finalName = `${shortDate} - ${clientName}(${cleanName})'x${item.copies}${codes}.png`;

            // Append data
            fd.append("data", item.file, finalName);
            fd.append("idPedido", orderId);
            fd.append("cliente", user.nombre || '');
            fd.append("email", user.correo || '');
            fd.append("telefono", user.whatsapp || '');
            fd.append("observaciones", clientData.observaciones);

            // Metrics
            fd.append("anchoCm", item.meta.anchoCm);
            fd.append("largoM", item.meta.largoM);
            fd.append("copias", item.copies);
            fd.append("propiedades", `#${i + 1}(${codes})`); // Simplified props string

            // Totals (sent with every file, n8n handles aggregation/logic)
            fd.append("precioCotizado", total); // Sending raw number for easier processing in backend if needed
            fd.append("precio_final", total.toString().replace('.', ',')); // Formatting for display/sheets

            fd.append("totalArchivos", validFiles.length);
            fd.append("indiceArchivo", i + 1);
            if (user.id) fd.append("id_cliente", user.id);

            return await submitOrder(fd);
        });

        const results = await Promise.all(uploadPromises);

        const successCount = results.filter(r => r).length;
        const failCount = results.length - successCount;

        setSubmitting(false);

        if (failCount === 0) {
            alert("✅ ¡Pedido Creado con Éxito!");
            // setFiles([]); // Clear or navigate
            navigate('/dashboard'); // Mock navigation
        } else {
            alert(`⚠️ Se subieron ${successCount} archivos, pero fallaron ${failCount}. Por favor reintenta los fallidos.`);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Panel: Upload & List (8 cols ~ 66%) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-surface border border-gray-border rounded-card p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <h2 className="text-[18px] sm:text-[20px] font-bold text-text-main">Lámina DTF Textil</h2>
                            <span className="inline-block w-fit px-3 py-1 bg-blue-tint text-primary text-[11px] font-bold rounded-full uppercase tracking-wide">
                                Producción 24hs
                            </span>
                        </div>

                        <div
                            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${dragActive ? 'border-primary bg-blue-tint' : 'border-gray-border hover:border-primary hover:bg-muted'}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('file-upload').click()}
                        >
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                multiple
                                accept="image/png"
                                onChange={handleChange}
                            />
                            <div className="w-16 h-16 bg-surface border border-gray-border rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-primary">
                                <span className="material-symbols-outlined text-[32px]">cloud_upload</span>
                            </div>
                            <p className="text-text-main font-medium text-lg">Arrastra tus archivos PNG aquí</p>
                            <p className="text-text-secondary text-sm mt-1">o haz click para explorar tu dispositivo</p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-6 text-[11px] sm:text-xs text-text-secondary">
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check_circle</span> Fondo transparente</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check_circle</span> 300 DPI</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check_circle</span> Modo RGB</span>
                            </div>
                        </div>

                        {loading && (
                            <div className="mt-6 flex items-center justify-center gap-2 text-primary text-sm font-medium">
                                <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
                                Procesando archivos...
                            </div>
                        )}
                    </div>

                    {/* File List */}
                    <div className="space-y-4">
                        {files.map((file) => (
                            <div key={file.id} className={`bg-surface border ${file.valid ? 'border-gray-border' : 'border-red-200 bg-red-50/50'} rounded-card p-5 transition-all hover:shadow-md`}>
                                <div className="flex flex-col sm:flex-row gap-5">
                                    {/* Preview */}
                                    <div className="w-full sm:w-20 h-40 sm:h-20 bg-muted border border-gray-border rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-dtf-texture opacity-10"></div>
                                        {file.previewUrl ? (
                                            <img src={file.previewUrl} alt="Preview" className="w-full h-full object-contain relative z-10" />
                                        ) : (
                                            <span className="material-symbols-outlined text-gray-300">image</span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-text-main text-[15px] truncate pr-4" title={file.file.name}>{file.file.name}</h3>
                                            {file.valid && (
                                                <button
                                                    onClick={() => removeFile(file.id)}
                                                    className="text-text-secondary hover:text-danger transition-colors p-1 -mr-2"
                                                    title="Eliminar archivo"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            )}
                                        </div>

                                        {file.valid ? (
                                            <>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-[13px] text-text-secondary">
                                                    <span className="flex items-center gap-1.5" title="Ancho">
                                                        <span className="material-symbols-outlined text-[16px]">aspect_ratio</span>
                                                        {file.meta.anchoCm.toFixed(1)} cm
                                                    </span>
                                                    <span className="flex items-center gap-1.5" title="Largo estimado">
                                                        <span className="material-symbols-outlined text-[16px]">straighten</span>
                                                        {file.meta.largoM.toFixed(2)} m
                                                    </span>
                                                    <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold ${file.meta.dpi < 300 ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'}`}>
                                                        {file.meta.dpi} DPI
                                                    </span>
                                                </div>

                                                {/* Quantity Control */}
                                                <div className="flex items-center mt-4 gap-3">
                                                    <span className="text-[13px] font-medium text-text-main">Copias:</span>
                                                    <div className="flex items-center bg-surface border border-gray-border rounded-lg h-[32px]">
                                                        <button
                                                            onClick={() => updateCopies(file.id, -1)}
                                                            className="w-8 h-full flex items-center justify-center hover:bg-muted text-text-secondary border-r border-gray-border"
                                                        >
                                                            -
                                                        </button>
                                                        <input
                                                            type="text"
                                                            readOnly
                                                            value={file.copies}
                                                            className="w-10 text-center text-sm font-semibold text-text-main bg-transparent outline-none"
                                                        />
                                                        <button
                                                            onClick={() => updateCopies(file.id, 1)}
                                                            className="w-8 h-full flex items-center justify-center hover:bg-muted text-text-secondary border-l border-gray-border"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="mt-2 text-sm text-danger font-medium flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[18px]">error</span>
                                                {file.errors.join(', ')}
                                            </div>
                                        )}

                                        {file.warnings.length > 0 && (
                                            <div className="mt-2 text-xs text-warning bg-warning/10 p-2 rounded flex items-start gap-2">
                                                <span className="material-symbols-outlined text-[14px] mt-0.5">warning</span>
                                                <span>{file.warnings.join(', ')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {file.valid && (
                                    <div className="mt-4 pt-4 border-t border-gray-border">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                            <span className="text-[12px] font-bold text-text-secondary uppercase tracking-widest shrink-0">Tratamientos:</span>
                                            <div className="flex flex-wrap gap-2">
                                                {[
                                                    { id: 'whites', label: 'Base Blanca' },
                                                    { id: 'blacks', label: 'Base Negra' },
                                                    { id: 'colors', label: 'Potenciar Color' },
                                                    { id: 'halftones', label: 'Semitonos' }
                                                ].map(opt => (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => toggleOption(file.id, opt.id)}
                                                        className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${file.options[opt.id]
                                                            ? 'bg-primary text-white border-primary shadow-sm'
                                                            : 'bg-surface text-text-secondary border-gray-border hover:border-gray-border/80'
                                                            }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {files.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 bg-surface border border-dashed border-gray-200 rounded-card text-text-secondary">
                                <span className="material-symbols-outlined text-[48px] opacity-20 mb-2">inventory_2</span>
                                <p className="text-sm">Tu lista de archivos está vacía</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Summary (4 cols ~ 33%) */}
                <div className="lg:col-span-4 relative">
                    <div className="sticky top-[88px] space-y-4">
                        <div className="bg-surface border border-gray-border rounded-card p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 text-text-main">
                                <span className="material-symbols-outlined">receipt_long</span>
                                <h3 className="text-lg font-bold">Resumen del Pedido</h3>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-text-secondary">Metros Lineales</span>
                                    <span className="font-semibold text-text-main text-[15px]">{effectiveMeters.toFixed(2)} m</span>
                                </div>

                                <div className="h-px bg-gray-border"></div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-secondary">Precio base</span>
                                        <span className="text-text-main">${prices.base.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-secondary">Nivel de precio</span>
                                        <span className={`font-bold border px-1.5 rounded text-xs ${tierColor}`}>
                                            {tierName}
                                        </span>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-border"></div>

                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-medium text-text-secondary">Total Estimado</span>
                                    <div className="text-right">
                                        <span className="block text-xl sm:text-2xl font-bold text-text-main tracking-tight">${total.toLocaleString()}</span>
                                        {discount > 0 && (
                                            <span className="text-[11px] sm:text-xs text-success font-medium">Ahorraste ${discount.toLocaleString()}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-[12px] font-bold text-text-secondary uppercase tracking-wider mb-2" htmlFor="obs">
                                    Observaciones
                                </label>
                                <textarea
                                    id="obs"
                                    className="w-full border border-gray-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-shadow resize-none bg-off-white focus:bg-surface"
                                    rows="3"
                                    placeholder="Detalles de entrega, especificaciones..."
                                    value={clientData.observaciones}
                                    onChange={(e) => setClientData({ ...clientData, observaciones: e.target.value })}
                                ></textarea>
                            </div>

                            <Button
                                onClick={handleConfirmOrder}
                                className="w-full shadow-lg shadow-primary/20"
                                size="lg"
                                disabled={files.length === 0 || files.some(f => !f.valid) || submitting}
                            >
                                {submitting ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Procesando...
                                    </>
                                ) : "Confirmar Pedido"}
                            </Button>

                            <div className="mt-4 text-center">
                                <p className="text-[11px] text-text-secondary">
                                    Tiempos de producción sujetos a disponibilidad.
                                </p>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-card p-5 text-white shadow-sm">
                            <div className="flex gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-sm">support_agent</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">¿Necesitas ayuda?</h4>
                                    <p className="text-xs text-slate-300 mt-1">Contacta a soporte técnico si tienes dudas con tus archivos.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                totalMeters={effectiveMeters}
                totalPrice={total}
                onPaymentVerified={handlePaymentVerified}
            />
        </>
    );
};

export default OrderPanelPage;
