<script>
document.addEventListener("DOMContentLoaded", async function() {
    // 1. DETECTOR: ¿Estamos en el Panel de Historial?
    const divTabla = document.getElementById('lista-pedidos');
    if (!divTabla) return; 

    // 2. VALIDACIÓN DE SESIÓN (SIN REDIRECCIÓN AUTOMÁTICA para evitar bucles)
    const rawUser = localStorage.getItem('dtf_user');
    
    // Función para mostrar error en pantalla y detener todo
    function mostrarErrorPanel(txt) {
        document.body.innerHTML = `<div style="text-align:center; padding:50px; color:#dc2626;">
            <h2>⛔ Sesión Finalizada</h2><p>${txt}</p>
            <button onclick="localStorage.removeItem('dtf_user'); window.location.href='/log-in';" style="padding:10px 20px; margin-top:20px; cursor:pointer;">Iniciar Sesión</button>
        </div>`;
    }

    if (!rawUser) { mostrarErrorPanel("No has iniciado sesión."); return; }

    let currentUser;
    try {
        currentUser = JSON.parse(rawUser);
        if (Array.isArray(currentUser)) currentUser = currentUser[0];
        if (currentUser.json) currentUser = currentUser.json;
        if (!currentUser || !currentUser.id) throw new Error("ID inválido");
    } catch (e) { mostrarErrorPanel("Datos de sesión corruptos."); return; }

    // 3. RELLENAR DATOS DEL PERFIL (Intentamos varios IDs posibles)
    // Intento 1: IDs estándar
    let iNom = document.getElementById('profile-nombre');
    let iMail = document.getElementById('profile-email');
    let iWsp = document.getElementById('profile-whatsapp');

    // Intento 2: Búsqueda por nombre de campo (fallback)
    if (!iNom) iNom = document.querySelector('input[name="nombre"]');
    if (!iMail) iMail = document.querySelector('input[name="email"]');
    if (!iWsp) iWsp = document.querySelector('input[name="whatsapp"]');

    if (iNom) iNom.value = currentUser.nombre || currentUser.name || '';
    if (iMail) iMail.value = currentUser.email || currentUser.correo || '';
    if (iWsp) iWsp.value = currentUser.whatsapp || currentUser.telefono || '';

    // 4. CARGAR TABLA DE PEDIDOS
    const URL_HISTORIAL = "https://n8n.vectorcuyo.com/webhook/get-orders"; 
    divTabla.innerHTML = '<div style="text-align:center; padding:20px;">⏳ Buscando pedidos...</div>';

    try {
        const fd = new FormData();
        fd.append('id_cliente', currentUser.id);

        const req = await fetch(URL_HISTORIAL, { method: 'POST', body: fd });
        let ordenes = await req.json();

        if (ordenes.json) ordenes = ordenes.json;
        else if (ordenes.data) ordenes = ordenes.data;

        if (!Array.isArray(ordenes)) {
            if (ordenes && typeof ordenes === 'object' && Object.keys(ordenes).length > 0) ordenes = [ordenes];
            else ordenes = [];
        }

        if(ordenes.length === 0) {
            divTabla.innerHTML = `<div style="text-align:center; padding:20px; background:#f9fafb;">📂 No tienes pedidos registrados.</div>`;
            return;
        }

        let html = `<div style="overflow-x:auto;"><table style="width:100%; border-collapse:collapse; min-width:500px;">
            <thead style="background:#f3f4f6; border-bottom:2px solid #ddd;">
                <tr><th style="padding:10px;">ID</th><th style="padding:10px;">Fecha</th><th style="padding:10px;">Estado</th><th style="padding:10px; text-align:right;">Total</th></tr>
            </thead><tbody>`;
        
        ordenes.forEach(o => {
            if(!o || !o.id) return; 
            let fecha = o.creado_en || '-';
            if(fecha.includes('T')) fecha = fecha.split('T')[0];
            
            html += `<tr style="border-bottom:1px solid #eee;">
                <td style="padding:10px;">#${o.id}</td>
                <td style="padding:10px;">${fecha}</td>
                <td style="padding:10px;">${o.estado || 'Ingresado'}</td>
                <td style="padding:10px; text-align:right;">$${parseFloat(o.precio_final || 0).toLocaleString('es-AR')}</td>
            </tr>`;
        });
        html += `</tbody></table></div>`;
        divTabla.innerHTML = html;

    } catch(e) {
        divTabla.innerHTML = `<div style="color:red; text-align:center;">Error al cargar historial.</div>`;
    }
});
</script>