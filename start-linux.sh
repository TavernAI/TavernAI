#!/bin/bash

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed."
    read -p "Do you want to install Node.js? [y/n]: " answer
    if [ "$answer" == "y" ]; then
        # Download and install Node.js
        echo "Downloading and installing Node.js..."
        tempdir=$(mktemp -d)
        curl -s https://nodejs.org/dist/latest/ | grep -o 'node-v.*-linux-x64.tar.xz' | head -1 | xargs -I {} curl -sLO https://nodejs.org/dist/latest/{}
        sudo mkdir -p /usr/local/lib/nodejs
        sudo tar -xJvf node-*-linux-x64.tar.xz -C /usr/local/lib/nodejs --strip-components=1
        version=$(ls /usr/local/lib/nodejs | grep -o 'node-v.*-linux-x64' | sed 's/node-v//')
        echo "export PATH=/usr/local/lib/nodejs/node-$version-linux-x64/bin:\$PATH" >> ~/.profile
        . ~/.profile
        rm -rf "$tempdir"
    fi
fi

# Run npm install
npm i

# Start the server
node server.js
