<script>
    document.addEventListener("DOMContentLoaded", function() {
    // 1. DETECTOR: ¿Estamos en la página de Login?
    const loginEmailInput = document.getElementById('login-email');
    if (!loginEmailInput) return; // Si no hay formulario de login, no hacemos nada.

    // 2. GUARDIA DE SESIÓN: Si ya está logueado, mandar al Panel
    const rawUser = localStorage.getItem('dtf_user');
    if (rawUser) {
        try {
        let u = JSON.parse(rawUser);
    // Limpieza de basura de n8n
    if (Array.isArray(u)) u = u[0];
    if (u && u.json) u = u.json;

    if (u && u.id) {
        window.location.href = '/panel-de-pedidos-dtf';
    return; 
            } else {
        localStorage.removeItem('dtf_user'); // Sesión rota, borrar
            }
        } catch (e) {localStorage.removeItem('dtf_user'); }
    }

    // 3. FUNCIÓN OJITO
    window.toggleLoginPass = function(icon) {
        const input = document.getElementById('login-pass');
    if (input.type === "password") {
        input.type = "text";
    icon.textContent = "🙈"; 
        } else {
        input.type = "password";
    icon.textContent = "👁️"; 
        }
    };

    // 4. LÓGICA DE LOGIN
    window.doLogin = async function() {
        const URL_WEBHOOK = "https://n8n.vectorcuyo.com/webhook/auth-login";
    const btn = document.getElementById('btn-login');
    const msg = document.getElementById('login-msg');

    btn.disabled = true; btn.textContent = "Verificando..."; msg.textContent = "";

    try {
            const fd = new FormData();
    fd.append('email', document.getElementById('login-email').value);
    fd.append('password', document.getElementById('login-pass').value);

    const req = await fetch(URL_WEBHOOK, {method: 'POST', body: fd });
    const res = await req.json();

    // LIMPIEZA DE DATOS CRÍTICA
    let userData = Array.isArray(res) ? res[0] : res;
    if (userData && userData.json) userData = userData.json;

    if (userData && userData.id) {
        localStorage.setItem('dtf_user', JSON.stringify(userData));
    window.location.href = '/panel-de-pedidos-dtf'; 
            } else {
        msg.textContent = "❌ Credenciales incorrectas.";
    btn.disabled = false; btn.textContent = "INGRESAR";
            }
        } catch(e) {
        console.error(e);
    msg.textContent = "Error de conexión.";
    btn.disabled = false; btn.textContent = "INGRESAR";
        }
    };
});
</script>