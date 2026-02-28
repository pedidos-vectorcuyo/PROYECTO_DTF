---
description: How to deploy the React frontend to Hostinger (vectorcuyo.com)
---

## Deployment Configuration — NEVER CHANGE WITHOUT READING THIS

The project deploys automatically to **vectorcuyo.com** via GitHub Actions on every push to `main`.

### ⚠️ CRITICAL: Do NOT use FTP for deployment

Hostinger's FTP server blocks repeated connections from GitHub Actions IP ranges (fail2ban / rate limiting). **All FTP-based deploys will time out.** The correct method is **SSH/SCP on port 65002**.

---

### Server Details

| Parameter | Value |
|-----------|-------|
| **Host** | `167.88.35.13` |
| **SSH Port** | `65002` |
| **SSH Username** | `u501128802` |
| **Web Root** | `/home/u501128802/domains/vectorcuyo.com/public_html/` |
| **FTP Port** | `21` (DO NOT USE — gets rate-limited/blocked) |

### GitHub Secrets Required

| Secret | Value |
|--------|-------|
| `SSH_PASSWORD` | SSH password for user `u501128802` |
| `VITE_API_BASE_URL` | n8n backend base URL |
| `VITE_API_PRICES_ENDPOINT` | Prices API endpoint |
| `VITE_API_UPLOAD_ORDER_ENDPOINT` | Order upload endpoint |
| `VITE_API_LOGIN_ENDPOINT` | Login endpoint |
| `VITE_API_REGISTER_ENDPOINT` | Register endpoint |
| `VITE_API_GET_ORDERS_ENDPOINT` | Get orders endpoint |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID |

> Note: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` secrets exist but are **NOT used** — the deploy uses SSH_PASSWORD only.

---

### How the Deploy Works

The workflow (`.github/workflows/deploy.yml`) runs on every push to `main`:

1. **Checkout** the repository
2. **Setup Node.js 18** and install npm dependencies
3. **Build** the React app (`npm run build` inside `vector-cuyo-frontend/`)
4. **Clean** the server's web root via SSH: `rm -rf /home/u501128802/domains/vectorcuyo.com/public_html/*`
5. **Upload** the built files via SCP to `/home/u501128802/domains/vectorcuyo.com/public_html/`
   - Uses `appleboy/scp-action@v0.1.7`
   - `strip_components: 2` removes the `vector-cuyo-frontend/dist/` prefix

### deploy.yml — Correct Final Version

```yaml
      - name: 🧹 Clean old files on server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: 167.88.35.13
          port: 65002
          username: u501128802
          password: ${{ secrets.SSH_PASSWORD }}
          script: rm -rf /home/u501128802/domains/vectorcuyo.com/public_html/*

      - name: 📂 Deploy via SSH/SCP
        uses: appleboy/scp-action@v0.1.7
        with:
          host: 167.88.35.13
          port: 65002
          username: u501128802
          password: ${{ secrets.SSH_PASSWORD }}
          source: "vector-cuyo-frontend/dist/"
          target: "/home/u501128802/domains/vectorcuyo.com/public_html"
          strip_components: 2
```

---

### Troubleshooting

**"Timeout (control socket)"** → You're using FTP. Switch to SSH/SCP as above.

**"ENOTFOUND ***"** → A GitHub Secret has an invalid value. Check `FTP_SERVER` is `167.88.35.13` (even though FTP isn't used, the secret value shouldn't break other parts).

**"Permission denied"** → The `SSH_PASSWORD` secret might be wrong. Go to Hostinger hPanel → vectorcuyo.com → Avanzado → Acceso SSH → Cambiar contraseña, then update the GitHub Secret.

**Files uploaded to wrong folder** → Check `strip_components: 2` is set. With source `vector-cuyo-frontend/dist/index.html`, this removes 2 levels to get `index.html` at the target root.

**SSH INACTIVE error** → Go to Hostinger hPanel → vectorcuyo.com → Avanzado → Acceso SSH → click "Habilitar".

---

### File Structure

```
PROYECTO_DTF/
├── .github/
│   └── workflows/
│       └── deploy.yml        ← The deployment workflow
├── vector-cuyo-frontend/     ← React frontend (Vite + React)
│   ├── src/
│   ├── dist/                 ← Build output (gitignored, built by CI)
│   └── package.json
└── .agents/
    └── workflows/
        └── deploy.md         ← This file
```
