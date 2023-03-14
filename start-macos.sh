#!/bin/bash

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed."
    read -p "Do you want to install Node.js? [y/n]: " answer
    if [ "$answer" == "y" ]; then
        # Download and install Node.js
        echo "Downloading Node.js installer..."
        curl -sLO https://nodejs.org/dist/latest/node-$(curl -s https://nodejs.org/dist/latest/ | grep -o 'node-v.*.pkg' | head -1)
        echo "Installing Node.js..."
        sudo installer -pkg node-*.pkg -target /
        echo "Cleaning up..."
        rm node-*.pkg
        echo "Node.js installed."
    fi
fi

# Run npm install
npm i

# Start the server
node server.js
