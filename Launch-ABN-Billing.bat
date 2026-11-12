@echo off
title A.B.N. HERBALS - Invoice Billing Application
echo ===================================================
echo   A.B.N. HERBALS - BILLING APPLICATION
echo   Starting local server...
echo ===================================================

cd /d "%~dp0"

start http://localhost:3000
npm run dev
pause

