import React, { useState, useEffect } from 'react';
import { fetchAllOrders, updateOrderStatus, fetchPrices, updatePrices } from '../services/api';
import Button from '../components/ui/Button';

const AdminDashboardPage = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [prices, setPrices] = useState({ base: 0, p10: 0, p30: 0 });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [ordersData, pricesData] = await Promise.all([
            fetchAllOrders(),
            fetchPrices()
        ]);
        setOrders(ordersData);
        setPrices(pricesData);
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

    if (loading) return <div className="p-8 text-center">Cargando datos de administración...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-main">Panel de Administración</h1>
                <p className="text-text-secondary mt-2">Gestiona pedidos, precios y configuraciones del sistema.</p>
            </div>

            <div className="flex gap-4 mb-8 border-b border-gray-border">
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'orders' ? 'text-primary' : 'text-text-secondary hover:text-text-main'}`}
                >
                    Pedidos
                    {activeTab === 'orders' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('prices')}
                    className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'prices' ? 'text-primary' : 'text-text-secondary hover:text-text-main'}`}
                >
                    Precios y Productos
                    {activeTab === 'prices' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
                </button>
            </div>

            {activeTab === 'orders' ? (
                <div className="bg-surface border border-gray-border rounded-card overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-muted border-b border-gray-border">
                            <tr>
                                <th className="p-4 text-xs font-bold text-text-secondary uppercase">Pedido</th>
                                <th className="p-4 text-xs font-bold text-text-secondary uppercase">Cliente</th>
                                <th className="p-4 text-xs font-bold text-text-secondary uppercase">Estado</th>
                                <th className="p-4 text-xs font-bold text-text-secondary uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-border">
                            {orders.map(order => (
                                <tr key={order.id_pedido} className="hover:bg-muted/30">
                                    <td className="p-4">
                                        <div className="font-bold text-text-main">{order.id_pedido}</div>
                                        <div className="text-xs text-text-secondary">{order.fecha}</div>
                                    </td>
                                    <td className="p-4 text-sm text-text-main">{order.cliente}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${order.estado === 'pendiente' ? 'bg-warning/10 text-warning' :
                                                order.estado === 'pagado' ? 'bg-primary/10 text-primary' :
                                                    order.estado === 'listo' ? 'bg-success/10 text-success' : 'bg-muted text-text-secondary'
                                            }`}>
                                            {order.estado}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={order.estado}
                                            disabled={updating}
                                            onChange={(e) => handleStatusChange(order.id_pedido, e.target.value)}
                                            className="bg-surface border border-gray-border rounded px-2 py-1 text-xs text-text-main outline-none focus:border-primary"
                                        >
                                            <option value="pendiente">Pendiente</option>
                                            <option value="pagado">Pagado</option>
                                            <option value="listo">Listo</option>
                                            <option value="entregado">Entregado</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-surface border border-gray-border rounded-card p-6">
                        <h3 className="text-lg font-bold text-text-main mb-6">Precios DTF Textil</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Precio Base (por metro)</label>
                                <input
                                    type="number"
                                    value={prices.base}
                                    onChange={(e) => setPrices({ ...prices, base: parseFloat(e.target.value) })}
                                    className="w-full bg-muted border border-gray-border rounded-lg p-3 text-text-main outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Precio Mayorista (+10m)</label>
                                <input
                                    type="number"
                                    value={prices.p10}
                                    onChange={(e) => setPrices({ ...prices, p10: parseFloat(e.target.value) })}
                                    className="w-full bg-muted border border-gray-border rounded-lg p-3 text-text-main outline-none focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Precio Gold (+30m)</label>
                                <input
                                    type="number"
                                    value={prices.p30}
                                    onChange={(e) => setPrices({ ...prices, p30: parseFloat(e.target.value) })}
                                    className="w-full bg-muted border border-gray-border rounded-lg p-3 text-text-main outline-none focus:border-primary"
                                />
                            </div>
                            <Button
                                onClick={handlePriceUpdate}
                                className="w-full mt-4"
                                disabled={updating}
                            >
                                {updating ? "Guardando..." : "Guardar Cambios"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;
