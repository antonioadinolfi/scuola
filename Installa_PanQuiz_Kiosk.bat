@echo off
setlocal EnableExtensions

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo Devi eseguire questo file come amministratore.
    echo Tasto destro ^> Esegui come amministratore
    echo.
    pause
    exit /b 1
)

set "INSTALL_DIR=C:\PanQuizKiosk"
set "PS1_FILE=%INSTALL_DIR%\PanQuiz_Kiosk_Launcher.ps1"

if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

> "%PS1_FILE%" (
echo param(
echo     [Parameter(Mandatory=$false, Position=0)]
echo     [string]$ProtocolUri
echo )
echo.
echo Add-Type -AssemblyName System.Web
echo Add-Type -AssemblyName System.Windows.Forms
echo.
echo function Show-ErrorMessage([string]$msg^) {
echo     [System.Windows.Forms.MessageBox]::Show(
echo         $msg,
echo         "PanQuiz Kiosk",
echo         [System.Windows.Forms.MessageBoxButtons]::OK,
echo         [System.Windows.Forms.MessageBoxIcon]::Error
echo     ^) ^| Out-Null
echo }
echo.
echo function Get-BrowserCommand {
echo     $edgeCandidates = @(
echo         "$Env:ProgramFiles(x86)\Microsoft\Edge\Application\msedge.exe",
echo         "$Env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
echo         "$Env:LocalAppData\Microsoft\Edge\Application\msedge.exe",
echo         "$Env:LocalAppData\Programs\Microsoft\Edge\Application\msedge.exe"
echo     ^)
echo.
echo     foreach ($p in $edgeCandidates^) {
echo         if ($p -and (Test-Path $p^)^) {
echo             return @{ FilePath = $p; Type = "edge" }
echo         }
echo     }
echo.
echo     try {
echo         $cmd = Get-Command msedge -ErrorAction SilentlyContinue
echo         if ($cmd -and $cmd.Source^) {
echo             return @{ FilePath = $cmd.Source; Type = "edge" }
echo         }
echo     } catch {}
echo.
echo     $chromeCandidates = @(
echo         "$Env:ProgramFiles\Google\Chrome\Application\chrome.exe",
echo         "$Env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe",
echo         "$Env:LocalAppData\Google\Chrome\Application\chrome.exe"
echo     ^)
echo.
echo     foreach ($p in $chromeCandidates^) {
echo         if ($p -and (Test-Path $p^)^) {
echo             return @{ FilePath = $p; Type = "chrome" }
echo         }
echo     }
echo.
echo     try {
echo         $cmd = Get-Command chrome -ErrorAction SilentlyContinue
echo         if ($cmd -and $cmd.Source^) {
echo             return @{ FilePath = $cmd.Source; Type = "chrome" }
echo         }
echo     } catch {}
echo.
echo     return $null
echo }
echo.
echo try {
echo     if ([string]::IsNullOrWhiteSpace($ProtocolUri^)^) {
echo         Show-ErrorMessage "Nessun parametro ricevuto dal protocollo panquizkiosk://"
echo         exit 1
echo     }
echo.
echo     $decodedInput = [System.Uri]::UnescapeDataString($ProtocolUri^)
echo.
echo     if ($decodedInput -notmatch '^panquizkiosk://'^) {
echo         Show-ErrorMessage "URI non valido: $decodedInput"
echo         exit 1
echo     }
echo.
echo     $uri = [System.Uri]$decodedInput
echo     $query = [System.Web.HttpUtility]::ParseQueryString($uri.Query^)
echo     $targetUrl = $query.Get("url"^)
echo.
echo     if ([string]::IsNullOrWhiteSpace($targetUrl^)^) {
echo         Show-ErrorMessage "Parametro 'url' mancante nel link kiosk."
echo         exit 1
echo     }
echo.
echo     if ($targetUrl -notmatch '^https://take\.panquiz\.com/'^) {
echo         Show-ErrorMessage "Per sicurezza sono ammessi solo link https://take.panquiz.com/"
echo         exit 1
echo     }
echo.
echo     $browser = Get-BrowserCommand
echo     if (-not $browser^) {
echo         Show-ErrorMessage "Nessun browser compatibile trovato. Installa Microsoft Edge oppure Google Chrome."
echo         exit 1
echo     }
echo.
echo     if ($browser.Type -eq "edge"^) {
echo         Start-Process -FilePath $browser.FilePath -ArgumentList "--kiosk `"${targetUrl}`" --edge-kiosk-type=fullscreen"
echo     }
echo     elseif ($browser.Type -eq "chrome"^) {
echo         Start-Process -FilePath $browser.FilePath -ArgumentList "--kiosk `"${targetUrl}`""
echo     }
echo.
echo     exit 0
echo }
echo catch {
echo     Show-ErrorMessage ("Errore durante l'avvio del kiosk:`n" + $_.Exception.Message^)
echo     exit 1
echo }
)

reg add "HKCR\panquizkiosk" /ve /d "URL:PanQuiz Kiosk Protocol" /f >nul
reg add "HKCR\panquizkiosk" /v "URL Protocol" /d "" /f >nul
reg add "HKCR\panquizkiosk\DefaultIcon" /ve /d "\"%SystemRoot%\System32\SHELL32.dll\",220" /f >nul
reg add "HKCR\panquizkiosk\shell" /f >nul
reg add "HKCR\panquizkiosk\shell\open" /f >nul
reg add "HKCR\panquizkiosk\shell\open\command" /ve /d "powershell.exe -NoProfile -ExecutionPolicy Bypass -File \"%PS1_FILE%\" \"%%1\"" /f >nul

echo.
echo Installazione completata.
echo Il protocollo panquizkiosk:// e' stato registrato correttamente.
echo Ora i pulsanti del sito possono avviare il test giusto in modalita' kiosk.
echo.
pause
exit /b 0
