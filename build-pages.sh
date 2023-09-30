#!/usr/bin/env bash

# Delete old version
rm -rf ./pages

# Copy static files
mkdir -p ./pages
cp -R ./public/* ./pages/

mkdir -p ./pages/js/src
cp -R ./src/* ./pages/js/src/

mkdir -p ./pages/js/examples
for file in ./examples/*.asm; do cp "$file" "./pages/js/examples/$(basename "$file" .asm).js"; done