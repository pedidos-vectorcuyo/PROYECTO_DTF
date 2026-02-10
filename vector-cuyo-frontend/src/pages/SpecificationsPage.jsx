
import React from 'react';
import Button from '../components/ui/Button';

const SpecificationsPage = () => {
    return (
        <div className="flex flex-col w-full max-w-6xl mx-auto">
            {/* Header */}
            <section className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-tint text-primary rounded-full border border-primary/20 mb-6">
                    <span className="material-symbols-outlined text-lg">description</span>
                    <span className="text-xs font-bold uppercase tracking-widest">ESPECIFICACIONES TÉCNICAS</span>
                </div>
                <h1 className="text-text-main tracking-tight text-[36px] md:text-[44px] font-bold leading-tight mb-6">
                    Lámina DTF Textil
                </h1>
                <p className="text-text-secondary text-[18px] leading-relaxed max-w-3xl mx-auto">
                    Transferencias de calidad industrial con tecnología de impresión directa sobre film para resultados profesionales y duraderos.
                </p>
            </section>

            {/* Main Specifications Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {/* Print Quality */}
                <div className="bg-surface border border-gray-border rounded-card p-8 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-tint rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                            <span className="material-symbols-outlined text-2xl">high_quality</span>
                        </div>
                        <div>
                            <h3 className="text-[20px] font-bold text-text-main mb-2">Resolución de Impresión</h3>
                            <p className="text-text-secondary mb-3">1440 DPI (Dots Per Inch)</p>
                            <ul className="space-y-2 text-sm text-text-secondary">
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0">check_circle</span>
                                    <span>Detalles ultranítidos y líneas definidas</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0">check_circle</span>
                                    <span>Reproducción precisa de degradados</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0">check_circle</span>
                                    <span>Textos pequeños legibles (hasta 6pt)</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Color Capabilities */}
                <div className="bg-surface border border-gray-border rounded-card p-8 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-tint rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                            <span className="material-symbols-outlined text-2xl">palette</span>
                        </div>
                        <div>
                            <h3 className="text-[20px] font-bold text-text-main mb-2">Gama Cromática</h3>
                            <p className="text-text-secondary mb-3">CMYK + Blanco</p>
                            <ul className="space-y-2 text-sm text-text-secondary">
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0">check_circle</span>
                                    <span>Colores vibrantes y saturados</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0">check_circle</span>
                                    <span>Blanco puro con alta opacidad</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0">check_circle</span>
                                    <span>Excelente cobertura en telas oscuras</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Fabric Compatibility */}
                <div className="bg-surface border border-gray-border rounded-card p-8 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-tint rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                            <span className="material-symbols-outlined text-2xl filled">apparel</span>
                        </div>
                        <div>
                            <h3 className="text-[20px] font-bold text-text-main mb-2">Compatibilidad de Telas</h3>
                            <p className="text-text-secondary mb-3">Multifibra sin pretratamiento</p>
                            <ul className="space-y-2 text-sm text-text-secondary">
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0">check_circle</span>
                                    <span>Algodón 100%</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0">check_circle</span>
                                    <span>Poliéster 100%</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0">check_circle</span>
                                    <span>Mezclas (algodón/poliéster)</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Application Process */}
                <div className="bg-surface border border-gray-border rounded-card p-8 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-tint rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                            <span className="material-symbols-outlined text-2xl">heat</span>
                        </div>
                        <div>
                            <h3 className="text-[20px] font-bold text-text-main mb-2">Proceso de Transferencia</h3>
                            <p className="text-text-secondary mb-3">Planchado con calor y presión</p>
                            <ul className="space-y-2 text-sm text-text-secondary">
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0">thermostat</span>
                                    <span><strong>Temperatura:</strong> 160°C (320°F)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0">schedule</span>
                                    <span><strong>Tiempo:</strong> 15 segundos</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0">compress</span>
                                    <span><strong>Presión:</strong> Media a alta</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Durability & Care */}
            <section className="bg-surface border border-gray-border rounded-card p-10 mb-12 shadow-sm">
                <h2 className="text-[28px] font-bold text-text-main mb-8 text-center">Durabilidad y Cuidado</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-tint rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                            <span className="material-symbols-outlined text-4xl">verified_user</span>
                        </div>
                        <h3 className="font-bold text-text-main mb-2 text-[18px]">Resistencia al Lavado</h3>
                        <p className="text-text-secondary mb-3">Test de 50+ lavados</p>
                        <p className="text-sm text-text-secondary">Sin pérdida de color ni agrietamiento del diseño</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-tint rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                            <span className="material-symbols-outlined text-4xl">bubble_chart</span>
                        </div>
                        <h3 className="font-bold text-text-main mb-2 text-[18px]">Tacto y Flexibilidad</h3>
                        <p className="text-text-secondary mb-3">Acabado suave y elástico</p>
                        <p className="text-sm text-text-secondary">No se cuartea, no se despega, se adapta al tejido</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-tint rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                            <span className="material-symbols-outlined text-4xl">wb_sunny</span>
                        </div>
                        <h3 className="font-bold text-text-main mb-2 text-[18px]">Resistencia UV</h3>
                        <p className="text-text-secondary mb-3">Colores estables</p>
                        <p className="text-sm text-text-secondary">Pigmentos resistentes a la decoloración solar</p>
                    </div>
                </div>
            </section>

            {/* File Requirements */}
            <section className="bg-gradient-to-br from-primary/5 to-blue-tint border border-gray-border rounded-card p-10 mb-12">
                <h2 className="text-[24px] font-bold text-text-main mb-6">Requisitos de Archivos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-bold text-text-main mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">image</span>
                            Formato de Archivo
                        </h3>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-success text-[18px]">check</span>
                                <span><strong>PNG con fondo transparente</strong> (requerido)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-text-secondary text-[18px]">info</span>
                                <span>Resolución mínima: 300 DPI</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-text-main mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">straighten</span>
                            Dimensiones
                        </h3>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-text-secondary text-[18px]">info</span>
                                <span>Ancho máximo: 30 cm</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-text-secondary text-[18px]">info</span>
                                <span>Alto: sin límite (se cobra por metros lineales)</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="text-center">
                <h2 className="text-[24px] font-bold text-text-main mb-4">¿Listo para comenzar?</h2>
                <p className="text-text-secondary mb-6">Crea tu pedido ahora y obtén transferencias DTF de calidad profesional</p>
                <div className="flex justify-center gap-4">
                    <Button to="/nuevo-pedido" size="lg" className="shadow-lg shadow-primary/20">
                        Crear Pedido
                    </Button>
                    <Button to="/tutoriales" variant="secondary" size="lg">
                        Ver Tutorial
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default SpecificationsPage;
