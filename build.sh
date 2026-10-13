#!/usr/bin/env bash
# Rebuilds index.html from the files in src/. Run: bash build.sh
cd "$(dirname "$0")"
{
  echo '<!doctype html>'
  echo '<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
  echo '<meta name="description" content="Pixel-art habitats showing which animals are awake or asleep right now, synced to real local time, seasons and weather.">'
  echo '<style>[hidden]{display:none!important}body{margin:0}</style></head><body>'
  cat src/head.html
  echo '<script>'; echo '(() => {"use strict";'
  cat src/engine.js src/sprites.js src/sprites2.js src/scenes.js src/scenes2.js src/app.js
  echo '})();'; echo '</script>'
  echo '</body></html>'
} > index.html
echo "Built index.html"
