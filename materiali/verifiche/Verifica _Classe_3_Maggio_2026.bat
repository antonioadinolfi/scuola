@echo off
chcp 65001 >nul
title Verifica Python 3FSA

:: ============================================================
:: CONFIGURAZIONE: Inserisci qui l'URL della tua Web App
:: ============================================================
set "URL=https://script.google.com/macros/s/AKfycbwUexCuUaHU8ywDCUUDKE_cpJaih7FtSEo1BnM-aCoSvGRQeSFHXxEkETbQqulZNJnQ/exec"

:: Verifica che l'URL sia stato configurato
if "%URL%"=="https://script.google.com/macros/s/INSERISCI_URL_QUI/exec" (
    echo ============================================================
    echo   ERRORE: URL NON CONFIGURATO
    echo ============================================================
    echo.
    echo Devi modificare questo file e inserire l'URL della Web App.
    echo.
    echo Istruzioni:
    echo 1. Clicca con il tasto destro su questo file
    echo 2. Seleziona "Modifica" o "Edit"
    echo 3. Trova la riga: set "URL=..."
    echo 4. Sostituisci l'URL con quello della tua Web App
    echo 5. Salva e chiudi
    echo.
    pause
    exit /b 1
)

echo ============================================================
echo   VERIFICA PYTHON 3FSA - AVVIO IN CORSO
echo ============================================================
echo.
echo Attendere l'avvio della verifica...
echo.
timeout /t 2 /nobreak >nul

:: Kill any existing Chrome instances
taskkill /F /IM chrome.exe >nul 2>&1
timeout /t 1 /nobreak >nul

:: Launch Chrome in true kiosk mode
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" ^
    --kiosk ^
    --app="%URL%" ^
    --fullscreen ^
    --disable-pinch ^
    --overscroll-history-navigation=0 ^
    --disable-features=TranslateUI ^
    --no-first-run ^
    --no-default-browser-check ^
    --disable-infobars ^
    --disable-notifications ^
    --disable-save-password-bubble ^
    --incognito

if errorlevel 1 (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" ^
        --kiosk ^
        --app="%URL%" ^
        --fullscreen ^
        --disable-pinch ^
        --overscroll-history-navigation=0 ^
        --disable-features=TranslateUI ^
        --no-first-run ^
        --no-default-browser-check ^
        --disable-infobars ^
        --disable-notifications ^
        --disable-save-password-bubble ^
        --incognito
)

exit
