# Solución al Problema de OneDrive

## Problema Identificado

Tu proyecto está en OneDrive y está causando que la aplicación se "congele" después de realizar una acción. Esto ocurre porque OneDrive bloquea los archivos de la carpeta `.next` mientras intenta sincronizarlos, generando errores `EPERM: operation not permitted`.

## ✅ Solución (Elige una opción)

### Opción 1: Excluir .next de OneDrive (Recomendado)

Abre PowerShell como **Administrador** y ejecuta estos comandos:

```powershell
# Navegar al proyecto
cd "C:\Users\hugoo\OneDrive\Documentos\Compas\Compas"

# Pausar OneDrive para esta carpeta
attrib +U ".next" /S /D

# Limpiar y reiniciar
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
npm run dev
```

### Opción 2: Configurar OneDrive para ignorar .next

1. Haz clic derecho en el ícono de OneDrive en la bandeja del sistema
2. Selecciona **Configuración**
3. Ve a la pestaña **Copia de seguridad** o **Sync and backup**
4. Haz clic en **Administrar copia de seguridad**
5. Busca la opción para excluir carpetas
6. Agrega `.next` a la lista de exclusiones

### Opción 3: Mover el proyecto fuera de OneDrive (Más simple)

```powershell
# Crear carpeta fuera de OneDrive
mkdir C:\Dev

# Mover el proyecto
Move-Item "C:\Users\hugoo\OneDrive\Documentos\Compas\Compas" "C:\Dev\Compas"

# Navegar e iniciar
cd C:\Dev\Compas
npm run dev
```

## Estado Actual

- ✅ Error de `proxy.ts` corregido
- ✅ Servidor funcionando en http://localhost:3000
- ⚠️ OneDrive bloqueando archivos `.next` (causa que la página se congele)

## Verificación

Después de aplicar cualquier solución, verifica que no haya errores `EPERM` en la consola del servidor.
