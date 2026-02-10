
import React from 'react';
import Button from '../components/ui/Button';

const AboutPage = () => {
    return (
        <div className="flex flex-col w-full max-w-5xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-tint text-primary rounded-full border border-primary/20 mb-6">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span className="text-xs font-bold uppercase tracking-widest">DESDE 2020</span>
                </div>
                <h1 className="text-text-main tracking-tight text-[36px] md:text-[44px] font-bold leading-tight mb-6">
                    Tecnología DTF de Precisión Industrial
                </h1>
                <p className="text-text-secondary text-[18px] leading-relaxed max-w-3xl mx-auto">
                    En Vector Cuyo brindamos soluciones de impresión DTF de alta gama para profesionales y empresas que exigen calidad industrial, precisión y confiabilidad en cada transferencia.
                </p>
            </section>

            {/* Mission & Values */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="bg-surface border border-gray-border rounded-card p-8 shadow-sm">
                    <div className="w-14 h-14 bg-blue-tint rounded-lg flex items-center justify-center text-primary mb-6">
                        <span className="material-symbols-outlined text-3xl filled">target</span>
                    </div>
                    <h2 className="text-[24px] font-bold text-text-main mb-4">Nuestra Misión</h2>
                    <p className="text-text-secondary leading-relaxed">
                        Proveer transferencias DTF de calidad industrial que superen las expectativas de nuestros clientes, combinando tecnología de punta con un servicio personalizado y tiempos de entrega optimizados.
                    </p>
                </div>

                <div className="bg-surface border border-gray-border rounded-card p-8 shadow-sm">
                    <div className="w-14 h-14 bg-blue-tint rounded-lg flex items-center justify-center text-primary mb-6">
                        <span className="material-symbols-outlined text-3xl filled">workspace_premium</span>
                    </div>
                    <h2 className="text-[24px] font-bold text-text-main mb-4">Compromiso con la Calidad</h2>
                    <p className="text-text-secondary leading-relaxed">
                        Cada transferencia pasa por rigurosos controles de calidad. Utilizamos materiales premium y tecnología de impresión a 1440 DPI para garantizar colores vibrantes, durabilidad excepcional y acabados profesionales.
                    </p>
                </div>
            </section>

            {/* Technology Section */}
            <section className="bg-surface border border-gray-border rounded-card p-10 mb-16 shadow-sm">
                <h2 className="text-[28px] font-bold text-text-main mb-6 text-center">Tecnología de Vanguardia</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-tint rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                            <span className="material-symbols-outlined text-4xl">high_quality</span>
                        </div>
                        <h3 className="font-bold text-text-main mb-2">Resolución 1440 DPI</h3>
                        <p className="text-sm text-text-secondary">Detalles ultranítidos y colores precisos en cada impresión</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-tint rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                            <span className="material-symbols-outlined text-4xl">verified_user</span>
                        </div>
                        <h3 className="font-bold text-text-main mb-2">Durabilidad Comprobada</h3>
                        <p className="text-sm text-text-secondary">Resistencia a más de 50 lavados sin pérdida de calidad</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-tint rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                            <span className="material-symbols-outlined text-4xl">speed</span>
                        </div>
                        <h3 className="font-bold text-text-main mb-2">Entrega Rápida</h3>
                        <p className="text-sm text-text-secondary">Logística optimizada para entregas en 24-48 horas</p>
                    </div>
                </div>
            </section>

            {/* Location & Contact */}
            <section className="bg-gradient-to-br from-primary/5 to-blue-tint border border-gray-border rounded-card p-10 text-center">
                <h2 className="text-[28px] font-bold text-text-main mb-4">Ubicados en San Rafael, Mendoza</h2>
                <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
                    Operamos desde el corazón de San Rafael, atendiendo a clientes de toda Argentina con un servicio profesional y confiable.
                </p>
                <div className="flex flex-wrap justify-center gap-6 mb-8">
                    <a href="tel:2604590259" className="flex items-center gap-2 text-text-main hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">call</span>
                        <span className="font-medium">260 4590259</span>
                    </a>
                    <a href="mailto:contacto@vectorcuyo.com.ar" className="flex items-center gap-2 text-text-main hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">email</span>
                        <span className="font-medium">contacto@vectorcuyo.com.ar</span>
                    </a>
                </div>
                <Button to="/nuevo-pedido" size="lg" className="shadow-lg shadow-primary/20">
                    Comenzar Pedido
                </Button>
            </section>
        </div>
    );
};

export default AboutPage;
