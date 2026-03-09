# Arbeey's Creative Door

A web application for generating AI images and videos using fal.ai's powerful models.

## Features

- **Multiple Generation Modes**
  - Text → Image: Generate images from text descriptions
  - Image → Image: Transform existing images with AI
  - Text → Video: Create videos from text prompts
  - Image → Video: Animate static images

- **Supported Models**
  - **Text-to-Image**: Nano Banana 2, SeeDream V4.5
  - **Image-to-Image**: Nano Banana Pro Edit, SeeDream V4.5/V5-Lite
  - **Text-to-Video**: Veo 3.1, Veo 3.1 Fast
  - **Image-to-Video**: Veo 3.1, Veo 3.1 Fast, Kling V2.5/V2.6-Pro/V3-Pro

- **Parallel Queue System**: Submit multiple generation requests that process concurrently
- **Session Spending Tracking**: Monitor costs with configurable limits
- **Reference Image Support**: Upload images or paste URLs
- **Gallery**: View, download, and reuse generated content

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **AI**: fal.ai API

## Quick Start

### Prerequisites

- Node.js 20+ ([Download here](https://nodejs.org/))

### Option 1: Double-Click Launcher (Easiest)

**macOS:**
1. Download this repository
2. Double-click `start-mac.command`
3. The app will open in your browser automatically

*Note: If macOS says you don't have permission, see the [Troubleshooting](#troubleshooting) section below.*

**Windows:**
1. Download this repository
2. Double-click `start-windows.bat`
3. The app will open in your browser automatically

### Option 2: Manual Setup

```bash
# Clone the repository
git clone https://github.com/Rokson2/Arbeey-s-Creative-Door.git
cd Arbeey-s-Creative-Door

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Add your fal.ai API key to .env.local

# Run development server
npm run dev
```

Open http://localhost:3000 in your browser.

### Getting a fal.ai API Key

1. Visit https://fal.ai/dashboard/keys
2. Create a new API key
3. Add it to `.env.local`:
   ```
   FAL_KEY=your_api_key_here
   ```
   
Or enter it directly in the app's Settings panel.

## Creating a Desktop Shortcut

**macOS:**
1. Right-click `start-mac.command` → Make Alias
2. Rename the alias to "Arbeey's Creative Door"
3. Drag the alias to your Desktop

**Windows:**
1. Right-click `start-windows.bat` → Create shortcut
2. Rename it to "Arbeey's Creative Door"
3. Drag the shortcut to your Desktop

## Project Structure

```
Arbeey-s-Creative-Door/
├── src/
│   ├── app/
│   │   ├── api/generate/route.ts   # API endpoint
│   │   └── page.tsx                # Main UI
│   ├── components/
│   │   └── queue/                  # Queue system components
│   └── lib/
│       ├── models.ts               # Model configurations
│       └── types.ts                # TypeScript types
├── start-mac.command               # Mac launcher
├── start-windows.bat               # Windows launcher
└── package.json
```

## Usage

1. Enter your fal.ai API key in Settings
2. Select a category (Text→Image, Image→Image, etc.)
3. Choose a model
4. Enter your prompt
5. (For image-based modes) Upload or paste a reference image
6. Click Generate
7. Submit multiple requests - they process in parallel!
8. Download results from the gallery

## Cost Tracking

- Each model has a per-generation cost displayed
- Session spending is tracked with warnings at 80%
- Generation is blocked when spending limit is reached
- Reset session to continue

## Troubleshooting

### macOS Permission Denied
If you see a message saying "The file couldn't be executed because you don't have the necessary permissions":

1. Open your Terminal.
2. Type `chmod +x ` (with a space at the end).
3. Drag the `start-mac.command` file into the terminal window.
4. Press **Enter**.

This happens because some browsers strip execution permissions when downloading files as a ZIP.

## License

MIT

---

Built with ❤️ using fal.ai
