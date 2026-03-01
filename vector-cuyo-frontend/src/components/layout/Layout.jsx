
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import Footer from './Footer';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';


const Layout = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen flex flex-col bg-off-white font-sans text-text-main transition-colors duration-300">
            {/* Navbar */}
            <header className="bg-surface border-b border-gray-border sticky top-0 z-50 h-[64px] transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex h-full items-center justify-between md:grid md:grid-cols-3">
                        {/* 1. Logo (Left) */}
                        <div className="flex items-center justify-start">
                            <Link to="/" className="flex-shrink-0 flex items-center">
                                <img
                                    className="h-10 w-auto logo-invert"
                                    src={`${import.meta.env.BASE_URL}logo.png`}
                                    alt="VectorCuyo"
                                />
                            </Link>
                        </div>

                        {/* 2. Navigation (Center) - Simplified logic here for brevety, focus on toggle below */}

                        {/* 2. Navigation (Center) */}
                        <div className="hidden md:flex justify-center h-full">
                            <nav className="flex items-center gap-1">
                                {!location.pathname.startsWith('/admin') && (
                                    <>
                                        <Link to="/" className={`px-4 py-2 rounded-full text-[14px] font-medium transition-colors ${isActive('/') ? 'text-primary bg-active-tint' : 'text-text-secondary hover:text-text-main hover:bg-hover-tint'}`}>
                                            Inicio
                                        </Link>

                                        {/* Servicios Dropdown */}
                                        <div className="relative group h-full flex items-center">
                                            <button className={`flex items-center px-4 py-2 rounded-full text-[14px] font-medium transition-colors ${isActive('/nuevo-pedido') ? 'text-primary bg-active-tint' : 'text-text-secondary hover:text-text-main hover:bg-hover-tint'}`}>
                                                Servicios
                                                <span className="material-symbols-outlined text-[20px] ml-1">expand_more</span>
                                            </button>
                                            <div className="absolute top-[calc(100%-10px)] left-1/2 -translate-x-1/2 w-56 bg-surface border border-gray-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50 p-2">
                                                <div className="flex flex-col gap-1">
                                                    <Link to="/especificaciones" className="block px-4 py-2.5 rounded-lg text-[14px] text-text-main hover:bg-hover-tint hover:text-primary transition-colors">
                                                        Lámina DTF Textil
                                                    </Link>
                                                    <span className="block px-4 py-2.5 rounded-lg text-[14px] text-text-secondary opacity-60 cursor-not-allowed">
                                                        Lámina DTF UV (Próx.)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>


                                        {/* Tutoriales Dropdown */}
                                        <Link to="/tutoriales" className="px-4 py-2 rounded-full text-[14px] font-medium text-text-secondary hover:text-text-main hover:bg-hover-tint transition-colors">
                                            Tutoriales
                                        </Link>

                                        <Link to="/nosotros" className="px-4 py-2 rounded-full text-[14px] font-medium text-text-secondary hover:text-text-main hover:bg-hover-tint transition-colors">
                                            Nosotros
                                        </Link>
                                    </>
                                )}

                                {user?.role === 'admin' && (
                                    <Link to="/admin" className={`px-4 py-2 rounded-full text-[14px] font-medium transition-colors ${isActive('/admin') ? 'text-primary bg-active-tint' : 'text-text-secondary hover:text-text-main hover:bg-hover-tint'}`}>
                                        Admin
                                    </Link>
                                )}

                                {user && !location.pathname.startsWith('/admin') && (
                                    <Link to="/dashboard" className={`px-4 py-2 rounded-full text-[14px] font-medium transition-colors ${isActive('/dashboard') ? 'text-primary bg-active-tint' : 'text-text-secondary hover:text-text-main hover:bg-hover-tint'}`}>
                                        Perfil
                                    </Link>
                                )}
                            </nav>
                        </div>

                        {/* 3. User Area (Right) */}
                        <div className="flex items-center justify-end space-x-2 sm:space-x-4">
                            <ThemeToggle />
                            <div className="hidden md:flex items-center space-x-4">
                                {user ? (
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[12px] text-text-secondary leading-none">Hola,</span>
                                            <span className="text-[14px] font-bold text-text-main leading-tight">{user.nombre_completo?.split(' ')[0] || user.nombre || 'Usuario'}</span>
                                        </div>
                                        <div className="relative group/user">
                                            <div className="w-10 h-10 rounded-full border border-gray-border overflow-hidden bg-surface-raised flex items-center justify-center shrink-0">
                                                {user.imagen_perfil ? (
                                                    <img
                                                        src={user.imagen_perfil}
                                                        alt={user.nombre_completo}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.target.onerror = null; e.target.src = ''; }} // Fallback on error
                                                    />
                                                ) : (
                                                    <span className="material-symbols-outlined text-text-secondary text-[24px]">person</span>
                                                )}
                                            </div>
                                            {/* Tooltip or logout hint on hover could go here */}
                                        </div>
                                        <button
                                            onClick={logout}
                                            className="text-[13px] font-medium text-danger hover:underline transition-all ml-1"
                                        >
                                            Salir
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-x-3 flex items-center">
                                        <Button to="/login" variant="ghost" size="sm">
                                            Ingresar
                                        </Button>
                                        <Button to="/register" size="sm">
                                            Registrarse
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 text-text-secondary hover:text-text-main hover:bg-hover-tint rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-[24px]">
                                    {isMenuOpen ? 'close' : 'menu'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                <div className={`md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsMenuOpen(false)}>
                    <div
                        className={`absolute top-[64px] left-0 right-0 bg-surface border-b border-gray-border p-6 space-y-6 transform transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <nav className="flex flex-col gap-2">
                            {!location.pathname.startsWith('/admin') && (
                                <>
                                    <Link
                                        to="/"
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`px-4 py-3 rounded-xl text-[16px] font-medium transition-colors ${isActive('/') ? 'text-primary bg-active-tint' : 'text-text-secondary hover:bg-hover-tint'}`}
                                    >
                                        Inicio
                                    </Link>

                                    <div className="space-y-1">
                                        <div className="px-4 py-2 text-[12px] font-bold text-text-secondary uppercase tracking-widest opacity-50">Servicios</div>
                                        <Link
                                            to="/especificaciones"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block px-4 py-3 rounded-xl text-[16px] text-text-main hover:bg-hover-tint transition-colors"
                                        >
                                            Lámina DTF Textil
                                        </Link>
                                        <span className="block px-4 py-3 rounded-xl text-[16px] text-text-secondary opacity-50 cursor-not-allowed">
                                            Lámina DTF UV (Próx.)
                                        </span>
                                    </div>

                                    <Link
                                        to="/tutoriales"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="px-4 py-3 rounded-xl text-[16px] font-medium text-text-secondary hover:bg-hover-tint transition-colors"
                                    >
                                        Tutoriales
                                    </Link>

                                    <Link
                                        to="/nosotros"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="px-4 py-3 rounded-xl text-[16px] font-medium text-text-secondary hover:bg-hover-tint transition-colors"
                                    >
                                        Nosotros
                                    </Link>
                                </>
                            )}

                            {user?.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`px-4 py-3 rounded-xl text-[16px] font-medium transition-colors ${isActive('/admin') ? 'text-primary bg-active-tint' : 'text-text-secondary hover:bg-hover-tint'}`}
                                >
                                    Panel Admin
                                </Link>
                            )}

                            {user && !location.pathname.startsWith('/admin') && (
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`px-4 py-3 rounded-xl text-[16px] font-medium transition-colors ${isActive('/dashboard') ? 'text-primary bg-active-tint' : 'text-text-secondary hover:bg-hover-tint'}`}
                                >
                                    Perfil
                                </Link>
                            )}
                        </nav>

                        <div className="pt-6 border-t border-gray-border flex flex-col gap-4">
                            {user ? (
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-4 px-4 py-2 bg-surface-raised rounded-xl border border-gray-border">
                                        <div className="w-12 h-12 rounded-full border border-gray-border overflow-hidden bg-surface flex items-center justify-center shrink-0">
                                            {user.imagen_perfil ? (
                                                <img src={user.imagen_perfil} alt={user.nombre_completo} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-symbols-outlined text-text-secondary text-[28px]">person</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-[12px] text-text-secondary leading-none mb-1">Conectado como:</p>
                                            <p className="font-bold text-text-main text-[16px] leading-tight">{user.nombre_completo || user.nombre}</p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => { logout(); setIsMenuOpen(false); }}
                                        variant="secondary"
                                        className="w-full text-danger border-danger/20 hover:bg-danger/5"
                                    >
                                        Cerrar Sesión
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    <Button to="/login" variant="ghost" onClick={() => setIsMenuOpen(false)}>Ingresar</Button>
                                    <Button to="/register" onClick={() => setIsMenuOpen(false)}>Registrarse</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Layout;
