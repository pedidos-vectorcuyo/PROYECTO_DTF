# Script de Diagnóstico FTP - Hostinger
# Este script verifica la conexión y permisos FTP

$FTP_SERVER = "167.88.35.13"
$FTP_USERNAME = "u501128802"
$FTP_PASSWORD = "ftpVectorCuyo2026@"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Diagnóstico FTP - Hostinger" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Función para listar directorio FTP
function Get-FtpDirectoryListing {
    param (
        [string]$RemotePath
    )
    
    try {
        $ftpUri = "ftp://$FTP_SERVER$RemotePath"
        Write-Host "[TEST] Listando: $ftpUri" -ForegroundColor Yellow
        
        $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUri)
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectoryDetails
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($FTP_USERNAME, $FTP_PASSWORD)
        $ftpRequest.UsePassive = $true
        
        $response = $ftpRequest.GetResponse()
        $stream = $response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        
        $listing = $reader.ReadToEnd()
        $reader.Close()
        $response.Close()
        
        Write-Host "[OK] Conexión exitosa!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Contenido:" -ForegroundColor Cyan
        Write-Host $listing
        Write-Host ""
        
        return $true
    }
    catch {
        Write-Host "[ERROR] Falló la conexión" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        Write-Host ""
        return $false
    }
}

# Test 1: Listar raíz (/)
Write-Host "Test 1: Listando directorio raíz /" -ForegroundColor Yellow
Get-FtpDirectoryListing -RemotePath "/"

# Test 2: Listar /public_html
Write-Host "Test 2: Listando /public_html" -ForegroundColor Yellow
Get-FtpDirectoryListing -RemotePath "/public_html/"

# Test 3: Listar /public_html/React
Write-Host "Test 3: Listando /public_html/React" -ForegroundColor Yellow
Get-FtpDirectoryListing -RemotePath "/public_html/React/"

# Test 4: Intentar crear un archivo de prueba
Write-Host "Test 4: Intentando crear archivo de prueba" -ForegroundColor Yellow
try {
    $testContent = "Test file created at $(Get-Date)"
    $testFile = [System.Text.Encoding]::UTF8.GetBytes($testContent)
    
    $ftpUri = "ftp://$FTP_SERVER/public_html/React/test.txt"
    $ftpRequest = [System.Net.FtpWebRequest]::Create($ftpUri)
    $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
    $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($FTP_USERNAME, $FTP_PASSWORD)
    $ftpRequest.UseBinary = $true
    $ftpRequest.UsePassive = $true
    
    $ftpRequest.ContentLength = $testFile.Length
    $requestStream = $ftpRequest.GetRequestStream()
    $requestStream.Write($testFile, 0, $testFile.Length)
    $requestStream.Close()
    
    $response = $ftpRequest.GetResponse()
    $response.Close()
    
    Write-Host "[OK] Archivo de prueba creado exitosamente en /public_html/React/test.txt" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] No se pudo crear el archivo de prueba" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   Diagnóstico Completo" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

pause
