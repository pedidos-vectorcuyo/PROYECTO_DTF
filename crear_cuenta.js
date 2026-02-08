<script>
document.addEventListener("DOMContentLoaded", function() {
    // 1. DETECTOR: ¿Estamos en Registro?
    if (!document.getElementById('reg-nombre')) return;

    // 2. FUNCIÓN OJITO
    window.toggleRegPass = function(fieldId, icon) {
        const input = document.getElementById(fieldId);
        if (input.type === "password") {
            input.type = "text";
            icon.textContent = "🙈";
        } else {
            input.type = "password";
            icon.textContent = "👁️";
        }
    };

    // 3. LÓGICA REGISTRO
    window.doRegister = async function() {
        const URL_WEBHOOK_REG = "https://n8n.vectorcuyo.com/webhook/auth-register"; 
        const pass1 = document.getElementById('reg-pass').value;
        const pass2 = document.getElementById('reg-pass-confirm').value;
        const btn = document.getElementById('btn-reg');
        const msg = document.getElementById('reg-msg');
        
        if (pass1 !== pass2) {
            document.getElementById('pass-error').style.display = 'block';
            alert("Las contraseñas no coinciden");
            return;
        }

        btn.disabled = true; btn.textContent = "Procesando..."; msg.textContent = "";

        try {
            const fd = new FormData();
            fd.append('nombre', document.getElementById('reg-nombre').value);
            fd.append('email', document.getElementById('reg-email').value);
            fd.append('whatsapp', document.getElementById('reg-tel').value);
            fd.append('password', pass1);

            const req = await fetch(URL_WEBHOOK_REG, { method: 'POST', body: fd });
            
            let res;
            try { res = await req.json(); } catch(err) { res = null; }

            // Buscamos ID en la respuesta
            let finalData = res;
            if (Array.isArray(finalData)) finalData = finalData[0];
            if (finalData && finalData.json) finalData = finalData.json;

            if (finalData && finalData.id) {
                alert("✅ ¡Cuenta creada con éxito!");
                window.location.href = '/log-in'; 
            } else {
                msg.innerHTML = `<div style="background:#fee2e2; color:#b91c1c; padding:10px; border-radius:6px; margin-top:10px;">
                    ⚠️ El correo ya existe.<br><a href="/password-reset">Recuperar contraseña</a>
                </div>`;
                btn.disabled = false; btn.textContent = "REGISTRARME";
            }
        } catch(e) {
            msg.textContent = "Error de conexión.";
            btn.disabled = false; btn.textContent = "REGISTRARME";
        }
    };
});
</script>