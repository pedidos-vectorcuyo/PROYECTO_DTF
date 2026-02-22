import React, { useState, useEffect } from 'react';
import { fetchAllOrders, updateOrderStatus, fetchPrices, updatePrices } from '../services/api';
import Button from '../components/ui/Button';

const AdminDashboardPage = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [config, setConfig] = useState({
        textil: { base: 0, p10: 0, p30: 0, limits: { minWidth: 50, maxWidth: 56, minLength: 1, maxLength: 10 } },
        uv: { base: 0, p10: 0, p30: 0, limits: { minWidth: 25, maxWidth: 28, minLength: 0.1, maxLength: 5 } }
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [ordersData, configData] = await Promise.all([
            fetchAllOrders(),
            fetchPrices()
        ]);
        setOrders(ordersData || []);
        if (configData) setConfig(configData);
        setLoading(false);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdating(true);
        const success = await updateOrderStatus(orderId, newStatus);
        if (success) {
            setOrders(prev => prev.map(o => o.id_pedido === orderId ? { ...o, estado: newStatus } : o));
        }
        setUpdating(false);
    };

    const handleConfigUpdate = async () => {
        setUpdating(true);
        // Map back to the flat structure n8n expects (preserving backward compatibility)
        const flatConfig = {
            precio_metro: config.textil.base,
            precio_mayorista_10: config.textil.p10,
            precio_mayorista_30: config.textil.p30,
            textil_min_width: config.textil.limits.minWidth,
            textil_max_width: config.textil.limits.maxWidth,
            textil_min_length: config.textil.limits.minLength,
            textil_max_length: config.textil.limits.maxLength,
            uv_precio_metro: config.uv.base,
            uv_precio_mayorista_10: config.uv.p10,
            uv_precio_mayorista_30: config.uv.p30,
            uv_min_width: config.uv.limits.minWidth,
            uv_max_width: config.uv.limits.maxWidth,
            uv_min_length: config.uv.limits.minLength,
            uv_max_length: config.uv.limits.maxLength
        };

        const success = await updatePrices(flatConfig);
        if (success) alert("Configuración web actualizada con éxito");
        setUpdating(false);
    };

    // Filtering logic (same as before)
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id_pedido?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.cliente?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.estado === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) return <div className="p-8 text-center text-text-main">Cargando datos de administración...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-main tracking-tight">Panel de Control Admin</h1>
                    <p className="text-text-secondary mt-1">Gestión centralizada de pedidos y configuración.</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'bg-surface text-text-secondary border border-gray-border hover:border-text-secondary'}`}
                    >
                        Gestión de Pedidos
                    </button>
                    <button
                        onClick={() => setActiveTab('prices')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'prices' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'bg-surface text-text-secondary border border-gray-border hover:border-text-secondary'}`}
                    >
                        Configuración Web
                    </button>
                </div>
            </div>

            {activeTab === 'orders' ? (
                <div className="space-y-6">
                    {/* Filters Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface p-4 rounded-card border border-gray-border shadow-sm">
                        <div className="relative md:col-span-2">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[20px]">search</span>
                            <input
                                type="text"
                                placeholder="Buscar por ID de pedido o nombre de cliente..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-surface border border-gray-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-main placeholder:text-text-secondary outline-none focus:border-primary transition-all"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-surface border border-gray-border rounded-xl px-4 py-2.5 text-sm text-text-main outline-none focus:border-primary appearance-none cursor-pointer"
                        >
                            <option value="all" className="bg-surface text-text-main">Todos los estados</option>
                            <option value="pendiente" className="bg-surface text-text-main">Pendiente</option>
                            <option value="pagado" className="bg-surface text-text-main">Pagado</option>
                            <option value="listo" className="bg-surface text-text-main">Listo</option>
                            <option value="entregado" className="bg-surface text-text-main">Entregado</option>
                        </select>
                    </div>

                    <div className="bg-surface border border-gray-border rounded-card overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-muted/50 border-b border-gray-border">
                                    <tr>
                                        <th className="p-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Pedido</th>
                                        <th className="p-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Cliente</th>
                                        <th className="p-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Estado Actual</th>
                                        <th className="p-4 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-border">
                                    {filteredOrders.length > 0 ? filteredOrders.map(order => (
                                        <tr key={order.id_pedido} className="hover:bg-muted/20 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-text-main">#{order.id_pedido}</div>
                                                <div className="text-[11px] text-text-secondary font-medium">{order.fecha}</div>
                                            </td>
                                            <td className="p-4 text-sm font-medium text-text-main">{order.cliente}</td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${order.estado === 'pendiente' ? 'bg-warning/10 text-warning' :
                                                    order.estado === 'pagado' ? 'bg-primary/10 text-primary' :
                                                        order.estado === 'listo' ? 'bg-success/10 text-success' :
                                                            order.estado === 'entregado' ? 'bg-surface-raised text-text-secondary border border-gray-border' : 'bg-muted text-text-secondary'
                                                    }`}>
                                                    {order.estado}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <select
                                                    value={order.estado}
                                                    disabled={updating}
                                                    onChange={(e) => handleStatusChange(order.id_pedido, e.target.value)}
                                                    className="bg-surface border border-gray-border rounded-lg px-2 py-1.5 text-xs text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium"
                                                >
                                                    <option value="pendiente">Marcar Pendiente</option>
                                                    <option value="pagado">Confirmar Pago</option>
                                                    <option value="listo">Marcar como Listo</option>
                                                    <option value="entregado">Marcar Entregado</option>
                                                </select>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="p-10 text-center text-text-secondary italic">
                                                No se encontraron pedidos con el filtro actual.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* DTF TEXTIL CONFIG */}
                        <div className="bg-surface border border-gray-border rounded-card p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 text-primary">
                                <span className="material-symbols-outlined">apparel</span>
                                <h3 className="text-lg font-bold text-text-main">Configuración DTF Textil</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Prices */}
                                <div className="space-y-4">
                                    <p className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.2em]">Escalas de Precios</p>
                                    <div>
                                        <label className="block text-xs font-medium text-text-secondary mb-1.5 text-left">Precio Base ($ / Metro)</label>
                                        <input
                                            type="number"
                                            value={config.textil.base}
                                            onChange={(e) => setConfig({ ...config, textil: { ...config.textil, base: parseFloat(e.target.value) } })}
                                            className="w-full bg-surface border border-gray-border rounded-xl px-4 py-2.5 text-text-main outline-none focus:border-primary font-medium"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-text-secondary mb-1.5 text-left">Mayorista ({">"}10m)</label>
                                            <input
                                                type="number"
                                                value={config.textil.p10}
                                                onChange={(e) => setConfig({ ...config, textil: { ...config.textil, p10: parseFloat(e.target.value) } })}
                                                className="w-full bg-surface border border-gray-border rounded-xl px-4 py-2.5 text-text-main outline-none focus:border-primary font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-text-secondary mb-1.5 text-left">Platinum ({">"}30m)</label>
                                            <input
                                                type="number"
                                                value={config.textil.p30}
                                                onChange={(e) => setConfig({ ...config, textil: { ...config.textil, p30: parseFloat(e.target.value) } })}
                                                className="w-full bg-surface border border-gray-border rounded-xl px-4 py-2.5 text-text-main outline-none focus:border-primary font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Limits */}
                                <div className="space-y-4 pt-4 border-t border-gray-border">
                                    <p className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.2em]">Límites de Producción</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-text-secondary mb-1.5 text-left">Ancho Mínimo (cm)</label>
                                            <input
                                                type="number"
                                                value={config.textil.limits.minWidth}
                                                onChange={(e) => setConfig({ ...config, textil: { ...config.textil, limits: { ...config.textil.limits, minWidth: parseFloat(e.target.value) } } })}
                                                className="w-full bg-surface border border-gray-border rounded-xl px-4 py-2.5 text-text-main outline-none focus:border-primary font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-text-secondary mb-1.5 text-left">Ancho Máximo (cm)</label>
                                            <input
                                                type="number"
                                                value={config.textil.limits.maxWidth}
                                                onChange={(e) => setConfig({ ...config, textil: { ...config.textil, limits: { ...config.textil.limits, maxWidth: parseFloat(e.target.value) } } })}
                                                className="w-full bg-surface border border-gray-border rounded-xl px-4 py-2.5 text-text-main outline-none focus:border-primary font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-text-secondary mb-1.5 text-left">Largo Mínimo (m)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={config.textil.limits.minLength}
                                                onChange={(e) => setConfig({ ...config, textil: { ...config.textil, limits: { ...config.textil.limits, minLength: parseFloat(e.target.value) } } })}
                                                className="w-full bg-surface border border-gray-border rounded-xl px-4 py-2.5 text-text-main outline-none focus:border-primary font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-text-secondary mb-1.5 text-left">Largo Máximo (m)</label>
                                            <input
                                                type="number"
                                                value={config.textil.limits.maxLength}
                                                onChange={(e) => setConfig({ ...config, textil: { ...config.textil, limits: { ...config.textil.limits, maxLength: parseFloat(e.target.value) } } })}
                                                className="w-full bg-surface border border-gray-border rounded-xl px-4 py-2.5 text-text-main outline-none focus:border-primary font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DTF UV CONFIG */}
                        <div className="bg-surface border border-gray-border rounded-card p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 text-warning">
                                <span className="material-symbols-outlined">filter_drama</span>
                                <h3 className="text-lg font-bold text-text-main">Configuración DTF UV</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Prices */}
                                <div className="space-y-4">
                                    <p className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.2em]">Escalas de Precios (UV)</p>
                                    <div>
                                        <label className="block text-xs font-medium text-text-secondary mb-1.5 text-left">Precio Base ($ / Metro)</label>
                                        <input
                                            type="number"
                                            value={config.uv.base}
                                            onChange={(e) => setConfig({ ...config, uv: { ...config.uv, base: parseFloat(e.target.value) } })}
                                            className="w-full bg-surface border border-gray-border rounded-xl px-4 py-2.5 text-text-main outline-none focus:border-primary font-medium"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-text-secondary mb-1.5 text-left">Mayorista ({">"}10m)</label>
                                            <input
                                                type="number"
                                                value={config.uv.p10}
                                                onChange={(e) => setConfig({ ...config, uv: { ...config.uv, p10: parseFloat(e.target.value) } })}
                                                className="w-full bg-surface border border-gray-border rounded-xl px-4 py-2.5 text-text-main outline-none focus:border-primary font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-text-secondary mb-1.5 text-left">Platinum ({">"}30m)</label>
                                            <input
                                                type="number"
                                                value={config.uv.p30}
                                                onChange={(e) => setConfig({ ...config, uv: { ...config.uv, p30: parseFloat(e.target.value) } })}
                                                className="w-full bg-surface border border-gray-border rounded-xl px-4 py-2.5 text-text-main outline-none focus:border-primary font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Limits */}
                                <div className="space-y-4 pt-4 border-t border-gray-border">
                                    <p className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.2em]">Límites UV</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-text-secondary mb-1.5 text-left">Ancho Mínimo (cm)</label>
                                            <input
                                                type="number"
                                                value={config.uv.limits.minWidth}
                                                onChange={(e) => setConfig({ ...config, uv: { ...config.uv, limits: { ...config.uv.limits, minWidth: parseFloat(e.target.value) } } })}
                                                className="w-full bg-surface border border-gray-border rounded-xl px-4 py-2.5 text-text-main outline-none focus:border-primary font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-text-secondary mb-1.5 text-left">Ancho Máximo (cm)</label>
                                            <input
                                                type="number"
                                                value={config.uv.limits.maxWidth}
                                                onChange={(e) => setConfig({ ...config, uv: { ...config.uv, limits: { ...config.uv.limits, maxWidth: parseFloat(e.target.value) } } })}
                                                className="w-full bg-surface border border-gray-border rounded-xl px-4 py-2.5 text-text-main outline-none focus:border-primary font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-text-secondary mb-1.5 text-left">Largo Mínimo (m)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={config.uv.limits.minLength}
                                                onChange={(e) => setConfig({ ...config, uv: { ...config.uv, limits: { ...config.uv.limits, minLength: parseFloat(e.target.value) } } })}
                                                className="w-full bg-surface border border-gray-border rounded-xl px-4 py-2.5 text-text-main outline-none focus:border-primary font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-text-secondary mb-1.5 text-left">Largo Máximo (m)</label>
                                            <input
                                                type="number"
                                                value={config.uv.limits.maxLength}
                                                onChange={(e) => setConfig({ ...config, uv: { ...config.uv, limits: { ...config.uv.limits, maxLength: parseFloat(e.target.value) } } })}
                                                className="w-full bg-surface border border-gray-border rounded-xl px-4 py-2.5 text-text-main outline-none focus:border-primary font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={handleConfigUpdate}
                            className="w-full md:w-auto px-12 py-4 text-base shadow-xl shadow-primary/20"
                            disabled={updating}
                        >
                            <span className="flex items-center gap-2">
                                {updating ? (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <span className="material-symbols-outlined">save</span>
                                )}
                                Guardar Toda la Configuración Web
                            </span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;
