# amoy-filters

[![Build Status](https://travis-ci.org/amoyjs/amoy-filters.svg?branch=master)](https://travis-ci.org/amoyjs/amoy-filters)

Amoy-filters are based on pixijs filter, similar to pixi-filters library, providing rich and common 2D game effects!

## Demo
Click [here](https://amoyjs.github.io/amoy-filters/tools/demo/index.html) to interactively play with filters to see how they work.

## special examples
Click [here](https://amoyjs.github.io/amoyjs-filters-examples/examples/index.html) to interactively play with filters to see how they work.


## Doc API
Click [here](https://amoyjs.github.io/amoy-filters/docs/index.html) to see how to use it.

## Filters

| Filter | Preview |
|---|---|
| **AmoyPixelVibrationFilter**<br>_@amoy/filter-pixel-vibration_ | ![pixel-vibration](https://amoyjs.github.io/amoy-filters/tools/screenshots/dist/pixel-vibration.png?v=2) |
| **AmoyWiteBlackSketchFilter**<br>_@amoy/filter-white-black-sketch_ | ![white-black-sketch](https://amoyjs.github.io/amoy-filters/tools/screenshots/dist/AmoyWhiteBlackSketchFilter.gif?v=2) |
| **AmoyFlameFilter**<br>_@amoy/filter-flame_ | ![flame](https://amoyjs.github.io/amoy-filters/tools/screenshots/dist/AmoyFlameFilter.gif?v=2) |
white-black-sketch.png?v=2) |
| **AmoyRainfallFilter**<br>_@amoy/filter-rainfall_ | ![rainfall](https://amoyjs.github.io/amoy-filters/tools/screenshots/dist/AmoyRainfallFilter.gif?v=2) |
| **AmoyBrokenCamDistortionFilter**<br>_@amoy/filter-broken-cam-distortion_ | ![rainfall](https://amoyjs.github.io/amoy-filters/tools/screenshots/dist/AmoyBrokenCamDistortionFilter.gif?v=2) |
| **AmoyGameboyStyleFilter**<br>_@amoy/filter-gameboy_ | ![rainfall](https://amoyjs.github.io/amoy-filters/tools/screenshots/dist/AmoyGameboyStyleFilter.png?v=2) |
| **AmoyInnerOutlineFilter**<br>_@amoy/filter-inner-outline_ | ![rainfall](https://amoyjs.github.io/amoy-filters/tools/screenshots/dist/AmoyInnerOutlineFilter.png?v=2) |
| **AmoyMosaicFilter**<br>_@amoy/filter-mosaic_ | ![rainfall](https://amoyjs.github.io/amoy-filters/tools/screenshots/dist/mosaic.png?v=2) |
| **AmoyLightSweepFilter**<br>_@amoy/filter-light-sweep_ | ![rainfall](https://amoyjs.github.io/amoy-filters/tools/screenshots/dist/AmoyLightSweepFilter.gif?v=2) |


All filters work with PixiJS v5.

## Building

Build all filters, demo and screenshots by running the following:

```bash
npm run build
```

Build single filter by running the following:

```bash
npm run build:prod -- --scope "@amoy/filter-flame"
```

Build multiple filters where scope is a glob expression:

```bash
npm run build:prod -- --scope "{@amoy/filter-light2d,@amoy/filter-mosaic}"
```

Watch all filters (auto-rebuild upon src changes):

```bash
npm run watch
```

Build all filters in dev-mode (un-minified):

```bash
npm run build:dev
```

Thanks [PIXI FILTERS](https://github.com/pixijs/pixi-filters) .
