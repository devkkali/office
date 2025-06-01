@echo off
REM Remove any existing backup
if exist .env.local.bak del .env.local.bak

REM Backup current .env.local if it exists
if exist .env.local (
    echo Backing up existing .env.local...
    copy /Y .env.local .env.local.bak >nul
)

REM Replace .env.local with .env.production for build
echo Preparing .env.local for production build...
copy /Y .env.production .env.local >nul

REM Execute the build process
echo Starting production build...
call npm run build

REM Restore original .env.local if backup exists
if exist .env.local.bak (
    echo Restoring original .env.local...
    move /Y .env.local.bak .env.local >nul
) else (
    echo No original .env.local found. Removing temporary .env.local...
    del .env.local
)

echo.
echo =================================
echo Build process completed.
echo /out directory is ready for deployment.
echo Press any key to exit.
echo =================================
pause
