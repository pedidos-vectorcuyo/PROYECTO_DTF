
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const HomePage = () => {
    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-tint text-primary rounded-full border border-primary/20">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        <span className="text-xs font-bold uppercase tracking-widest">NUEVA TECNOLOGÍA 2024</span>
                    </div>
                    <h1 className="text-text-main tracking-tight text-[32px] md:text-[40px] font-bold leading-tight">Soluciones DTF de Grado Industrial</h1>
                    <p className="text-text-secondary text-[16px] leading-relaxed max-w-lg">
                        Obtenga precisión incomparable en transferencias textiles y UV. Nuestra tecnología de impresión directa sobre film garantiza durabilidad, colores vibrantes y adherencia superior para aplicaciones B2B exigentes.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                        <Button to="/nuevo-pedido" size="lg" className="shadow-lg shadow-primary/20">
                            Comenzar Pedido
                        </Button>
                        <Button variant="secondary" size="lg">
                            Ver Especificaciones
                        </Button>
                    </div>
                </div>
                <div className="relative group">
                    <div className="absolute inset-0 bg-primary/5 rounded-card transform rotate-2 transition-transform group-hover:rotate-1"></div>
                    <div className="relative bg-surface border border-gray-border rounded-card p-6 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                        <div className="absolute inset-0 bg-dtf-texture bg-cover bg-center opacity-90 transition-transform duration-700 group-hover:scale-105"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="relative z-10 mt-auto flex items-end justify-between text-white">
                            <div>
                                <h3 className="font-bold text-lg">Muestra de Calidad DTF</h3>
                                <p className="text-sm text-white/80">Textura Premium y Acabado Mate</p>
                            </div>
                            <Button variant="ghost" size="sm" className="bg-white/10 hover:bg-white/20 text-white hover:text-white border border-white/30 backdrop-blur-md">
                                Solicitar Muestra
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Stats */}
            <section className="py-6 border-y border-gray-border bg-surface/50 mb-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { icon: "high_quality", title: "Alta Resolución 1440dpi", subtitle: "Detalles finos y nítidos" },
                        { icon: "verified_user", title: "Resistencia Industrial", subtitle: "Test de 50+ lavados" },
                        { icon: "palette", title: "Colores Vibrantes", subtitle: "Gama cromática extendida" },
                        { icon: "bolt", title: "Entrega 24/48h", subtitle: "Logística optimizada" }
                    ].map((feature, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center gap-3 group">
                            <div className="w-12 h-12 bg-off-white rounded-full flex items-center justify-center text-primary border border-gray-border group-hover:border-primary transition-colors">
                                <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-text-main">{feature.title}</h4>
                                <p className="text-xs text-text-secondary mt-1">{feature.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Products Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="bg-surface border border-gray-border rounded-card p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow group">
                    <div className="w-14 h-14 bg-blue-tint rounded-lg flex items-center justify-center text-primary mb-6">
                        <span className="material-symbols-outlined text-3xl filled">apparel</span>
                    </div>
                    <h2 className="mb-4 text-[20px] font-bold text-text-main">DTF Textil</h2>
                    <p className="text-text-secondary mb-6 leading-relaxed text-[15px]">
                        La solución definitiva para personalización textil. Ideal para algodón, poliéster y mezclas, sin necesidad de pretratamiento.
                    </p>
                    <ul className="space-y-3 mb-8 flex-grow">
                        {[
                            "Tacto suave y elástico, no se cuartea.",
                            "Colores blancos puros y alta opacidad.",
                            "Transferencia en 15 segundos a 160°C."
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-text-main">
                                <span className="material-symbols-outlined text-primary text-[20px] filled">check_circle</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                    <Button className="w-full gap-2" size="lg">
                        Cotizar Ahora <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Button>
                </div>

                <div className="bg-surface border border-gray-border rounded-card p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow group">
                    <div className="w-14 h-14 bg-blue-tint rounded-lg flex items-center justify-center text-primary mb-6">
                        <span className="material-symbols-outlined text-3xl filled">print</span>
                    </div>
                    <h2 className="mb-4 text-[20px] font-bold text-text-main">DTF UV</h2>
                    <p className="text-text-secondary mb-6 leading-relaxed text-[15px]">
                        Impresión directa para superficies rígidas e irregulares. Crea stickers con relieve y acabados de barniz selectivo premium.
                    </p>
                    <ul className="space-y-3 mb-8 flex-grow">
                        {[
                            "Adherencia extrema en vidrio, metal y plástico.",
                            "Acabado con barniz brillante y relieve 3D.",
                            "Resistente al agua, sol y ralladuras."
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-text-main">
                                <span className="material-symbols-outlined text-primary text-[20px] filled">check_circle</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                    <button className="w-full bg-primary hover:bg-[#253991] text-white py-3 rounded-card font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2">
                        Cotizar Ahora <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
