import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthProvider';
import { fetchOrders } from '../services/api';
import Button from '../components/ui/Button';

const STATUS_CONFIG = {
    // API returns 'Ingresado' as default, mapping to 'en_curso' style or adding new ones
    Ingresado: { color: "text-primary", bg: "bg-blue-tint", border: "border-primary/20", dot: "bg-primary", label: "Ingresado" },
    en_curso: { color: "text-primary", bg: "bg-blue-tint", border: "border-primary/20", dot: "bg-primary", label: "En curso" },
    pausado: { color: "text-status-amber", bg: "bg-amber-50", border: "border-status-amber/20", dot: "bg-status-amber", label: "Pausado" },
    en_revision: { color: "text-status-slate", bg: "bg-slate-50", border: "border-status-slate/20", dot: "bg-status-slate", label: "En revisión" },
    entregado: { color: "text-status-green", bg: "bg-green-50", border: "border-status-green/20", dot: "bg-status-green", label: "Entregado" },
    pagado: { color: "text-status-indigo", bg: "bg-indigo-50", border: "border-status-indigo/20", dot: "bg-status-indigo", label: "Pagado" },
    borrador: { color: "text-gray-500", bg: "bg-gray-100", border: "border-gray-200", dot: "bg-gray-400", label: "Borrador" },
};

const DashboardPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('todos'); // Sidebar filter
    const [searchTerm, setSearchTerm] = useState(''); // Text search
    const [statusFilter, setStatusFilter] = useState(''); // Dropdown filter
    const [isFiltersOpen, setIsFiltersOpen] = useState(false); // Mobile filters toggle
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Standard pagination size

    useEffect(() => {
        const loadOrders = async () => {
            if (user?.id) {
                setLoading(true);
                try {
                    const data = await fetchOrders(user.id);
                    const formatted = data.map(o => ({
                        id: o.id ? o.id.toString() : 'N/A',
                        date: o.creado_en ? o.creado_en.split('T')[0] : '-',
                        files: o.nombre_archivo || 'Sin archivo',
                        price: parseFloat(o.precio_final || 0),
                        status: o.estado || 'Ingresado',
                        shipping: "Estándar (24h)",
                        ...o
                    }));
                    formatted.sort((a, b) => b.id - a.id);
                    setOrders(formatted);
                } catch (error) {
                    console.error("Dashboard: Error loading orders", error);
                } finally {
                    setLoading(false);
                }
            } else if (user) {
                // User is logged in but has no ID? (shouldn't happen with correct DB data)
                setLoading(false);
            }
        };

        loadOrders();
    }, [user]);

    // Counts for sidebar badges
    const vigentesCount = orders.filter(o => ['Ingresado', 'en_curso', 'pausado', 'en_revision'].includes(o.status)).length;

    // Filter Logic
    const filteredOrders = orders.filter(order => {
        // 1. Sidebar Filter
        if (filter === 'vigentes' && !['Ingresado', 'en_curso', 'pausado', 'en_revision'].includes(order.status)) return false;
        if (filter === 'historial' && !['entregado', 'pagado'].includes(order.status)) return false;
        if (filter === 'borradores' && order.status !== 'borrador') return false;

        // 2. Text Search (ID or Files)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const idMatch = order.id && order.id.toString().toLowerCase().includes(term);
            const fileMatch = order.files && order.files.toLowerCase().includes(term);
            if (!idMatch && !fileMatch) return false;
        }

        // 3. Status Dropdown
        if (statusFilter && order.status !== statusFilter) return false;

        return true;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleNotImplemented = (feature) => {
        alert(`La sección de ${feature} estará disponible próximamente.`);
    };

    if (loading) {
        return (
            <div className="w-full h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar / Filters */}
            <aside className="w-full lg:w-1/4 shrink-0">
                {/* Mobile Toggle for Filters */}
                <button
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-surface border border-gray-border rounded-xl text-[14px] font-bold text-text-main mb-4"
                >
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">tune</span>
                        Filtros y Categorías
                    </div>
                    <span className={`material-symbols-outlined transition-transform duration-200 ${isFiltersOpen ? 'rotate-180' : ''}`}>expand_more</span>
                </button>

                <div className={`${isFiltersOpen ? 'block' : 'hidden'} lg:block sticky top-24 space-y-8 animate-fade-in lg:animate-none`}>
                    <div className="space-y-1">
                        <button
                            onClick={() => { setFilter('todos'); setCurrentPage(1); setIsFiltersOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-card text-[14px] font-medium transition-all ${filter === 'todos' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-text-secondary hover:bg-surface-raised hover:text-text-main'}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">list_alt</span>
                            Todos los Pedidos
                        </button>
                        <button
                            onClick={() => { setFilter('vigentes'); setCurrentPage(1); setIsFiltersOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-card text-[14px] font-medium transition-all ${filter === 'vigentes' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-text-secondary hover:bg-surface-raised hover:text-text-main'}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">timelapse</span>
                            Vigentes
                            {vigentesCount > 0 && (
                                <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${filter === 'vigentes' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                                    {vigentesCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => { setFilter('historial'); setCurrentPage(1); setIsFiltersOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-card text-[14px] font-medium transition-all ${filter === 'historial' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-text-secondary hover:bg-surface-raised hover:text-text-main'}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">history</span>
                            Historial
                        </button>
                        <button
                            onClick={() => { setFilter('borradores'); setCurrentPage(1); setIsFiltersOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-card text-[14px] font-medium transition-all ${filter === 'borradores' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-text-secondary hover:bg-surface-raised hover:text-text-main'}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">edit_note</span>
                            Borradores
                        </button>
                    </div>

                    <div className="pt-6 border-t border-gray-border">
                        <h4 className="px-4 text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-3">Accesos Rápidos</h4>
                        <div className="space-y-1">
                            <button
                                onClick={() => { handleNotImplemented('Facturación'); setIsFiltersOpen(false); }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-card text-[14px] font-medium text-text-secondary hover:bg-surface-raised hover:text-text-main transition-all"
                            >
                                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                                Facturación
                            </button>
                            <button
                                onClick={() => { handleNotImplemented('Configuración'); setIsFiltersOpen(false); }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-card text-[14px] font-medium text-text-secondary hover:bg-surface-raised hover:text-text-main transition-all"
                            >
                                <span className="material-symbols-outlined text-[20px]">settings</span>
                                Configuración
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <section className="w-full lg:w-3/4 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-text-main">Mis Pedidos</h1>
                    <Link to="/nuevo-pedido">
                        <Button className="w-full md:w-auto" size="lg">
                            <span className="material-symbols-outlined text-[20px] mr-2">add_circle</span>
                            Nuevo Pedido
                        </Button>
                    </Link>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <div className="relative w-full sm:w-64">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary material-symbols-outlined text-[20px]">search</span>
                        <input
                            className="w-full h-[44px] pl-10 pr-4 bg-surface border border-gray-border rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-shadow"
                            placeholder="Buscar por ID o archivo..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <div className="relative w-full sm:w-48">
                        <select
                            className="w-full h-[44px] pl-3 pr-8 bg-surface border border-gray-border rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none cursor-pointer text-text-main font-medium"
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="">Filtrar por estado</option>
                            <option value="Ingresado">Ingresado</option>
                            <option value="en_curso">En curso</option>
                            <option value="pausado">Pausado</option>
                            <option value="en_revision">En revisión</option>
                            <option value="entregado">Entregado</option>
                            <option value="pagado">Pagado</option>
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary material-symbols-outlined text-[20px] pointer-events-none">expand_more</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {paginatedOrders.length > 0 ? (
                        paginatedOrders.map((order) => {
                            const style = STATUS_CONFIG[order.status] || STATUS_CONFIG.Ingresado;
                            return (
                                <div key={order.id} className="bg-surface border border-gray-border rounded-card p-5 hover:shadow-sm transition-shadow">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                                        <span className="text-[16px] font-bold text-text-main">#{order.id}</span>
                                                        <span className="text-[12px] text-text-secondary">{order.date}</span>
                                                    </div>
                                                    <span className="text-[13px] font-medium text-text-secondary block truncate max-w-[200px] sm:max-w-none">{order.files}</span>
                                                </div>
                                                <div className="text-right flex flex-col items-end md:hidden">
                                                    <p className="text-[18px] font-bold text-text-main">${order.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                                <div className="relative group cursor-pointer">
                                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${style.bg} border ${style.border}`}>
                                                        <span className={`w-2 h-2 rounded-full ${style.dot} ${order.status === 'en_curso' ? 'animate-pulse' : ''}`}></span>
                                                        <span className={`text-[11px] font-bold uppercase tracking-wide ${style.color}`}>{style.label}</span>
                                                    </div>
                                                </div>
                                                <div className="hidden sm:block h-4 w-[1px] bg-gray-border"></div>
                                                <div className="flex items-center gap-1 text-[12px] text-text-secondary">
                                                    <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                                                    <span>{order.shipping}</span>
                                                </div>
                                                {order.statusMsg && <span className="text-[12px] text-status-amber font-medium hidden lg:block">{order.statusMsg}</span>}
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row md:flex-col justify-between items-stretch sm:items-center md:items-end gap-4 border-t border-gray-border md:border-none pt-4 md:pt-0">
                                            <div className="text-right hidden md:block">
                                                <p className="text-[12px] text-text-secondary mb-0.5">Total</p>
                                                <p className="text-[18px] font-bold text-text-main">${order.price.toFixed(2)}</p>
                                            </div>
                                            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                                                <Button variant="ghost" size="sm" className="text-xs flex-1 sm:flex-none justify-center">Ver detalles</Button>
                                                <Button size="icon" variant="secondary" className="h-9 w-9 shrink-0" title="Descargar Factura">
                                                    <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 text-gray-400 bg-surface border border-gray-border rounded-card">
                            <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">search_off</span>
                            <p>No se encontraron pedidos con estos filtros.</p>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-border">
                    <p className="text-[13px] text-text-secondary">
                        Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, filteredOrders.length)} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} de {filteredOrders.length} pedidos
                    </p>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            variant="secondary"
                            size="sm"
                        >
                            Anterior
                        </Button>
                        <Button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            variant="secondary"
                            size="sm"
                        >
                            Siguiente
                        </Button>
                    </div>
                </div>
            </section >
        </div >
    );
};

export default DashboardPage;
