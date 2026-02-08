
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

const Layout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            {/* Navbar */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex-shrink-0 flex items-center">
                                <span className="text-2xl font-extrabold text-[#2563eb]">VectorCuyo</span>
                            </Link>
                            <nav className="hidden md:ml-8 md:flex space-x-4">
                                <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/') ? 'bg-blue-50 text-[#2563eb]' : 'text-gray-500 hover:text-gray-900'}`}>
                                    Inicio
                                </Link>
                                {user && (
                                    <>
                                        <Link to="/nuevo-pedido" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/nuevo-pedido') ? 'bg-blue-50 text-[#2563eb]' : 'text-gray-500 hover:text-gray-900'}`}>
                                            Nuevo Pedido
                                        </Link>
                                        <Link to="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/dashboard') ? 'bg-blue-50 text-[#2563eb]' : 'text-gray-500 hover:text-gray-900'}`}>
                                            Historial
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                        <div className="flex items-center">
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-700 hidden sm:block">Hola, <strong>{user.nombre}</strong></span>
                                    <button
                                        onClick={logout}
                                        className="text-sm font-medium text-red-600 hover:text-red-800"
                                    >
                                        Salir
                                    </button>
                                </div>
                            ) : (
                                <div className="space-x-4">
                                    <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                                        Ingresar
                                    </Link>
                                    <Link to="/register" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#2563eb] hover:bg-blue-700">
                                        Registrarse
                                    </Link>
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
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Vector Cuyo. Todos los derechos reservados.
                    </p>
                    <div className="mt-2 text-center text-xs text-gray-400">
                        <Link to="/legal" className="hover:underline">Términos y Condiciones</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
