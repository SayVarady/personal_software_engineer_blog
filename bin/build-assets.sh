#!/usr/bin/env bash
# Compiles Tailwind CSS with the standalone CLI binary — no Node/npm required.
# Run this locally whenever Blade markup changes, then commit public/css/tailwind.css.
set -euo pipefail

cd "$(dirname "$0")/.."

BIN=".bin/tailwindcss"

if [ ! -x "$BIN" ]; then
    echo "Downloading Tailwind standalone CLI..."
    OS=$(uname -s)
    ARCH=$(uname -m)
    case "$OS-$ARCH" in
        Darwin-arm64) ASSET="tailwindcss-macos-arm64" ;;
        Darwin-x86_64) ASSET="tailwindcss-macos-x64" ;;
        Linux-x86_64) ASSET="tailwindcss-linux-x64" ;;
        Linux-aarch64) ASSET="tailwindcss-linux-arm64" ;;
        *) echo "Unsupported platform: $OS-$ARCH" >&2; exit 1 ;;
    esac
    mkdir -p .bin
    curl -sL -o "$BIN" "https://github.com/tailwindlabs/tailwindcss/releases/latest/download/${ASSET}"
    chmod +x "$BIN"
fi

"$BIN" -i resources/css/tailwind.css -o public/css/tailwind.css --minify --cwd .
echo "Built public/css/tailwind.css"
