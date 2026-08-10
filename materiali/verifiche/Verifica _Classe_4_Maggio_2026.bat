@echo off

REM Chiude Edge se aperto
taskkill /F /IM msedge.exe >nul 2>&1

REM Piccola attesa
timeout /t 2 >nul

REM Crea cartella profilo dedicata
if not exist "C:\KIOSK\EDGE_EXAM" mkdir "C:\KIOSK\EDGE_EXAM"

REM Avvia Edge kiosk
"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" ^
--user-data-dir="C:\KIOSK\EDGE_EXAM" ^
--kiosk "https://script.google.com/macros/s/AKfycbwQZnc1NspFZX6ww5N8GnhmJBQj4z480QlyGTVo-5lqXAcbytoYg9dcwX5iomBwIQeJWA/exec" ^
--edge-kiosk-type=fullscreen ^
--no-first-run ^
--disable-features=msEdgeSidebarV2 ^
--disable-session-crashed-bubble ^
--disable-translate ^
--disable-pinch ^
--overscroll-history-navigation=0 ^
--disable-sync ^
--disable-gpu

exit
