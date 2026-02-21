import React, { useState, useEffect } from 'react';
import { fetchAllOrders, updateOrderStatus, fetchPrices, updatePrices } from '../services/api';
import Button from '../components/ui/Button';

const AdminDashboardPage = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [prices, setPrices] = useState({ base: 0, p10: 0, p30: 0 });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [ordersData, pricesData] = await Promise.all([
            fetchAllOrders(),
            fetchPrices()
        ]);
        setOrders(ordersData || []);
        setPrices(pricesData || { base: 0, p10: 0, p30: 0 });
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

    const handlePriceUpdate = async () => {
        setUpdating(true);
        const success = await updatePrices({
            precio_metro: prices.base,
            precio_mayorista_10: prices.p10,
            precio_mayorista_30: prices.p30
        });
        if (success) alert("Precios actualizados con éxito");
        setUpdating(false);
    };

    // Filtering logic
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
                                className="w-full bg-muted/30 border border-gray-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-main outline-none focus:border-primary transition-all"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-muted/30 border border-gray-border rounded-xl px-4 py-2.5 text-sm text-text-main outline-none focus:border-primary"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="pagado">Pagado</option>
                            <option value="listo">Listo</option>
                            <option value="entregado">Entregado</option>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-surface border border-gray-border rounded-card p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <span className="material-symbols-outlined">payments</span>
                            <h3 className="text-lg font-bold text-text-main">Precios DTF Textil</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Precio Base (por metro)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary font-bold">$</span>
                                    <input
                                        type="number"
                                        value={prices.base}
                                        onChange={(e) => setPrices({ ...prices, base: parseFloat(e.target.value) })}
                                        className="w-full bg-muted/30 border border-gray-border rounded-xl pl-8 pr-4 py-3 text-text-main outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Mayorista (+10m)</label>
                                    <input
                                        type="number"
                                        value={prices.p10}
                                        onChange={(e) => setPrices({ ...prices, p10: parseFloat(e.target.value) })}
                                        className="w-full bg-muted/30 border border-gray-border rounded-xl p-3 text-text-main outline-none focus:border-primary font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">Platinum (+30m)</label>
                                    <input
                                        type="number"
                                        value={prices.p30}
                                        onChange={(e) => setPrices({ ...prices, p30: parseFloat(e.target.value) })}
                                        className="w-full bg-muted/30 border border-gray-border rounded-xl p-3 text-text-main outline-none focus:border-primary font-medium"
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={handlePriceUpdate}
                                className="w-full mt-4 py-3"
                                disabled={updating}
                            >
                                {updating ? "Procesando..." : "Actualizar Precios en la Web"}
                            </Button>
                        </div>
                    </div>

                    <div className="bg-surface border border-gray-border rounded-card p-6 shadow-sm opacity-50 cursor-not-allowed">
                        <div className="flex items-center gap-2 mb-6 text-text-secondary">
                            <span className="material-symbols-outlined">settings</span>
                            <h3 className="text-lg font-bold">Otros Ajustes</h3>
                        </div>
                        <p className="text-sm text-text-secondary italic">Más configuraciones próximamente...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;
