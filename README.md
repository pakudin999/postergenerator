# Poster Prompt Generator

A beautiful AI-powered poster prompt generator with style analysis and person compositing features.

🌐 **Live Demo**: [Your GitHub Pages URL will be here]

## Features

- 🎨 Style reference analysis from any image
- 👥 Pro Mode: Composite people into poster scenes
- 🎭 Multi-person group compositing
- 🖱️ Drag & drop file uploads
- ✨ Beautiful modern dark theme design
- 📱 Fully responsive

## Tech Stack

- React 18 + TypeScript
- Vite
- Google Gemini AI
- Modern CSS with glassmorphism effects

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/poster-prompt-generator.git
cd poster-prompt-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file and add your Gemini API key:
```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. Run development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Deployment

This project is configured for GitHub Pages deployment. Pushes to the `main` branch will automatically trigger a deployment.

### Setup GitHub Pages:
1. Go to your repository Settings
2. Navigate to Pages
3. Set Source to "GitHub Actions"
4. Add your `VITE_GEMINI_API_KEY` as a repository secret

## Environment Variables

- `VITE_GEMINI_API_KEY` - Your Google Gemini API key (required)

## License

© 2026 @konten_beban

## Support

For issues or questions, please open an issue on GitHub.
