#!/bin/bash

# Arbeey's Creative Door - Mac Launcher
# Double-click this file to start the app

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    osascript -e 'display dialog "Node.js is not installed!\n\nPlease install Node.js from:\nhttps://nodejs.org/\n\nThen try again." buttons {"OK"} default button "OK" with icon stop with title "Arbeey'\''s Creative Door"'
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    osascript -e 'display dialog "npm is not installed!\n\nPlease install Node.js from:\nhttps://nodejs.org/\n\nThen try again." buttons {"OK"} default button "OK" with icon stop with title "Arbeey'\''s Creative Door"'
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    osascript -e 'display notification "Installing dependencies, please wait..." with title "Arbeey'\''s Creative Door"'
    npm install
fi

# Start the server and open browser
echo "Starting Arbeey's Creative Door..."
osascript -e 'display notification "Starting server..." with title "Arbeey'\''s Creative Door"'

# Open browser after a delay
sleep 3 && open "http://localhost:3000" &

# Start Next.js dev server
npm run dev
