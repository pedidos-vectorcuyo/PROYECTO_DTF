
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const TutorialPage = () => {
    const steps = [
        {
            number: 1,
            title: "Crear Cuenta o Iniciar Sesión",
            icon: "person_add",
            description: "Para realizar un pedido, primero necesitas tener una cuenta en Vector Cuyo.",
            details: [
                "Si aún no tienes cuenta, haz clic en 'Registrarse' en la esquina superior derecha",
                "Completa el formulario con tu nombre, email, WhatsApp y contraseña",
                "Si ya tienes cuenta, simplemente haz clic en 'Ingresar' e ingresa tus credenciales"
            ],
            links: [
                { to: "/register", label: "Ir a Registro" },
                { to: "/login", label: "Ir a Inicio de Sesión" }
            ]
        },
        {
            number: 2,
            title: "Acceder al Panel de Pedidos",
            icon: "dashboard",
            description: "Una vez que hayas iniciado sesión, accede al panel para crear tu pedido.",
            details: [
                "Haz clic en el botón 'Comenzar Pedido' desde la página de inicio",
                "O navega a 'Servicios' → 'Lámina DTF Textil' en el menú superior",
                "También puedes usar los botones 'Cotizar Ahora' de la página principal"
            ],
            links: [
                { to: "/nuevo-pedido", label: "Ir al Panel de Pedidos" }
            ]
        },
        {
            number: 3,
            title: "Preparar tus Archivos",
            icon: "image",
            description: "Asegúrate de que tus archivos cumplan con los requisitos técnicos.",
            details: [
                "Formato: PNG con fondo transparente (requerido)",
                "Resolución mínima: 300 DPI para mejor calidad",
                "Dimensiones: Ancho máximo 30 cm, alto sin límite",
                "Verifica que los diseños estén en modo CMYK o RGB"
            ],
            tip: "💡 Consejo: Usa software como Photoshop, GIMP o removebg.com para eliminar fondos"
        },
        {
            number: 4,
            title: "Cargar tus Diseños",
            icon: "upload_file",
            description: "Sube tus archivos PNG al panel de pedidos.",
            details: [
                "Arrastra y suelta tus archivos en la zona de carga",
                "O haz clic en la zona de carga para seleccionar archivos desde tu PC",
                "Puedes cargar múltiples archivos a la vez",
                "El sistema analizará automáticamente las dimensiones de cada imagen"
            ],
            tip: "⚡ El análisis de dimensiones toma solo unos segundos"
        },
        {
            number: 5,
            title: "Revisar Dimensiones y Precios",
            icon: "calculate",
            description: "Verifica las medidas y el costo de cada diseño.",
            details: [
                "Cada archivo mostrará sus dimensiones en centímetros",
                "El precio se calcula por metros lineales (altura del diseño)",
                "Verás descuentos por volumen si superas los 6 metros totales",
                "El resumen total aparecerá en el panel derecho"
            ],
            tip: "🎉 Pedidos de 6+ metros obtienen precio mayorista automáticamente"
        },
        {
            number: 6,
            title: "Agregar Observaciones (Opcional)",
            icon: "edit_note",
            description: "Incluye instrucciones especiales para tu pedido.",
            details: [
                "Usa el campo 'Observaciones' para solicitudes especiales",
                "Ejemplos: 'Cortar individualmente', 'Agrupar por tallas', etc.",
                "También puedes indicar preferencias de empaquetado",
                "Este campo es completamente opcional"
            ]
        },
        {
            number: 7,
            title: "Confirmar el Pedido",
            icon: "check_circle",
            description: "Revisa todo y envía tu orden.",
            details: [
                "Verifica que todos los archivos cargados sean correctos",
                "Revisa el total y las observaciones",
                "Haz clic en 'CONFIRMAR ORDEN' para enviar el pedido",
                "Recibirás una confirmación por email y WhatsApp"
            ],
            tip: "📱 Te contactaremos por WhatsApp para coordinar el pago y la entrega"
        },
        {
            number: 8,
            title: "Seguimiento del Pedido",
            icon: "inventory",
            description: "Monitorea el estado de tu orden desde tu panel.",
            details: [
                "Accede a 'Historial' en el menú superior para ver tus pedidos",
                "Verás el estado actual: Pendiente, En Producción, o Completado",
                "Puedes descargar el comprobante de cada pedido",
                "La entrega estándar es de 24-48 horas"
            ],
            links: [
                { to: "/dashboard", label: "Ver mi Historial" }
            ]
        }
    ];

    return (
        <div className="flex flex-col w-full max-w-5xl mx-auto">
            {/* Header */}
            <section className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-tint text-primary rounded-full border border-primary/20 mb-6">
                    <span className="material-symbols-outlined text-lg">school</span>
                    <span className="text-xs font-bold uppercase tracking-widest">GUÍA PASO A PASO</span>
                </div>
                <h1 className="text-text-main tracking-tight text-[36px] md:text-[44px] font-bold leading-tight mb-6">
                    Cómo Realizar un Pedido
                </h1>
                <p className="text-text-secondary text-[18px] leading-relaxed max-w-3xl mx-auto">
                    Sigue esta guía completa para crear tu primer pedido de transferencias DTF en Vector Cuyo. Es rápido, simple y 100% online.
                </p>
            </section>

            {/* Steps */}
            <section className="space-y-8 mb-12">
                {steps.map((step, index) => (
                    <div key={index} className="bg-surface border border-gray-border rounded-card p-8 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-6">
                            {/* Step Number */}
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center font-bold text-[20px]">
                                    {step.number}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-grow">
                                {/* Title & Icon */}
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="material-symbols-outlined text-primary text-[28px]">{step.icon}</span>
                                    <h2 className="text-[24px] font-bold text-text-main">{step.title}</h2>
                                </div>

                                {/* Description */}
                                <p className="text-text-secondary mb-4 leading-relaxed">{step.description}</p>

                                {/* Details List */}
                                <ul className="space-y-2 mb-4">
                                    {step.details.map((detail, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-text-main">
                                            <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0 mt-0.5">arrow_right</span>
                                            <span>{detail}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Tip */}
                                {step.tip && (
                                    <div className="bg-blue-tint border border-primary/20 rounded-lg p-4 mb-4">
                                        <p className="text-sm text-text-main font-medium">{step.tip}</p>
                                    </div>
                                )}

                                {/* Action Links */}
                                {step.links && (
                                    <div className="flex flex-wrap gap-3 mt-4">
                                        {step.links.map((link, i) => (
                                            <Button key={i} to={link.to} variant={i === 0 ? "primary" : "secondary"} size="sm">
                                                {link.label}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* FAQ Section */}
            <section className="bg-gradient-to-br from-primary/5 to-blue-tint border border-gray-border rounded-card p-10 mb-12">
                <h2 className="text-[28px] font-bold text-text-main mb-6 text-center">Preguntas Frecuentes</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-text-main mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">help</span>
                            ¿Qué pasa si mi archivo no tiene fondo transparente?
                        </h3>
                        <p className="text-sm text-text-secondary ml-8">
                            El sistema solo acepta archivos PNG con fondo transparente. Puedes usar herramientas gratuitas como removebg.com para eliminar el fondo de tus imágenes.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-text-main mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">help</span>
                            ¿Cuánto tiempo tarda la producción?
                        </h3>
                        <p className="text-sm text-text-secondary ml-8">
                            El tiempo estándar de producción y entrega es de 24-48 horas hábiles una vez confirmado el pago.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-text-main mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">help</span>
                            ¿Cómo se calcula el precio?
                        </h3>
                        <p className="text-sm text-text-secondary ml-8">
                            El precio se calcula por metros lineales (la altura de tu diseño). Pedidos de 6 o más metros obtienen automáticamente descuento mayorista.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="text-center">
                <h2 className="text-[24px] font-bold text-text-main mb-4">¿Listo para crear tu primer pedido?</h2>
                <p className="text-text-secondary mb-6">Comienza ahora y recibe tus transferencias DTF en 24-48 horas</p>
                <div className="flex justify-center gap-4">
                    <Button to="/register" size="lg" className="shadow-lg shadow-primary/20">
                        Crear Cuenta
                    </Button>
                    <Button to="/nuevo-pedido" variant="secondary" size="lg">
                        Ir al Panel de Pedidos
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default TutorialPage;
