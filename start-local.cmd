@echo off
setlocal
cd /d "%~dp0"

echo Startar Dare Me lokalt pa http://localhost:8765/
where py >nul 2>nul
if %errorlevel%==0 (
    start "Dare Me lokalserver" /min py -m http.server 8765
) else (
    start "Dare Me lokalserver" /min python -m http.server 8765
)

timeout /t 1 /nobreak >nul
start "" "http://localhost:8765/"

endlocal
