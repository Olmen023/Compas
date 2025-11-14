# Script para excluir .next de OneDrive
$nextPath = Join-Path $PSScriptRoot ".next"

# Método 1: Marcar como archivo del sistema (OneDrive suele ignorar estos)
if (Test-Path $nextPath) {
    Write-Host "Marcando .next como carpeta del sistema..."
    attrib +S +H "$nextPath" /S /D

    # Método 2: Establecer atributos para que OneDrive no lo sincronice
    Write-Host "Configurando atributos de exclusión..."
    $folder = Get-Item $nextPath -Force
    $folder.Attributes = $folder.Attributes -bor [System.IO.FileAttributes]::NotContentIndexed
    $folder.Attributes = $folder.Attributes -bor [System.IO.FileAttributes]::System

    Write-Host "Carpeta .next excluida de OneDrive exitosamente!"
} else {
    Write-Host "La carpeta .next no existe todavía."
}

Write-Host "`nAhora elimina la carpeta .next y reinicia el servidor:"
Write-Host "  Remove-Item -Path '.next' -Recurse -Force"
Write-Host "  npm run dev"
