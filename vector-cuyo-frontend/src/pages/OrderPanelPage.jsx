
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthProvider';
import { processFile } from '../utils/fileProcessor';
import { fetchPrices, submitOrder } from '../services/api';

const OrderPanelPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
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
        const newFiles = [];
        for (let i = 0; i < fileList.length; i++) {
            const processed = await processFile(fileList[i]);
            newFiles.push({
                id: Date.now() + Math.random(),
                file: fileList[i],
                ...processed,
                copies: 1,
                options: {
                    whites: false,
                    blacks: false,
                    colors: false,
                    halftones: false
                }
            });
        }
        setFiles(prev => [...prev, ...newFiles]);
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
    let tierColor = "bg-blue-100 text-blue-800";

    if (effectiveMeters > 30) {
        currentPrice = prices.p30;
        tierName = "GOLD (>30m)";
        tierColor = "bg-yellow-100 text-yellow-800";
    } else if (effectiveMeters > 10) {
        currentPrice = prices.p10;
        tierName = "MAYORISTA (>10m)";
        tierColor = "bg-green-100 text-green-800";
    }

    const subtotal = effectiveMeters * prices.base;
    const total = effectiveMeters * currentPrice;
    const discount = subtotal - total;

    const handleSubmitOrder = async () => {
        if (!user) {
            alert("Debes iniciar sesión para confirmar el pedido.");
            navigate('/login');
            return;
        }

        setSubmitting(true);
        const validFiles = files.filter(f => f.valid);
        const orderId = `PED-${Date.now()}`;
        const shortDate = new Date().toISOString().slice(2, 10).replace(/-/g, '.');
        const clientName = user.nombre || 'Cliente';

        let successCount = 0;
        let failCount = 0;

        // Process each file upload individually as per original logic to avoid huge payloads
        for (let i = 0; i < validFiles.length; i++) {
            const item = validFiles[i];
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

            const result = await submitOrder(fd);
            if (result) successCount++;
            else failCount++;
        }

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
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Panel: Upload & List */}
            <div className="w-full lg:w-2/3 space-y-6">
                <div className="bg-surface border border-gray-border rounded-card p-6">
                    <h2 className="text-[20px] font-bold text-text-main mb-4">Cargar Archivos</h2>

                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'}`}
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
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                            <span className="material-symbols-outlined text-[32px]">cloud_upload</span>
                        </div>
                        <p className="text-text-main font-medium">Arrastra tus archivos PNG aquí</p>
                        <p className="text-text-secondary text-sm mt-1">o haz click para explorar</p>
                        <p className="text-xs text-text-secondary mt-4">Solo archivos PNG a 300 DPI con fondo transparente</p>
                    </div>

                    {loading && (
                        <div className="mt-4 text-center text-primary text-sm font-medium animate-pulse">
                            Procesando archivos...
                        </div>
                    )}
                </div>

                {/* File List */}
                <div className="space-y-4">
                    {files.map((file) => (
                        <div key={file.id} className={`bg-surface border ${file.valid ? 'border-gray-border' : 'border-red-300 bg-red-50'} rounded-card p-4 transition-all hover:shadow-sm`}>
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-off-white rounded-lg border border-gray-border flex items-center justify-center shrink-0 overflow-hidden">
                                        {file.previewUrl ? (
                                            <img src={file.previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="material-symbols-outlined text-gray-400">image</span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-text-main text-sm truncate max-w-[200px]">{file.file.name}</h3>

                                        {file.valid ? (
                                            <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary">
                                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">aspect_ratio</span> {file.meta.anchoCm.toFixed(1)} cm</span>
                                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">straighten</span> {file.meta.largoM.toFixed(2)} m</span>
                                                <span className={`px-1.5 py-0.5 rounded ${file.meta.dpi < 300 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{file.meta.dpi} DPI</span>
                                            </div>
                                        ) : (
                                            <div className="mt-1 text-xs text-red-600 font-medium">
                                                {file.errors.join(', ')}
                                            </div>
                                        )}

                                        {file.warnings.length > 0 && (
                                            <div className="mt-1 text-xs text-yellow-600">
                                                ⚠️ {file.warnings.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {file.valid && (
                                    <div className="flex flex-col items-end gap-3">
                                        <button
                                            onClick={() => removeFile(file.id)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>

                                        <div className="flex items-center border border-gray-border rounded-lg h-8">
                                            <button onClick={() => updateCopies(file.id, -1)} className="px-2 hover:bg-gray-50 text-gray-600">-</button>
                                            <span className="px-2 text-sm font-medium w-8 text-center">{file.copies}</span>
                                            <button onClick={() => updateCopies(file.id, 1)} className="px-2 hover:bg-gray-50 text-gray-600">+</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {file.valid && (
                                <div className="mt-4 pt-3 border-t border-gray-border flex gap-2 overflow-x-auto">
                                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide py-1.5">Opciones:</span>
                                    <button
                                        onClick={() => toggleOption(file.id, 'whites')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${file.options.whites ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200 hover:border-primary'}`}
                                    >BLANCAS</button>
                                    <button
                                        onClick={() => toggleOption(file.id, 'blacks')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${file.options.blacks ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200 hover:border-primary'}`}
                                    >NEGRAS</button>
                                    <button
                                        onClick={() => toggleOption(file.id, 'colors')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${file.options.colors ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200 hover:border-primary'}`}
                                    >COLORES</button>
                                    <button
                                        onClick={() => toggleOption(file.id, 'halftones')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${file.options.halftones ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200 hover:border-primary'}`}
                                    >SEMITONOS</button>
                                </div>
                            )}
                        </div>
                    ))}

                    {files.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            No has cargado archivos todavía.
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel: Summary */}
            <div className="w-full lg:w-1/3 shrink-0">
                <div className="sticky top-24 bg-surface border border-gray-border rounded-card p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-text-main mb-4">Resumen del Pedido</h3>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Metros Totales</span>
                            <span className="font-medium text-text-main">{effectiveMeters.toFixed(2)} m</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Precio por metro</span>
                            <span className="font-medium text-text-main">${currentPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-gray-border">
                            <span className="text-text-secondary">Subtotal</span>
                            <span className="font-medium text-text-main">${subtotal.toLocaleString()}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Descuento Volumen</span>
                                <span>-${discount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-end pt-4 border-t border-gray-border">
                            <span className="font-bold text-lg text-text-main">Total</span>
                            <span className="font-bold text-2xl text-primary">${total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-medium text-text-secondary mb-1">Observaciones</label>
                        <textarea
                            className="w-full border border-gray-border rounded-lg p-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                            rows="2"
                            placeholder="Instrucciones especiales..."
                            value={clientData.observaciones}
                            onChange={(e) => setClientData({ ...clientData, observaciones: e.target.value })}
                        ></textarea>
                    </div>

                    <div className={`mb-6 p-2 rounded text-center text-xs font-bold uppercase tracking-wide ${tierColor}`}>
                        {tierName}
                    </div>

                    <button
                        onClick={handleSubmitOrder}
                        className="w-full bg-primary hover:bg-[#1e40af] text-white py-3.5 rounded-card font-bold text-sm tracking-wide transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        disabled={files.length === 0 || files.some(f => !f.valid) || submitting}
                    >
                        {submitting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Enviando...
                            </>
                        ) : "Confirmar Pedido"}
                    </button>

                    <p className="text-xs text-center text-text-secondary mt-4">
                        Al confirmar, aceptas nuestros <a href="/legal" className="underline hover:text-primary">términos de servicio</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderPanelPage;
