
import React from 'react';

const LegalPage = () => {
    return (
        <div className="max-w-[900px] mx-auto px-6 py-12 md:py-16">
            <div className="text-center mb-16">
                <h1 className="mb-4 text-text-main tracking-tight text-[32px] md:text-[40px] font-bold leading-tight">Políticas y Legales</h1>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-off-white text-text-secondary rounded-full border border-gray-border">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    <span className="text-xs font-medium">Última actualización: Marzo 2024</span>
                </div>
            </div>

            <div className="sticky top-16 z-30 mb-8 bg-off-white py-4 shadow-sm w-full">
                <nav className="flex flex-wrap justify-center gap-2 md:gap-4 p-1.5 bg-surface border border-gray-border rounded-lg shadow-sm w-fit mx-auto">
                    <a className="px-4 py-2 text-sm font-medium text-text-main rounded-md hover:bg-blue-tint hover:text-primary transition-colors" href="#terminos">Términos de Servicio</a>
                    <a className="px-4 py-2 text-sm font-medium text-text-main rounded-md hover:bg-blue-tint hover:text-primary transition-colors" href="#privacidad">Privacidad</a>
                    <a className="px-4 py-2 text-sm font-medium text-text-main rounded-md hover:bg-blue-tint hover:text-primary transition-colors" href="#reembolsos">Reembolsos</a>
                    <a className="px-4 py-2 text-sm font-medium text-text-main rounded-md hover:bg-blue-tint hover:text-primary transition-colors" href="#envios">Envíos</a>
                </nav>
            </div>

            <div className="space-y-8">
                <section className="bg-surface border border-gray-border rounded-card p-8 md:p-10 shadow-sm scroll-mt-36" id="terminos">
                    <h2 className="flex items-center gap-3 text-[24px] font-bold text-text-main mb-6">
                        <span className="w-8 h-8 rounded-lg bg-blue-tint text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[20px]">gavel</span>
                        </span>
                        Términos de Servicio
                    </h2>
                    <div className="text-text-secondary space-y-4 text-[15px] leading-[1.6]">
                        <p>Bienvenido a Vector Cuyo. Al utilizar nuestros servicios de impresión industrial, usted acepta cumplir con los siguientes términos y condiciones. Estos términos se aplican a todos los usuarios del sitio y clientes de nuestros servicios B2B.</p>
                        <h3 className="text-[18px] font-semibold text-text-main mb-3 mt-6">1. Uso de la Plataforma</h3>
                        <p>Nuestra plataforma está destinada exclusivamente para uso comercial y profesional. Usted se compromete a proporcionar información veraz y actualizada durante el proceso de registro y compra.</p>
                        <h3 className="text-[18px] font-semibold text-text-main mb-3 mt-6">2. Propiedad Intelectual</h3>
                        <p>Todo el contenido mostrado en este sitio, incluyendo pero no limitado a logotipos, imágenes, textos y software, es propiedad de Vector Cuyo o de sus respectivos dueños y está protegido por las leyes de propiedad intelectual.</p>
                        <ul className="space-y-3 mt-4 ml-2">
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 filled">check_circle</span>
                                <span>El usuario garantiza tener los derechos de reproducción de cualquier archivo subido para impresión.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 filled">check_circle</span>
                                <span>Vector Cuyo se reserva el derecho de rechazar trabajos que infrinjan derechos de autor o contengan material ofensivo.</span>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="bg-surface border border-gray-border rounded-card p-8 md:p-10 shadow-sm scroll-mt-36" id="privacidad">
                    <h2 className="flex items-center gap-3 text-[24px] font-bold text-text-main mb-6">
                        <span className="w-8 h-8 rounded-lg bg-blue-tint text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[20px]">security</span>
                        </span>
                        Política de Privacidad
                    </h2>
                    <div className="text-text-secondary space-y-4 text-[15px] leading-[1.6]">
                        <p>En Vector Cuyo, nos tomamos muy en serio la privacidad de sus datos. Esta sección detalla cómo recopilamos, utilizamos y protegemos su información personal y empresarial.</p>
                        <h3 className="text-[18px] font-semibold text-text-main mb-3 mt-6">Recopilación de Datos</h3>
                        <p>Recopilamos información necesaria para procesar sus pedidos y mejorar su experiencia, incluyendo datos de facturación, dirección de envío y archivos de diseño. No compartimos sus diseños con terceros sin su consentimiento explícito.</p>
                        <h3 className="text-[18px] font-semibold text-text-main mb-3 mt-6">Seguridad</h3>
                        <p>Utilizamos encriptación SSL de grado industrial para proteger todas las transmisiones de datos. Sus archivos se almacenan en servidores seguros y se eliminan automáticamente 30 días después de completar el pedido, salvo que solicite su conservación.</p>
                    </div>
                </section>

                <section className="bg-surface border border-gray-border rounded-card p-8 md:p-10 shadow-sm scroll-mt-36" id="reembolsos">
                    <h2 className="flex items-center gap-3 text-[24px] font-bold text-text-main mb-6">
                        <span className="w-8 h-8 rounded-lg bg-blue-tint text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[20px]">currency_exchange</span>
                        </span>
                        Política de Reembolsos
                    </h2>
                    <div className="text-text-secondary space-y-4 text-[15px] leading-[1.6]">
                        <p>Debido a la naturaleza personalizada de nuestros productos de impresión industrial, aplicamos las siguientes políticas de devolución y reembolso:</p>
                        <ol className="list-decimal list-inside space-y-3 mt-4 marker:text-text-main marker:font-semibold">
                            <li className="pl-2"><strong>Defectos de Producción:</strong> Si el producto presenta fallas de impresión atribuibles a Vector Cuyo (manchas, colores incorrectos por fallo de máquina), se realizará una reimpresión sin costo o un reembolso total.</li>
                            <li className="pl-2"><strong>Errores de Archivo:</strong> No nos hacemos responsables por errores ortográficos, de baja resolución o de diseño presentes en los archivos aprobados por el cliente.</li>
                            <li className="pl-2"><strong>Plazos de Reclamo:</strong> Todo reclamo debe realizarse dentro de los 5 días hábiles posteriores a la recepción del pedido.</li>
                        </ol>
                    </div>
                </section>

                <section className="bg-surface border border-gray-border rounded-card p-8 md:p-10 shadow-sm scroll-mt-36" id="envios">
                    <h2 className="flex items-center gap-3 text-[24px] font-bold text-text-main mb-6">
                        <span className="w-8 h-8 rounded-lg bg-blue-tint text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                        </span>
                        Envíos y Logística
                    </h2>
                    <div className="text-text-secondary space-y-4 text-[15px] leading-[1.6]">
                        <p>Operamos con socios logísticos de primera línea para garantizar la entrega segura de sus materiales. Los tiempos de producción son independientes de los tiempos de envío.</p>
                        <h3 className="text-[18px] font-semibold text-text-main mb-3 mt-6">Tiempos Estimados</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="p-4 bg-off-white rounded-lg border border-gray-border">
                                <h4 className="font-semibold text-text-main text-sm mb-1">Envío Estándar</h4>
                                <p className="text-xs !mb-0 text-text-secondary">3-5 días hábiles a todo el país.</p>
                            </div>
                            <div className="p-4 bg-off-white rounded-lg border border-gray-border">
                                <h4 className="font-semibold text-text-main text-sm mb-1">Envío Express</h4>
                                <p className="text-xs !mb-0 text-text-secondary">24-48 horas en capitales principales.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mt-12 bg-primary/5 border border-primary/20 rounded-card p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-primary">
                            <span className="material-symbols-outlined">support_agent</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-text-main">¿Necesitas más ayuda?</h4>
                            <p className="text-sm !mb-0 text-text-secondary">Nuestro equipo legal y de soporte está disponible para responder tus dudas.</p>
                        </div>
                    </div>
                    <button className="shrink-0 bg-primary hover:bg-[#253991] text-white px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all shadow-lg shadow-primary/10 hover:shadow-primary/20 whitespace-nowrap">
                        Contactar Soporte
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LegalPage;
