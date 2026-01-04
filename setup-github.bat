@echo off
echo ========================================
echo GitHub Deployment Setup
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git tidak ditemukan!
    echo Silakan install Git terlebih dahulu dari: https://git-scm.com/
    pause
    exit /b 1
)

echo Git ditemukan. Melanjutkan setup...
echo.

REM Prompt untuk GitHub username dan repo name
set /p GITHUB_USERNAME="Masukkan GitHub username kamu: "
set /p REPO_NAME="Masukkan nama repository (default: poster-prompt-generator): "

REM Set default repo name jika kosong
if "%REPO_NAME%"=="" set REPO_NAME=poster-prompt-generator

echo.
echo ========================================
echo Setup Details:
echo Username: %GITHUB_USERNAME%
echo Repository: %REPO_NAME%
echo ========================================
echo.

set /p CONFIRM="Apakah informasi di atas sudah benar? (Y/N): "
if /i not "%CONFIRM%"=="Y" (
    echo Setup dibatalkan.
    pause
    exit /b 0
)

echo.
echo Initializing Git repository...
git init

echo.
echo Adding all files...
git add .

echo.
echo Creating initial commit...
git commit -m "Initial commit: Poster Prompt Generator"

echo.
echo Adding remote origin...
git remote add origin https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git

echo.
echo Setting main branch...
git branch -M main

echo.
echo ========================================
echo IMPORTANT: GitHub Login
echo ========================================
echo Kamu akan diminta login ke GitHub.
echo Gunakan Personal Access Token, BUKAN password!
echo.
echo Cara buat token:
echo 1. Buka: https://github.com/settings/tokens
echo 2. Click "Generate new token (classic)"
echo 3. Pilih scope: repo (full control)
echo 4. Copy token yang dihasilkan
echo.
pause

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo Setup Git Selesai!
echo ========================================
echo.
echo Next Steps:
echo 1. Buka: https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
echo 2. Go to Settings ^> Secrets and variables ^> Actions
echo 3. Add secret: VITE_GEMINI_API_KEY
echo 4. Go to Settings ^> Pages
echo 5. Set Source to "GitHub Actions"
echo.
echo Website kamu akan live di:
echo https://%GITHUB_USERNAME%.github.io/%REPO_NAME%/
echo.
echo Baca file github-deployment.md untuk panduan lengkap!
echo.
pause
