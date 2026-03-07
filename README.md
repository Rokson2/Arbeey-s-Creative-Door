# Arbeey's Creative Door

A desktop application for generating AI images and videos using fal.ai's powerful models.

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
- **Desktop App**: Packaged as a native macOS application

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Desktop**: Tauri 2.x (Rust backend)
- **AI**: fal.ai API

## Development Setup

### Prerequisites

- Node.js 20+
- Rust (for Tauri)
- macOS (for desktop build)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/fal-creatives.git
cd fal-creatives

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

## Building the Desktop App

```bash
# Build Next.js standalone server and download Node.js runtime
./scripts/build-server.sh

# Build Tauri desktop app
npx tauri build
```

The built app will be in `src-tauri/target/release/bundle/`.

### Manual DMG Creation (macOS)

If Tauri's automated DMG creation fails:

```bash
cd src-tauri/target/release/bundle
mkdir -p dmg_temp
cp -r macos/Arbeey\'s\ Creative\ Door.app dmg_temp/
hdiutil create -volname "Arbeey's Creative Door" -srcfolder dmg_temp -ov -format UDZO "dmg/Arbeey's Creative Door.dmg"
```

## Project Structure

```
fal-creatives/
├── src/
│   ├── app/
│   │   ├── api/generate/route.ts   # API endpoint
│   │   └── page.tsx                # Main UI
│   ├── components/
│   │   └── queue/                  # Queue system components
│   └── lib/
│       ├── models.ts               # Model configurations
│       └── types.ts                # TypeScript types
├── src-tauri/
│   ├── src/lib.rs                  # Tauri backend
│   ├── tauri.conf.json             # Tauri config
│   └── server/                     # Bundled Next.js (built)
├── scripts/
│   └── build-server.sh             # Build script
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

## License

MIT

---

Built with ❤️ using fal.ai
