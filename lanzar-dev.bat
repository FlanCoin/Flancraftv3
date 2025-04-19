@echo off
echo Iniciando servidor Vite...
start cmd /k "npm run dev -- --host"
echo Esperando a que Vite arranque...
timeout /t 5 > nul

echo Iniciando ngrok...
start /b ngrok http 5173 > nul

:: Esperamos a que ngrok exponga la URL pública
timeout /t 3 > nul

:: Extraemos la URL desde la API de ngrok y la copiamos con clip.exe
powershell -Command "Invoke-RestMethod http://127.0.0.1:4040/api/tunnels | Select-Object -ExpandProperty tunnels | Select-Object -First 1 -ExpandProperty public_url | clip"

echo ✅ ¡URL pública de Ngrok copiada al portapapeles!
pause
