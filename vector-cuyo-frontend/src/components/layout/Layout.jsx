
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import Footer from './Footer';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';


const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen flex flex-col bg-off-white font-sans text-text-main transition-colors duration-300">
            {/* Navbar */}
            <header className="bg-surface border-b border-gray-border sticky top-0 z-50 h-[64px] transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="grid grid-cols-3 h-full items-center">
                        {/* 1. Logo (Left) */}
                        <div className="flex items-center justify-start">
                            <Link to="/" className="flex-shrink-0 flex items-center">
                                <img className="h-12 w-auto" src={`${import.meta.env.BASE_URL}logo.png`} alt="VectorCuyo" />
                            </Link>
                        </div>

                        {/* 2. Navigation (Center) - Simplified logic here for brevety, focus on toggle below */}

                        {/* 2. Navigation (Center) */}
                        <div className="hidden md:flex justify-center h-full">
                            <nav className="flex items-center gap-1">
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

                                {user && (
                                    <Link to="/dashboard" className={`px-4 py-2 rounded-full text-[14px] font-medium transition-colors ${isActive('/dashboard') ? 'text-primary bg-active-tint' : 'text-text-secondary hover:text-text-main hover:bg-hover-tint'}`}>
                                        Perfil
                                    </Link>
                                )}
                            </nav>
                        </div>

                        {/* 3. User Area (Right) */}
                        <div className="flex items-center justify-end space-x-4">
                            <ThemeToggle />
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-[14px] text-text-main hidden sm:block">Hola, <strong>{user.nombre_completo || user.nombre || 'Usuario'}</strong></span>
                                    <button
                                        onClick={logout}
                                        className="text-[14px] font-medium text-danger hover:text-red-700 transition-colors"
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
