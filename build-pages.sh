#!/usr/bin/env bash

# Delete old version
rm -rf ./pages

# Copy static files
mkdir -p ./pages
cp -R ./public/* ./pages/

mkdir -p ./pages/js/src
cp -R ./src/* ./pages/js/src/

mkdir -p ./pages/js/examples
cp -R ./examples/* ./pages/js/examples/

# add an example list file
for f in ./pages/js/examples/*.asm; do basename "$f"; done > ./pages/js/examples/examples.txt 