import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-border mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-b border-gray-border pb-16">

                    {/* Part 1: Text Links (Left) */}
                    <div className="grid grid-cols-3 gap-8">
                        {/* Servicios */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-text-main">Servicios</h4>
                            <ul className="space-y-3 text-sm text-text-secondary">
                                <li><Link className="hover:text-primary transition-colors" to="/nuevo-pedido">DTF Textil</Link></li>
                                <li><a className="hover:text-primary transition-colors" href="#">DTF UV</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Corte Laser</a></li>
                            </ul>
                        </div>
                        {/* Soporte */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-text-main">Soporte</h4>
                            <ul className="space-y-3 text-sm text-text-secondary">
                                <li><a className="hover:text-primary transition-colors" href="#">Tutoriales</a></li>
                            </ul>
                        </div>
                        {/* Compañía */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-text-main">Compañía</h4>
                            <ul className="space-y-3 text-sm text-text-secondary">
                                <li><Link className="hover:text-primary transition-colors" to="/">Nosotros</Link></li>
                                <li><Link className="hover:text-primary transition-colors" to="/">Elígenos...</Link></li>
                                <li><Link className="hover:text-primary transition-colors" to="/legal#terminos">Legales</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Part 2: Logo (Center) */}
                    <div className="flex h-full items-center justify-center">
                        <img className="h-28 w-auto" src="/logo.png" alt="VectorCuyo" />
                    </div>

                    {/* Part 3: Socials & Contact (Right) */}
                    <div className="flex flex-col h-full justify-center items-center space-y-6">
                        {/* Social Icons */}
                        <div className="flex items-center gap-4">
                            <a className="w-8 h-8 flex items-center justify-center border border-gray-border rounded hover:border-primary hover:text-primary transition-all" href="https://wa.me/5492604590259" target="_blank" rel="noopener noreferrer">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"></path></svg>
                            </a>
                            <a className="w-8 h-8 flex items-center justify-center border border-gray-border rounded hover:border-primary hover:text-primary transition-all" href="#">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.954 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
                            </a>
                            <a className="w-8 h-8 flex items-center justify-center border border-gray-border rounded hover:border-primary hover:text-primary transition-all" href="#">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                            </a>
                            <a className="w-8 h-8 flex items-center justify-center border border-gray-border rounded hover:border-primary hover:text-primary transition-all" href="#">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path></svg>
                            </a>
                            <a className="w-8 h-8 flex items-center justify-center border border-gray-border rounded hover:border-primary hover:text-primary transition-all" href="#">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.03 5.91-.05 8.81-.47 9.91-17.76 11.85-22.33 3.8-1.93-3.41-1.35-8.24 2.16-10.83 2.52-1.92 6.14-2.13 8.94-.7v4.29c-1.55-1.07-3.69-.88-5.07.16-1.39 1.05-1.69 3.09-.69 4.47 1.05 1.48 3.19 1.68 4.67.63.85-.6 1.34-1.57 1.35-2.61V.02z"></path></svg>
                            </a>
                        </div>

                        {/* Contact Info */}
                        <div className="flex flex-col items-center gap-2 text-sm text-text-secondary">
                            <a href="tel:2604590259" className="flex items-center gap-2 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-lg">call</span>
                                <span>260 4590259</span>
                            </a>
                            <a href="mailto:contacto@vectorcuyo.com.ar" className="flex items-center gap-2 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-lg">mail</span>
                                <span>contacto@vectorcuyo.com.ar</span>
                            </a>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">location_on</span>
                                <span>San Rafael - Mendoza</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[11px] font-medium text-text-secondary">© {new Date().getFullYear()} Vector Cuyo. Industrial Printing Workstation.</p>
                    <div className="flex items-center gap-3 px-4 py-2 border border-gray-border rounded-lg bg-surface">
                        <span className="material-symbols-outlined text-text-main text-lg">qr_code_2</span>
                        <div className="text-[8px] font-bold text-text-secondary uppercase leading-none">
                            Data Fiscal<br />Formulario 960/D
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
