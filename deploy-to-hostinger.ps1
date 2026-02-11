# ============================================================
# Script de Despliegue a Hostinger - Vector Cuyo Frontend
# ============================================================
# Este script hace build de la aplicación React y la sube a Hostinger vía FTP

param(
    [switch]$SkipBuild = $false
)

# Configuración FTP
$FTP_SERVER = "167.88.35.13"
$FTP_USERNAME = "u501128802"
# IMPORTANTE: Cambia "TuContraseñaAquí" por tu contraseña FTP real
$FTP_PASSWORD = "ftpVectorCuyo2026@"
$REMOTE_DIR = "/public_html/React"

# Rutas locales
$PROJECT_ROOT = $PSScriptRoot
$FRONTEND_DIR = Join-Path $PROJECT_ROOT "vector-cuyo-frontend"
$DIST_DIR = Join-Path $FRONTEND_DIR "dist"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Despliegue a Hostinger - Vector Cuyo" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que la contraseña fue cambiada
if ($FTP_PASSWORD -eq "TuContraseñaAquí") {
    Write-Host "[ERROR] Debes configurar tu contraseña FTP en el script" -ForegroundColor Red
    Write-Host "   Edita el archivo y cambia 'TuContraseñaAquí' por tu contraseña real" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

# Función para subir archivo vía FTP
function Upload-FileToFtp {
    param (
        [string]$LocalPath,
        [string]$RemotePath
    )
    
    try {
        $ftpUri = "ftp://$FTP_SERVER$RemotePath"
        $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUri)
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($FTP_USERNAME, $FTP_PASSWORD)
        $ftpRequest.UseBinary = $true
        $ftpRequest.UsePassive = $true
        
        $fileContent = [System.IO.File]::ReadAllBytes($LocalPath)
        $ftpRequest.ContentLength = $fileContent.Length
        
        $requestStream = $ftpRequest.GetRequestStream()
        $requestStream.Write($fileContent, 0, $fileContent.Length)
        $requestStream.Close()
        
        $response = $ftpRequest.GetResponse()
        $response.Close()
        
        return $true
    }
    catch {
        Write-Host "   [X] Error subiendo: $RemotePath" -ForegroundColor Red
        Write-Host "      $_" -ForegroundColor Red
        return $false
    }
}

# Función para crear directorio FTP
function Create-FtpDirectory {
    param (
        [string]$RemotePath
    )
    
    try {
        $ftpUri = "ftp://$FTP_SERVER$RemotePath"
        $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUri)
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($FTP_USERNAME, $FTP_PASSWORD)
        $ftpRequest.UsePassive = $true
        
        $response = $ftpRequest.GetResponse()
        $response.Close()
    }
    catch {
        # Ignorar error si el directorio ya existe
    }
}

# Paso 1: Build (si no se salta)
if (-not $SkipBuild) {
    Write-Host "[BUILD] Paso 1: Construyendo aplicación..." -ForegroundColor Yellow
    Write-Host ""
    
    Push-Location $FRONTEND_DIR
    
    Write-Host "   Ejecutando: npm run build" -ForegroundColor Gray
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "[ERROR] Build falló" -ForegroundColor Red
        Pop-Location
        pause
        exit 1
    }
    
    Pop-Location
    Write-Host "   [OK] Build completado" -ForegroundColor Green
    Write-Host ""
}
else {
    Write-Host "[SKIP] Saltando build (usando dist/ existente)" -ForegroundColor Yellow
    Write-Host ""
}

# Verificar que dist existe
if (-not (Test-Path $DIST_DIR)) {
    Write-Host "[ERROR] No se encontró la carpeta dist/" -ForegroundColor Red
    Write-Host "   Ejecuta el script sin -SkipBuild primero" -ForegroundColor Yellow
    pause
    exit 1
}

# Paso 2: Subir archivos vía FTP
Write-Host "[DEPLOY] Paso 2: Desplegando a Hostinger vía FTP..." -ForegroundColor Yellow
Write-Host "   Servidor: $FTP_SERVER" -ForegroundColor Gray
Write-Host "   Usuario: $FTP_USERNAME" -ForegroundColor Gray
Write-Host "   Destino: $REMOTE_DIR" -ForegroundColor Gray
Write-Host ""

# Obtener todos los archivos de dist/
$files = Get-ChildItem -Path $DIST_DIR -File -Recurse
$totalFiles = $files.Count
$uploadedFiles = 0
$failedFiles = 0

Write-Host "   Archivos a subir: $totalFiles" -ForegroundColor Cyan
Write-Host ""

foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($DIST_DIR.Length).Replace('\', '/')
    $remotePath = "$REMOTE_DIR$relativePath"
    $remoteDir = Split-Path $remotePath -Parent
    
    # Crear directorio remoto si es necesario
    if ($remoteDir -ne $REMOTE_DIR) {
        Create-FtpDirectory -RemotePath $remoteDir
    }
    
    Write-Host "   [->] Subiendo: $relativePath" -ForegroundColor Gray
    
    if (Upload-FileToFtp -LocalPath $file.FullName -RemotePath $remotePath) {
        $uploadedFiles++
    }
    else {
        $failedFiles++
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Resumen del Despliegue" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   [OK] Archivos subidos: $uploadedFiles / $totalFiles" -ForegroundColor Green

if ($failedFiles -gt 0) {
    Write-Host "   [X] Archivos fallidos: $failedFiles" -ForegroundColor Red
    Write-Host ""
    Write-Host "[WARNING] Despliegue completado con errores" -ForegroundColor Yellow
}
else {
    Write-Host ""
    Write-Host "[SUCCESS] Despliegue completado exitosamente!" -ForegroundColor Green
}

Write-Host ""
Write-Host "[WEB] Tu sitio deberia estar disponible en:" -ForegroundColor Cyan
Write-Host "   https://tu-dominio.com" -ForegroundColor Gray
Write-Host ""
Write-Host "[INFO] Recarga tu navegador con Ctrl+Shift+R para ver los cambios" -ForegroundColor Yellow
Write-Host ""

pause
