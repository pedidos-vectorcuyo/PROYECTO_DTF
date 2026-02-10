<script>
    document.addEventListener("DOMContentLoaded", function() {
    // 1. DETECTOR: ¿Estamos en la página de Pedidos (Upload)?
    const dropzone = document.getElementById("vc-dropzone");
    if (!dropzone) return;

    // 2. SEGURIDAD DE SESIÓN
    const userStr = localStorage.getItem('dtf_user');
    if (!userStr) {
        window.location.href = '/log-in';
    return;
    }
    let currentUser;
    try {
        currentUser = JSON.parse(userStr);
    if (Array.isArray(currentUser)) currentUser = currentUser[0];
    if (currentUser.json) currentUser = currentUser.json;
    } catch(e) {window.location.href = '/log-in'; return; }

    // 3. REFERENCIAS DOM
    const dom = {
        cliente: document.getElementById("vc-cliente"),
    email: document.getElementById("vc-email"),
    telefono: document.getElementById("vc-telefono"),
    dropzone: dropzone,
    input: document.getElementById("vc-archivo"),
    container: document.getElementById("vc-files-container"),
    loading: document.getElementById("vc-loading"),
    obs: document.getElementById("vc-observaciones"),
    totalDisplay: document.getElementById("vc-summary-total"),
    metrosDisplay: document.getElementById("vc-metros-totales"),
    priceBadge: document.getElementById("vc-price-badge"),
    btnIngresar: document.getElementById("vc-btn-ingresar"),
    statusMsg: document.getElementById("vc-status-message"),
    // Ticket
    ticketSection: document.getElementById("vc-ticket-section"),
    ticketSubtotal: document.getElementById("vc-ticket-subtotal"),
    rowDiscount: document.getElementById("vc-row-discount"),
    ticketDiscount: document.getElementById("vc-ticket-discount"),
    summaryList: document.getElementById("vc-summary-list"),
    // Modal
    modal: document.getElementById("vc-modal-warn"),
    modalMsg: document.getElementById("vc-warn-msg"),
    btnWarnAccept: document.getElementById("vc-warn-accept"),
    btnWarnCancel: document.getElementById("vc-warn-cancel")
    };

    // Rellenar datos
    if(dom.cliente) dom.cliente.value = currentUser.nombre || '';
    if(dom.email) dom.email.value = currentUser.correo || '';
    if(dom.telefono) dom.telefono.value = currentUser.whatsapp || '';

    // 4. PRECIOS
    const URL_PRECIO = "https://n8n.vectorcuyo.com/webhook/precio-dtf?t=" + Date.now();
    const URL_UPLOAD = "https://n8n.vectorcuyo.com/webhook/pedido-dtf-test";

    let precios = {base: 13500, p10: 11500, p30: 10500 };
    let archivos = [];
    let archivoPendiente = null;

    fetch(URL_PRECIO).then(r => r.json()).then(d => {
        const data = Array.isArray(d) ? d[0] : d;
    if(data) {
            if(data.precio_metro) precios.base = parseFloat(data.precio_metro);
    if(data.precio_mayorista_10) precios.p10 = parseFloat(data.precio_mayorista_10);
    if(data.precio_mayorista_30) precios.p30 = parseFloat(data.precio_mayorista_30);
        }
    }).catch(() => console.log("Precios offline"));

    // ============================================================
    // 5. EVENTOS DE CARGA (CLICK Y DRAG & DROP)
    // ============================================================

    // A) Click normal
    dom.dropzone.addEventListener("click", () => dom.input.click());

    dom.input.addEventListener("change", async function() {
        if(!this.files.length) return;
    handleFiles(this.files);
    this.value = ""; 
    });

    // B) Drag & Drop (Arrastrar y Soltar)
    // Prevenir comportamientos por defecto
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dom.dropzone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
    e.stopPropagation();
    }

    // Efecto visual (Clase CSS .dragover)
    ['dragenter', 'dragover'].forEach(eventName => {
        dom.dropzone.addEventListener(eventName, () => dom.dropzone.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dom.dropzone.addEventListener(eventName, () => dom.dropzone.classList.remove('dragover'), false);
    });

    // Manejar el soltado (Drop)
    dom.dropzone.addEventListener('drop', async (e) => {
        const dt = e.dataTransfer;
    const files = dt.files;
    if(files.length) handleFiles(files);
    });

    // Procesador central de lista de archivos
    async function handleFiles(filesList) {
        dom.loading.style.display = 'block';
    for(const file of filesList) {
        await procesarArchivo(file);
        }
    dom.loading.style.display = 'none';
    }

    // ============================================================

    async function procesarArchivo(file) {
        if(file.type !== "image/png") {alert("Solo archivos PNG."); return; }
    const meta = await leerMetadatos(file);
    const dpi = meta.dpiX || 72;
    const anchoCm = (meta.width / dpi) * 2.54;
    const largoM = ((meta.height / dpi) * 2.54) / 100;

        if(dpi >= 350) {alert(`DPI Alto (${dpi}).`); return; }
    if(dpi < 299) {alert(`DPI Bajo (${dpi}).`); return; }
        if(anchoCm > 57.5) {alert(`Ancho excede 57.5cm.`); return; }
        if(largoM >= 10) {alert("Largo excede 10m."); return; }

    let msg = null;
    if(anchoCm < 55) msg = `Ancho ${anchoCm.toFixed(1)}cm (<55). ¿Seguir?`;
    if(largoM < 1 && !msg) msg = `Largo ${largoM.toFixed(2)}m. Cobro mínimo 1m.`;

    const item = {id: Date.now()+Math.random(), file, anchoCm, largoM, copias: 1, propiedades: [] };
    if(msg) {dom.modalMsg.textContent = msg; dom.modal.style.display = "flex"; archivoPendiente = item; }
    else agregarItem(item);
    }

    function leerMetadatos(file) {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = e => {
                const view = new DataView(e.target.result);
    let res = {width: 0, height: 0 };
    if (view.getUint32(0) === 0x89504E47) {
        let offset = 8;
    while (offset < view.byteLength) {
        let len = view.getUint32(offset);
    let type = view.getUint32(offset + 4);
    if (type === 0x49484452) {res.width = view.getUint32(offset + 8); res.height = view.getUint32(offset + 12); }
    if (type === 0x70485973) {let x = view.getUint32(offset + 8); if (view.getUint8(offset + 16) === 1) res.dpiX = Math.round(x * 0.0254); }
    offset += 12 + len;
                    }
                }
                if (!res.width) createImageBitmap(file).then(b => {resolve({ width: b.width, height: b.height, dpiX: 72 }); }).catch(() => resolve(res));
    else resolve(res);
            };
    reader.readAsArrayBuffer(file.slice(0, 128 * 1024));
        });
    }

    // Funciones Globales UI
    window.agregarItem = function(item) {archivos.push(item); render(); };
    window.eliminarItem = (idx) => {archivos.splice(idx, 1); render(); };
    window.sumarCopia = (idx, d) => {let v=archivos[idx].copias+d; if(v<1)v=1; archivos[idx].copias=v; render(); };
    window.toggleProp = (idx, c) => {let p=archivos[idx].propiedades; archivos[idx].propiedades=p.includes(c)?p.filter(x=>x!==c):[...p,c]; render(); };

    dom.btnWarnAccept.onclick = () => { if(archivoPendiente) window.agregarItem(archivoPendiente); dom.modal.style.display="none"; };
    dom.btnWarnCancel.onclick = () => {dom.modal.style.display = "none"; };

    function render() {
        dom.container.innerHTML = ""; dom.summaryList.innerHTML = ""; let mt = 0;
        archivos.forEach((item, idx) => {
        let propsMap = {'B': 'Blancas', 'N': 'Negras', 'C': 'Colores', 'S': 'Semitonos' };
            let btns = Object.entries(propsMap).map(([k,v]) => `<button class="vc-option-btn ${item.propiedades.includes(k)?'active':''}" onclick="window.toggleProp(${idx}, '${k}')">${v}</button>`).join('');
    dom.container.innerHTML += `<div class="vc-file-card"><div class="vc-file-header"><span>${item.file.name}</span><span class="vc-btn-remove" onclick="window.eliminarItem(${idx})">Eliminar</span></div><div class="vc-metrics-row"><div class="vc-metric-box">${item.anchoCm.toFixed(1)}cm</div><div class="vc-metric-box">${item.largoM.toFixed(2)}m</div><div class="vc-qty-stepper"><button class="vc-qty-btn" onclick="window.sumarCopia(${idx},-1)">-</button><span class="vc-qty-val">${item.copias}</span><button class="vc-qty-btn" onclick="window.sumarCopia(${idx},1)">+</button></div></div><div class="vc-tag-options">${btns}</div></div>`;
    mt += item.largoM * item.copias;
    dom.summaryList.innerHTML += `<div class="vc-summary-item"><span>${item.file.name} (x${item.copias})</span><span>${(item.largoM * item.copias).toFixed(2)}m</span></div>`;
        });
    calcTotales(mt);
    }

    function calcTotales(m) {
        let mf = Math.ceil(m*10)/10; if(mf>0 && mf<1) mf=1;
    let p = precios.base, bd="Precio Base", cl="";
        if(mf>30) {p = precios.p30; bd="GOLD (>30m)"; cl="vc-badge-tier2"; }
        else if(mf>10) {p = precios.p10; bd="MAYORISTA (>10m)"; cl="vc-badge-tier1"; }
    let sub=mf*precios.base, tot=mf*p, desc=sub-tot;

    dom.metrosDisplay.textContent=mf.toFixed(2); dom.priceBadge.textContent=bd; dom.priceBadge.className="vc-price-badge "+cl; dom.totalDisplay.textContent=`$${tot.toLocaleString('es-AR')}`;
    dom.ticketSection.style.display=archivos.length?"block":"none";
    dom.ticketSubtotal.textContent=`$${sub.toLocaleString('es-AR')}`;
        dom.rowDiscount.style.display=desc>0?"flex":"none"; dom.ticketDiscount.textContent=`-$${desc.toLocaleString('es-AR')}`;
        
        let inc = archivos.some(a=>!a.propiedades.length);
    if(!archivos.length || inc) {dom.btnIngresar.disabled = true; dom.btnIngresar.classList.remove("ready"); dom.statusMsg.textContent=inc?"⚠️ Faltan propiedades":""; }
    else {dom.btnIngresar.disabled = false; dom.btnIngresar.classList.add("ready"); dom.statusMsg.textContent=""; }
    }

    dom.btnIngresar.addEventListener("click", async () => {
        dom.btnIngresar.disabled = true; dom.btnIngresar.textContent="Subiendo...";

    let pl = dom.totalDisplay.textContent.replace(/[$.]/g,'').replace(',','.');
    let bid = `PED-${Date.now()}`;
        let res = archivos.map((a,i)=>`#${i + 1}(${a.propiedades.join('')})`).join("|");
    const fechaCorta = new Date().toISOString().slice(2,10).replace(/-/g, '.');
    const nombreCliente = dom.cliente.value || 'Cliente';
    let err=0;

    for(let i=0; i<archivos.length; i++) {
        let it = archivos[i];
    let fd = new FormData();
    let nombreClean = it.file.name.split('.').slice(0, -1).join('.'); 
            let codigos = it.propiedades.length > 0 ? it.propiedades.join('') : 'Gral';
    let nombreFinal = `${fechaCorta} - ${nombreCliente}(${nombreClean})'x${it.copias}${codigos}.png`;

    fd.append("data", it.file, nombreFinal);
    fd.append("idPedido", bid); fd.append("cliente", dom.cliente.value); fd.append("email", dom.email.value); fd.append("telefono", dom.telefono.value); fd.append("observaciones", dom.obs.value);
    fd.append("anchoCm", it.anchoCm); fd.append("largoM", it.largoM); fd.append("copias", it.copias); fd.append("propiedades", res);
    fd.append("precioCotizado", dom.totalDisplay.textContent); fd.append("precio_final", pl);
    fd.append("totalArchivos", archivos.length); fd.append("indiceArchivo", i+1);
    if(currentUser.id) fd.append("id_cliente", currentUser.id);

    try {await fetch(URL_UPLOAD, { method: "POST", body: fd }); } catch(e){err++; }
        }

    if(!err) {alert("✅ Orden Enviada"); window.location.href='/pedidos'; }
    else {alert("❌ Error al subir algunos archivos"); dom.btnIngresar.disabled=false; dom.btnIngresar.textContent="Reintentar"; }
    });
});
</script>