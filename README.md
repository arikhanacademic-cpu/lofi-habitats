# Lofi Habitats

Who's awake right now, in eight corners of the world.

A pixel-art diorama of eight habitats: the Serengeti, the Amazon, the Great Barrier Reef, Monterey Canyon, Svalbard, Antarctica, the Sahara and London. Each scene follows the real local time, sun position, season and weather of that place, so you see which animals are awake, asleep, hibernating or away for the season right now.

**[Open the live site →](https://arikhanacademic-cpu.github.io/lofi-habitiats/)**

## Features

- **63 animals** with their own rhythms: day, night, dawn and dusk, bursts around the clock, the midday heat, or nightly deep-sea migration
- **World view**: all eight places side by side at the same moment
- **Seasons**: a date slider and year-lapse. Arctic terns leave for Antarctica, wildebeest follow the rains, hedgehogs and bats hibernate, the Amazon floods, the Serengeti turns green, foxes and ptarmigans change coats
- **Live events**: lions hunting at night, the howler monkeys' dawn chorus, a turtle at a cleaning station, coral spawning after the November full moon, emperor penguins huddling in winter, the northern lights
- **Live weather** from [Open-Meteo](https://open-meteo.com/): rain, snow, fog, storms and temperature, or set it by hand
- **Study mode**: fullscreen scene, lofi music and a 25/5 focus timer
- **Postcards**: save a PNG of the current scene to share
- Search any animal or place, shift the time, play a day-lapse

## How it's built

No libraries and no image files. Every creature and background is drawn in code: shapes are rasterised to pixels, shaded with hue-shifted colour ramps and ordered dithering, and given selective outlines. The sun position is calculated from each place's coordinates. The music is generated live with the Web Audio API.

```
src/engine.js     pixel engine: shading, dithering, outlines, patterns
src/sprites.js    creatures (original five habitats)
src/sprites2.js   creatures (London, Antarctica, Sahara, seasonal coats)
src/scenes.js     backgrounds (original five habitats)
src/scenes2.js    backgrounds (new habitats) and weather
src/app.js        animal data, rhythms, seasons, events, UI, audio
src/head.html     page markup and styles
```

Edit anything in `src/`, then run `bash build.sh` to rebuild `index.html`.

## Real animal sounds (optional)

By default the animal calls are synthesised. To use real recordings, add MP3 files to `sounds/` named after the animal's id, for example `sounds/lion.mp3` or `sounds/robin.mp3`. Any missing file falls back to the synthesised call. See `sounds/README.md`.

## Credits

Weather data by [Open-Meteo](https://open-meteo.com/) (CC BY 4.0).
