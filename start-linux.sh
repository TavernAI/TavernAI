#!/bin/bash

if ! [ -x "$(command -v node)" ] || ! [ -x "$(command -v npm)" ]; then
  echo 'Node.js or npm is not installed. Installing...'
  
  TEMP_DIR=$(mktemp -d)

  NODEJS_LATEST=$(curl -s https://nodejs.org/dist/latest/ | grep -Eo 'href=".*linux-x64.tar.xz"' | cut -d'"' -f2)
  curl -o "$TEMP_DIR/nodejs.tar.xz" "https://nodejs.org/dist/latest/$NODEJS_LATEST"

  sudo mkdir -p /usr/local/lib/nodejs
  sudo tar -xJvf "$TEMP_DIR/nodejs.tar.xz" -C /usr/local/lib/nodejs
  NODE_VERSION=$(ls /usr/local/lib/nodejs | grep -oE "v[0-9]+\.[0-9]+\.[0-9]+")
  echo "export PATH=/usr/local/lib/nodejs/$NODE_VERSION/bin:\$PATH" >> ~/.profile
  . ~/.profile

  rm -rf "$TEMP_DIR"
fi

npm i
node server.js
