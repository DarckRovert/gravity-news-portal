@echo off
title Nexo Agora - Gravity News Portal V16.2 PRO
cd /d "%~dp0"

echo ===================================================================
echo             NEXO AGORA - GRAVITY NEWS PORTAL V16.2 PRO
echo               Frontend Desacoplado Zero-Trust (Vite)
echo ===================================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado o no se encuentra en el PATH.
    echo Por favor instala Node.js ^(v18 o superior^) para continuar.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo [INFO] Primera ejecucion detectada. Instalando dependencias...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Fallo la instalacion de dependencias de npm.
        pause
        exit /b 1
    )
)

echo [OK] Iniciando servidor Vite en http://localhost:5173 ...
echo [OK] Abriendo navegador predeterminado...

start http://localhost:5173
npm run dev
