@echo off
echo Buscando proceso en puerto 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo Deteniendo proceso %%a...
    taskkill /F /PID %%a 2>nul
)
timeout /t 2 /nobreak >nul

echo Limpiando directorio .next...
if exist .next rmdir /s /q .next
timeout /t 1 /nobreak >nul

echo Iniciando servidor de desarrollo...
npm run dev
