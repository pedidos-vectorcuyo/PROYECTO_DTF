
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const HomePage = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const carouselImages = [
        {
            url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
            title: 'Estampados Vibrantes',
            subtitle: 'Colores Intensos y Alta Definición'
        },
        {
            url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
            title: 'Diseños Personalizados',
            subtitle: 'Impresión DTF de Calidad Premium'
        },
        {
            url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
            title: 'Transferencias DTF',
            subtitle: 'Detalles Perfectos en Cada Capa'
        },
        {
            url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80',
            title: 'Textiles de Alta Gama',
            subtitle: 'Acabados Profesionales y Durables'
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    };

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
                        <Button to="/especificaciones" variant="secondary" size="lg">
                            Ver Especificaciones
                        </Button>
                    </div>
                </div>
                <div className="relative group">
                    <div className="absolute inset-0 bg-blue-tint rounded-card transform rotate-2 transition-transform group-hover:rotate-1"></div>
                    <div className="relative bg-surface border border-gray-border rounded-card p-6 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                        {/* Carousel Images */}
                        {carouselImages.map((image, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-90' : 'opacity-0'
                                    }`}
                                style={{ backgroundImage: `url(${image.url})` }}
                            ></div>
                        ))}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                        {/* Carousel Controls */}
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>

                        {/* Carousel Indicators */}
                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                            {carouselImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                                        ? 'bg-white w-6'
                                        : 'bg-white/50 hover:bg-white/75'
                                        }`}
                                ></button>
                            ))}
                        </div>

                        <div className="relative z-10 mt-auto flex items-end justify-between text-white">
                            <div>
                                <h3 className="font-bold text-lg transition-opacity duration-500">
                                    {carouselImages[currentImageIndex].title}
                                </h3>
                                <p className="text-sm text-white/80 transition-opacity duration-500">
                                    {carouselImages[currentImageIndex].subtitle}
                                </p>
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
                    <Button to="/nuevo-pedido" className="w-full gap-2" size="lg">
                        Cotizar Ahora <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Button>
                </div>

                <div className="bg-surface border border-gray-border rounded-card p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                    {/* Coming Soon Badge */}
                    <div className="absolute top-4 right-4 z-10">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-full shadow-lg">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-wider">Próximamente</span>
                        </div>
                    </div>

                    {/* Subtle overlay to indicate coming soon */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent pointer-events-none"></div>

                    <div className="relative z-10">
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
                        <Button disabled className="w-full gap-2 opacity-60 cursor-not-allowed" size="lg">
                            Disponible Pronto <span className="material-symbols-outlined text-sm">schedule</span>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
