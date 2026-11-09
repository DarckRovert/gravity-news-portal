@echo off
title Nexo Agora - Lanzador Total del Ecosistema
cd /d "%~dp0"

echo ===================================================================
echo          NEXO AGORA - LANZADOR TOTAL DEL ECOSISTEMA GRAVITY
echo          [Bridge Local :7860 + Portal Web Desacoplado :5173]
echo ===================================================================
echo.

set "BRIDGE_DIR=F:\Gravity_AI_bridge"

if exist "%BRIDGE_DIR%\gravity.bat" (
    echo [1/2] Iniciando Gravity AI Bridge Backend en http://localhost:7860 ...
    start "Gravity AI Bridge [Puerto 7860]" cmd /c "cd /d %BRIDGE_DIR% && gravity.bat --server"
) else (
    echo [AVISO] No se encontro F:\Gravity_AI_bridge\gravity.bat.
    echo El portal operara en modo Zero-Trust Offline.
)

echo [2/2] Iniciando Gravity News Portal...
timeout /t 2 >nul
call "%~dp0INICIAR_PORTAL.bat"
