# Quick Start - GitHub Deployment

## 🚀 Cara Paling Cepat Deploy ke GitHub

### Option 1: Menggunakan Script Otomatis (RECOMMENDED)

1. **Buat Repository di GitHub**:
   - Pergi ke https://github.com/new
   - Nama: `poster-prompt-generator` (atau nama lain)
   - Public repository
   - **JANGAN** centang "Initialize with README"
   - Click "Create repository"

2. **Buat Personal Access Token**:
   - Pergi ke https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Pilih scope: `repo` (full control)
   - Generate dan **copy token** (simpan di notepad sementara)

3. **Jalankan Script**:
   ```cmd
   cd C:\Users\ASUS ROG STRIX\.gemini\antigravity\scratch\poster-prompt-generator
   setup-github.bat
   ```
   
4. **Follow Prompts**:
   - Masukkan GitHub username
   - Masukkan nama repository
   - Saat diminta login, paste Personal Access Token (bukan password!)

5. **Setup GitHub Secrets**:
   - Pergi ke repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `VITE_GEMINI_API_KEY`
   - Value: Your Gemini API key
   - Click "Add secret"

6. **Enable GitHub Pages**:
   - Pergi ke Settings → Pages
   - Source: "GitHub Actions"

7. **DONE!** Website akan live di:
   ```
   https://YOUR_USERNAME.github.io/poster-prompt-generator/
   ```

---

### Option 2: Manual Commands

Jika prefer manual, jalankan command ini di Command Prompt:

```cmd
cd C:\Users\ASUS ROG STRIX\.gemini\antigravity\scratch\poster-prompt-generator

git init
git add .
git commit -m "Initial commit: Poster Prompt Generator"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Ganti `YOUR_USERNAME` dan `YOUR_REPO_NAME` dengan milik kamu.

---

## 📝 Important Notes

### ⚠️ Jangan Lupa!

1. **API Key sebagai Secret** - Jangan commit file `.env`!
2. **Personal Access Token** - Gunakan token, bukan password untuk Git push
3. **Base URL** - Jika nama repo bukan `poster-prompt-generator`, update `vite.config.ts`

### 🔑 Get Gemini API Key

https://makersuite.google.com/app/apikey

---

## 🔄 Update Website

Setiap kali mau update:

```cmd
git add .
git commit -m "Update: deskripsi perubahan"
git push
```

GitHub Actions akan auto-deploy!

---

## 📚 Full Documentation

Lihat `github-deployment.md` untuk panduan lengkap dengan troubleshooting.
