
import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthProvider';
import { processFile } from '../utils/fileProcessor';
import { fetchPrices, submitOrder, submitB2BOrder } from '../services/api';
import Button from '../components/ui/Button';
import PaymentModal from '../components/orders/PaymentModal';

// Memoized component to optimize performance
const FileItem = memo(({ file, productType, removeFile, updateCopies, toggleOption }) => {
    if (file.productType !== productType) return null;

    if (file.loading) {
        return (
            <div className="bg-surface border border-gray-border rounded-card p-5 opacity-60">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center animate-pulse">
                        <span className="material-symbols-outlined text-gray-300">hourglass_empty</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-text-main text-sm animate-pulse">{file.name}</h3>
                        <p className="text-xs text-text-secondary mt-1">Procesando imagen...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div key={file.id} className={`bg-surface border ${file.valid ? 'border-gray-border' : 'border-red-200 bg-red-50/50'} rounded-card p-5 transition-all hover:shadow-md`}>
            <div className="flex flex-col sm:flex-row gap-5">
                <div className="w-full sm:w-20 h-40 sm:h-20 bg-muted border border-gray-border rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative">
                    <div className="absolute inset-0 bg-dtf-texture opacity-10"></div>
                    {file.previewUrl ? (
                        <img src={file.previewUrl} alt="Preview" className="w-full h-full object-contain relative z-10" />
                    ) : (
                        <span className="material-symbols-outlined text-gray-300">image</span>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <h3 className="font-semibold text-text-main text-[15px] truncate" title={file.file.name}>{file.file.name}</h3>
                            {file.productType === 'uv' && <span className="px-1.5 py-0.5 bg-warning/20 text-warning text-[10px] font-bold rounded">UV</span>}
                        </div>
                        <button
                            onClick={() => removeFile(file.id)}
                            className="text-text-secondary hover:text-danger transition-colors p-1 -mr-2"
                            title="Eliminar archivo"
                        >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                    </div>

                    {file.valid ? (
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-[13px] text-text-secondary">
                                <span className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[16px]">aspect_ratio</span>
                                    {file.meta.anchoCm.toFixed(1)} cm
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[16px]">straighten</span>
                                    {file.meta.largoM.toFixed(2)} m
                                </span>
                                <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${file.meta.dpi < 300 ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'}`}>
                                    {file.meta.dpi} DPI
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-[13px] font-medium text-text-main">Copias:</span>
                                <div className="flex items-center bg-surface border border-gray-border rounded-lg h-[32px]">
                                    <button onClick={() => updateCopies(file.id, -1)} className="w-8 h-full flex items-center justify-center hover:bg-muted border-r border-gray-border">-</button>
                                    <input type="text" readOnly value={file.copies} className="w-10 text-center text-sm font-semibold bg-transparent" />
                                    <button onClick={() => updateCopies(file.id, 1)} className="w-8 h-full flex items-center justify-center hover:bg-muted border-l border-gray-border">+</button>
                                </div>
                            </div>

                            {/* Options Grid - Moved Below Copies */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-3 border-y border-gray-border">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={file.options.whites}
                                        onChange={() => toggleOption(file.id, 'whites')}
                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                                    />
                                    <span className="text-[11px] font-medium text-text-secondary group-hover:text-text-main transition-colors">ByN (Solo Negro)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={file.options.blacks}
                                        onChange={() => toggleOption(file.id, 'blacks')}
                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                                    />
                                    <span className="text-[11px] font-medium text-text-secondary group-hover:text-text-main transition-colors">Quitar Negro</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={file.options.colors}
                                        onChange={() => toggleOption(file.id, 'colors')}
                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                                    />
                                    <span className="text-[11px] font-medium text-text-secondary group-hover:text-text-main transition-colors">Limpieza Color</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={file.options.halftones}
                                        onChange={() => toggleOption(file.id, 'halftones')}
                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                                    />
                                    <span className="text-[11px] font-medium text-text-secondary group-hover:text-text-main transition-colors">Quitar Fondo</span>
                                </label>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-2 text-sm text-danger font-medium flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            {file.errors.join(', ')}
                        </div>
                    )}

                    {file.warnings.length > 0 && (
                        <div className="mt-2 text-xs text-warning bg-warning/10 p-2 rounded flex items-start gap-2 border border-warning/20">
                            <span className="material-symbols-outlined text-[14px] mt-0.5">warning</span>
                            <span>{file.warnings.join(', ')}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

const OrderPanelPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [productType, setProductType] = useState('textil'); // Default to textil
    const [config, setConfig] = useState({
        textil: { base: 13500, p10: 11500, p30: 10500, limits: { minWidth: 50, maxWidth: 58, minLength: 1, maxLength: 10 } },
        uv: { base: 18000, p10: 16000, p30: 15000, limits: { minWidth: 25, maxWidth: 28, minLength: 0.1, maxLength: 5 } }
    });
    const [clientData, setClientData] = useState({
        observaciones: '',
        tokenReceptor: ''
    });

    useEffect(() => {
        // Load configuration on mount
        const loadConfig = async () => {
            const c = await fetchPrices();
            if (c) setConfig(c);
        };
        loadConfig();
    }, []);

    // Helper to get active product configuration
    const activeConfig = config[productType];

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
        const fileArray = Array.from(fileList);

        // Add placeholders immediately to avoid blocking UI
        const newPlaceholders = fileArray.map(f => ({
            id: 'temp-' + Math.random(),
            name: f.name,
            loading: true,
            productType: productType,
            file: f
        }));

        setFiles(prev => [...prev, ...newPlaceholders]);
        setLoading(true);

        // Process sequentially with yields
        for (const placeholder of newPlaceholders) {
            try {
                // Yield to allow UI update
                await new Promise(resolve => setTimeout(resolve, 0));

                const processed = await processFile(placeholder.file);

                const warnings = [...processed.warnings];
                const { minWidth, maxWidth, minLength, maxLength } = activeConfig.limits;

                if (processed.meta.anchoCm < minWidth) {
                    warnings.push(`Aprovechamiento bajo: ${processed.meta.anchoCm.toFixed(1)}cm (Recomendado: min ${minWidth}cm)`);
                }
                if (processed.meta.anchoCm > maxWidth + 0.1) {
                    processed.valid = false;
                    processed.errors.push(`Ancho excede el máximo: ${processed.meta.anchoCm.toFixed(1)}cm (Máx: ${maxWidth}cm)`);
                }
                if (processed.meta.largoM < minLength) {
                    warnings.push(`Largo menor al mínimo (${minLength}m). Se cobrará el mínimo.`);
                }
                if (processed.meta.largoM > maxLength) {
                    warnings.push(`Largo excede el máximo recomendado (${maxLength}m)`);
                }

                setFiles(prev => prev.map(f => f.id === placeholder.id ? {
                    ...f,
                    ...processed,
                    id: Date.now() + Math.random(),
                    loading: false,
                    warnings: warnings,
                    copies: 1,
                    options: {
                        whites: false,
                        blacks: false,
                        colors: false,
                        halftones: false
                    }
                } : f));
            } catch (err) {
                console.error("Error processing file:", placeholder.name, err);
                setFiles(prev => prev.filter(f => f.id !== placeholder.id));
            }
        }

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

    // Memoized calculations to prevent lag on every keypress/click
    const activeFiles = useMemo(() => files.filter(f => f.productType === productType), [files, productType]);

    const totalMeters = useMemo(() => activeFiles.reduce((acc, curr) => {
        if (!curr.valid) return acc;
        return acc + (curr.meta.largoM * curr.copies);
    }, 0), [activeFiles]);

    const effectiveMeters = useMemo(() => totalMeters > 0 ? Math.max(activeConfig.limits.minLength, Math.ceil(totalMeters * 10) / 10) : 0, [totalMeters, activeConfig]);

    const budget = useMemo(() => {
        let currentPrice = activeConfig.base;
        let tierName = "Precio Base";
        let tierColor = "bg-blue-tint text-primary border-primary/20";

        if (effectiveMeters > 30) {
            currentPrice = activeConfig.p30;
            tierName = "GOLD (>30m)";
            tierColor = "bg-warning/10 text-warning border-warning/20";
        } else if (effectiveMeters > 10) {
            currentPrice = activeConfig.p10;
            tierName = "MAYORISTA (>10m)";
            tierColor = "bg-success/10 text-success border-success/20";
        }

        const subtotal = effectiveMeters * activeConfig.base;
        const total = effectiveMeters * currentPrice;
        const discount = subtotal - total;

        return { currentPrice, tierName, tierColor, total, discount };
    }, [effectiveMeters, activeConfig]);

    const { tierName, tierColor, total, discount } = budget;

    const performOrderSubmission = useCallback(async () => {
        setSubmitting(true);
        const validFiles = activeFiles.filter(f => f.valid);
        const orderId = `PED-${Date.now()}`;
        const shortDate = new Date().toISOString().slice(2, 10).replace(/-/g, '.');
        const clientName = user.nombre_completo || user.nombre || 'Cliente';

        // Upload files in parallel
        const uploadPromises = validFiles.map(async (item, i) => {
            try {
                // Determine name and clean it for SQL safety (n8n fix)
                let cleanOriginalName = item.file.name.replace(/'/g, "");
                const cleanNameWithoutExt = cleanOriginalName.replace(/\.[^/.]+$/, "");
                const originalExtension = cleanOriginalName.split('.').pop();

                const propsMap = { whites: 'B', blacks: 'N', colors: 'C', halftones: 'S' };
                const activeProps = Object.keys(item.options).filter(k => item.options[k]).map(k => propsMap[k]);
                const codes = activeProps.length > 0 ? activeProps.join('') : 'Gral';
                const typeCode = productType === 'uv' ? '[UV]' : '[TEX]';
                const finalName = `${shortDate} - ${clientName} ${typeCode}(${cleanNameWithoutExt})x${item.copies}${codes}.${originalExtension}`;

                const fd = new FormData();
                const nombreEmisor = user.nombre_completo || user.nombre || 'S/N';

                // Append data
                fd.append("data", item.file, finalName);
                fd.append("idPedido", orderId);
                fd.append("cliente", nombreEmisor);
                fd.append("email", user.correo || '');
                fd.append("telefono", user.whatsapp || '');
                fd.append("observaciones", clientData.observaciones);

                // Explicit fields for n8n body
                fd.append("nombre_archivo", finalName);
                fd.append("nombre_emisor", nombreEmisor);

                // Metrics
                fd.append("anchoCm", item.meta.anchoCm);
                fd.append("largoM", item.meta.largoM);
                fd.append("copias", item.copies);
                fd.append("productType", productType === 'uv' ? 'DTF UV' : 'DTF Textil');
                fd.append("propiedades", `#${i + 1}(${codes})`);

                // Totals - This uses the calculated total for the WHOLE order 
                fd.append("precioCotizado", total);
                fd.append("precio_final", total.toLocaleString('es-AR', { useGrouping: false }));

                fd.append("totalArchivos", validFiles.length);
                fd.append("indiceArchivo", i + 1);

                // B2B Metadata and initial state
                if (clientData.tokenReceptor?.trim()) {
                    fd.append("id_cliente", clientData.tokenReceptor.trim()); // Temporary mapping for n8n lookup
                    fd.append("token_receptor", clientData.tokenReceptor.trim());
                    fd.append("id_emisor", user.id);
                    fd.append("estado", "Pendiente de Pago");
                    // nombre_emisor is already appended above
                    if (user.token_b2b) fd.append("token_emisor", user.token_b2b);

                    // Specific prices for B2B - ensures string format n8n likes
                    fd.append("precio_b2b", total.toString());

                    return await submitOrder(fd, true);
                }

                return await submitOrder(fd);
            } catch (err) {
                console.error("Single file upload error:", err);
                return false;
            }
        });

        const results = await Promise.all(uploadPromises);

        const successCount = results.filter(r => r).length;
        const failCount = results.length - successCount;

        setSubmitting(false);

        if (failCount === 0) {
            alert("✅ ¡Pedido Creado con Éxito!");
            setFiles(prev => prev.filter(f => f.productType !== productType));
            navigate('/dashboard');
        } else {
            alert(`⚠️ Se procesaron ${successCount} archivos satisfactoriamente, pero ${failCount} fallaron. Por favor reintenta.`);
        }
    }, [activeFiles, user, clientData, total, productType, navigate]);

    const handleConfirmOrder = useCallback(() => {
        if (!user) {
            alert("Debes iniciar sesión para confirmar el pedido.");
            navigate('/login');
            return;
        }

        if (activeFiles.length === 0 || activeFiles.some(f => !f.valid)) {
            alert("Por favor revisa que todos los archivos sean válidos.");
            return;
        }

        if (clientData.tokenReceptor?.trim()) {
            if (clientData.tokenReceptor.trim() === user.token_b2b) {
                alert("No puedes enviarte un pedido a ti mismo usando tu propio token.");
                return;
            }
            if (window.confirm(`¿Confirmas que deseas enviar este pedido al cliente con Token [${clientData.tokenReceptor}]? El cliente deberá pagarlo desde su perfil.`)) {
                performOrderSubmission();
            }
        } else {
            setShowPaymentModal(true);
        }
    }, [user, activeFiles, clientData, navigate, performOrderSubmission]);

    const handlePaymentVerified = useCallback(async () => {
        setShowPaymentModal(false);
        await performOrderSubmission();
    }, [performOrderSubmission]);

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-surface border border-gray-border rounded-card p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-[18px] sm:text-[20px] font-bold text-text-main">
                                    {productType === 'uv' ? 'Lámina DTF UV' : 'Lámina DTF Textil'}
                                </h2>
                                <p className="text-xs text-text-secondary mt-1">Selecciona el tipo de impresión para tu diseño</p>
                            </div>

                            {/* Product Selector Tap */}
                            <div className="flex bg-muted p-1 rounded-xl border border-gray-border">
                                <button
                                    onClick={() => setProductType('textil')}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${productType === 'textil' ? 'bg-surface text-primary shadow-sm border border-gray-border' : 'text-text-secondary hover:text-text-main'}`}
                                >
                                    DTF Textil
                                </button>
                                <button
                                    onClick={() => setProductType('uv')}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${productType === 'uv' ? 'bg-surface text-warning shadow-sm border border-gray-border' : 'text-text-secondary hover:text-text-main'}`}
                                >
                                    DTF UV [Beta]
                                </button>
                            </div>
                        </div>

                        <div
                            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${dragActive ? 'border-primary bg-blue-tint' : 'border-gray-border hover:border-primary hover:bg-muted'}`}
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
                            <div className={`w-16 h-16 bg-surface border border-gray-border rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm ${productType === 'uv' ? 'text-warning' : 'text-primary'}`}>
                                <span className="material-symbols-outlined text-[32px]">cloud_upload</span>
                            </div>
                            <p className="text-text-main font-medium text-lg">Arrastra tus archivos PNG aquí</p>
                            <p className="text-text-secondary text-sm mt-1">o haz click para explorar tu dispositivo</p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-6 text-[11px] sm:text-xs text-text-secondary">
                                <span className="flex items-center gap-1 font-bold text-text-main">
                                    <span className="material-symbols-outlined text-[14px]">info</span>
                                    Ancho: {activeConfig.limits.minWidth} - {activeConfig.limits.maxWidth}cm
                                </span>
                                <span className="flex items-center gap-1 font-bold text-text-main">
                                    <span className="material-symbols-outlined text-[14px]">info</span>
                                    Largo: {activeConfig.limits.minLength} - {activeConfig.limits.maxLength}m
                                </span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check_circle</span> Fondo transparente</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check_circle</span> 300 DPI</span>
                            </div>
                        </div>

                        {loading && (
                            <div className="mt-6 flex items-center justify-center gap-2 text-primary text-sm font-medium">
                                <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
                                Procesando archivos...
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        {files.map((file) => (
                            <FileItem
                                key={file.id}
                                file={file}
                                productType={productType}
                                removeFile={removeFile}
                                updateCopies={updateCopies}
                                toggleOption={toggleOption}
                            />
                        ))}

                        {activeFiles.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 bg-surface border border-dashed border-gray-border rounded-card text-text-secondary">
                                <span className="material-symbols-outlined text-[48px] opacity-20 mb-2">upload_file</span>
                                <p className="text-sm">Tu lista de archivos {productType === 'uv' ? 'UV' : 'Textil'} está vacía</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-4 relative">
                    <div className="sticky top-[88px] space-y-4">
                        <div className="bg-surface border border-gray-border rounded-card p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 text-text-main">
                                <span className="material-symbols-outlined">analytics</span>
                                <h3 className="text-lg font-bold text-text-main">Presupuesto {productType === 'uv' ? 'UV' : 'Textil'}</h3>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-text-secondary">Metros Totales</span>
                                    <span className="font-bold text-text-main">{effectiveMeters.toFixed(2)} m</span>
                                </div>

                                <div className="p-3 bg-muted rounded-xl border border-gray-border space-y-2">
                                    <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold text-text-secondary">
                                        <span>Precio Unitario</span>
                                        <span>Subtotal</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${tierColor}`}>
                                            {tierName}
                                        </span>
                                        <span className="font-bold text-text-main text-lg">${total.toLocaleString()}</span>
                                    </div>
                                </div>

                                {discount > 0 && (
                                    <div className="bg-success/10 border border-success/20 p-2 rounded-lg text-center">
                                        <p className="text-[11px] text-success font-bold">¡Ahorraste ${discount.toLocaleString()} con descuento por volumen!</p>
                                    </div>
                                )}
                            </div>

                            <div className="mb-6 space-y-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-2 px-1">Notas Adicionales</label>
                                    <textarea
                                        className="w-full border border-gray-border rounded-xl p-3 text-sm focus:border-primary outline-none transition-all bg-muted text-text-main focus:bg-surface-raised h-24 resize-none dark:bg-slate-900 dark:text-white"
                                        placeholder="Instrucciones especiales para tu pedido..."
                                        value={clientData.observaciones}
                                        onChange={(e) => setClientData({ ...clientData, observaciones: e.target.value })}
                                    />
                                </div>
                                <div className="p-4 bg-blue-tint border border-primary/20 rounded-xl">
                                    <label className="flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-widest mb-2">
                                        <span className="material-symbols-outlined text-[16px]">point_of_sale</span>
                                        ¿Enviar a un Cliente? (Token Único)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ingresa el Token Único del Cliente"
                                        className="w-full border border-gray-border rounded-lg p-2.5 text-sm focus:border-primary outline-none transition-all bg-surface text-text-main"
                                        value={clientData.tokenReceptor}
                                        onChange={(e) => setClientData({ ...clientData, tokenReceptor: e.target.value.toUpperCase() })}
                                    />
                                    <p className="text-[10px] text-text-secondary mt-2 leading-tight italic">Si ingresas un token, el cliente recibirá el pedido en su perfil para que él realice el pago.</p>
                                </div>
                            </div>

                            <Button
                                onClick={handleConfirmOrder}
                                className={`w-full py-4 text-base shadow-lg ${productType === 'uv' ? 'shadow-warning/20' : 'shadow-primary/20'}`}
                                disabled={activeFiles.length === 0 || activeFiles.some(f => !f.valid) || submitting}
                            >
                                {submitting ? "Procesando..." : (clientData.tokenReceptor?.trim() ? "Enviar al Cliente" : "Confirmar e Ir al Pago")}
                            </Button>
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
