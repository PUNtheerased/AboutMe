@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo   Push AboutMe -^> GitHub
echo ========================================
echo.

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Not a git repo.
  pause
  exit /b 1
)

git status -sb
echo.

git add -A
git diff --cached --quiet
if %errorlevel%==0 (
  echo No changes to commit.
  echo.
  pause
  exit /b 0
)

set "MSG="
set /p "MSG=Commit message (Enter = auto): "
if "%MSG%"=="" (
  for /f "tokens=1-3 delims=/ " %%a in ("%date%") do set "D=%%a-%%b-%%c"
  set "MSG=Update site %D% %time:~0,8%"
)

echo.
echo Committing: %MSG%
git commit -m "%MSG%"
if errorlevel 1 (
  echo [ERROR] Commit failed.
  pause
  exit /b 1
)

echo.
echo Pushing to origin...
git push -u origin HEAD
if errorlevel 1 (
  echo [ERROR] Push failed. Check login / network.
  pause
  exit /b 1
)

echo.
echo Done. https://github.com/PUNtheerased/AboutMe
echo.
pause
