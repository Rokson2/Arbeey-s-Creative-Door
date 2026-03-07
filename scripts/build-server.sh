#!/bin/bash
set -e

echo "Building Next.js standalone..."
npm run build

echo "Copying static files to standalone..."
cp -r .next/static .next/standalone/fal-creatives/.next/static
cp -r public .next/standalone/fal-creatives/public

echo "Setting up bundled server..."
rm -rf src-tauri/server
mkdir -p src-tauri/server
cp -r .next/standalone/fal-creatives/. src-tauri/server/

echo "Downloading Node.js runtime..."
NODE_VERSION="v20.11.0"
NODE_URL="https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-darwin-x64.tar.gz"
curl -fsSL "$NODE_URL" | tar -xzf - -C src-tauri/server/
mv src-tauri/server/node-${NODE_VERSION}-darwin-x64 src-tauri/server/node

echo "Creating server startup script..."
mkdir -p src-tauri/binaries
cat > src-tauri/binaries/server << 'STARTEOF'
#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SERVER_DIR="$SCRIPT_DIR/../server"
NODE_BIN="$SERVER_DIR/node/bin/node"

cd "$SERVER_DIR"
exec "$NODE_BIN" server.js
STARTEOF
chmod +x src-tauri/binaries/server

echo "Server bundle created successfully!"
