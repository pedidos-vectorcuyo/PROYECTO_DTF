<script>
// CONTROLADOR: Solo en reset
    if (window.location.href.includes('password-reset')) {

        document.addEventListener("DOMContentLoaded", function () {
            const formReset = document.getElementById('form-reset');
            if (!formReset) return;

            formReset.addEventListener('submit', async function (e) {
                e.preventDefault();
                const URL_WEBHOOK = "https://n8n.vectorcuyo.com/webhook/auth-reset";

                const email = document.getElementById('reset-email').value;
                const btn = document.getElementById('btn-reset');
                const msg = document.getElementById('reset-msg');

                btn.disabled = true; btn.textContent = "Enviando..."; msg.textContent = "";

                try {
                    const fd = new FormData();
                    fd.append('email', email);

                    const req = await fetch(URL_WEBHOOK, { method: 'POST', body: fd });
                    const res = await req.json();

                    if (res.success) {
                        msg.textContent = "✅ Revisa tu correo (bandeja de entrada o spam).";
                        msg.style.color = "#059669";
                        document.getElementById('reset-email').value = "";
                        btn.textContent = "ENVIADO";
                    } else {
                        msg.textContent = "❌ No pudimos procesar la solicitud.";
                        msg.style.color = "#dc2626";
                        btn.disabled = false; btn.textContent = "RECUPERAR";
                    }
                } catch (error) {
                    console.error(error);
                    msg.textContent = "Error de conexión.";
                    btn.disabled = false; btn.textContent = "RECUPERAR";
                }
            });
        });
}
</script>