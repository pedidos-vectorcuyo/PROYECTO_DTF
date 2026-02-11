# 🚀 Guía de Despliegue - Vector Cuyo Frontend

## Despliegue Manual a Hostinger

### 📋 Configuración Inicial (Solo una vez)

1. **Edita el script de despliegue:**
   - Abre `deploy-to-hostinger.ps1`
   - Busca la línea: `$FTP_PASSWORD = "TuContraseñaAquí"`
   - Reemplaza `TuContraseñaAquí` con tu contraseña FTP real
   - Guarda el archivo

### 🎯 Cómo Desplegar

**Opción 1: Desde PowerShell**
```powershell
# Navega al proyecto
cd C:\Users\Gabriel\Desktop\PROYECTO_DTF

# Ejecuta el script
.\deploy-to-hostinger.ps1
```

**Opción 2: Doble clic**
- Haz clic derecho en `deploy-to-hostinger.ps1`
- Selecciona **"Ejecutar con PowerShell"**

### ⚡ Opciones Avanzadas

**Saltar el build (usar dist/ existente):**
```powershell
.\deploy-to-hostinger.ps1 -SkipBuild
```
Útil si ya hiciste `npm run build` previamente.

---

## 🔧 Troubleshooting

### Error: "No se pueden ejecutar scripts en este sistema"

Ejecuta esto en PowerShell como **Administrador**:
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: "Build falló"

1. Verifica que estés en la carpeta correcta
2. Ejecuta manualmente:
   ```powershell
   cd vector-cuyo-frontend
   npm install
   npm run build
   ```

### Error: "Archivo no encontrado en FTP"

1. Verifica las credenciales FTP en el script
2. Verifica que `public_html` esté vacío en Hostinger
3. Asegúrate de tener permisos de escritura

---

## 📊 Proceso del Script

1. **Build** (si no se salta)
   - Ejecuta `npm run build` en `vector-cuyo-frontend/`
   - Genera la carpeta `dist/` con archivos optimizados

2. **Despliegue FTP**
   - Se conecta a Hostinger (167.88.35.13)
   - Sube SOLO el contenido de `dist/` a `/public_html/`
   - Crea subdirectorios automáticamente (ej: `assets/`)

3. **Confirmación**
   - Muestra resumen de archivos subidos
   - Indica si hubo errores

---

## 🔄 Workflow Recomendado

1. **Haces cambios en el código**
2. **Pruebas localmente:**
   ```powershell
   cd vector-cuyo-frontend
   npm run dev
   ```
3. **Cuando estés listo para producción:**
   ```powershell
   # Volver a la raíz del proyecto
   cd ..
   
   # Desplegar
   .\deploy-to-hostinger.ps1
   ```
4. **Verificar en tu dominio**

---

## 📦 Archivos que se Despliegan

El script sube **SOLO** estos archivos de `dist/`:
- ✅ `index.html`
- ✅ `assets/*.js` (JavaScript optimizado)
- ✅ `assets/*.css` (CSS optimizado)
- ✅ `logo.png`
- ✅ `.htaccess` (para React Router)

**NO sube:**
- ❌ Código fuente (`src/`)
- ❌ `node_modules/`
- ❌ Archivos de configuración
- ❌ Otras carpetas del repositorio

---

## 🎉 ¡Listo!

Cada vez que quieras actualizar tu sitio, simplemente ejecuta:
```powershell
.\deploy-to-hostinger.ps1
```

Y en 1-2 minutos tu sitio estará actualizado. 🚀
