#!/bin/sh
# Build the GitHub Pages copy in docs/. index.html is a fragment: head tags + <style>, then the page body.
# Wrap it into a full document with the head part inside <head>, and copy the assets next to it.
set -eu
cd "$(dirname "$0")"
[ "$(grep -c '^</style>$' index.html)" = 1 ] || { echo "build.sh: expected exactly one '</style>' line in index.html" >&2; exit 1; }
mkdir -p docs
{
  printf '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'
  awk '{ print } /^<\/style>$/ { exit }' index.html
  printf '</head>\n<body>\n'
  awk 'body { print } /^<\/style>$/ { body = 1 }' index.html
  printf '</body>\n</html>\n'
} > docs/index.html
cp rover.glb og.jpg favicon.svg favicon-32.png apple-touch-icon.png CNAME docs/
echo "docs/ built"
