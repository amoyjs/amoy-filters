# amoy-filters

[![Build Status](https://travis-ci.org/amoyjs/amoy-filters.svg?branch=master)](https://travis-ci.org/amoyjs/amoy-filters)

Amoy-filters 是基于pixijs filter，类似pixi-filters库，提供丰富的常见的2D游戏效果。

## Demo
Click [here](https://amoyjs.github.io/amoy-filters/tools/demo/index.html) to interactively play with filters to see how they work.

## Doc API
Click [here](https://amoyjs.github.io/amoy-filters/docs/index.html) to see how to use it.

## Filters

| Filter | Preview |
|---|---|
| **AmoyPixelVibrationFilter**<br>_@amoy/filter-pixel-vibration_ | ![pixel-vibration](https://amoyjs.github.io/amoy-filters/tools/screenshots/dist/pixel-vibration.png?v=2) |
| **AmoyWiteBlackSketchFilter**<br>_@amoy/filter-white-black-sketch_ | ![white-black-sketch](https://amoyjs.github.io/amoy-filters/tools/screenshots/dist/white-black-sketch.png?v=2) |
| **AmoyFlameFilter**<br>_@amoy/filter-flame_ | ![flame](https://amoyjs.github.io/amoy-filters/tools/screenshots/dist/AmoyFlameFilter.gif?v=2) |
white-black-sketch.png?v=2) |
| **AmoyRainfallFilter**<br>_@amoy/filter-rainfall_ | ![rainfall](https://amoyjs.github.io/amoy-filters/tools/screenshots/dist/AmoyRainfallFilter.gif?v=2) |



All filters work with PixiJS v5.

## Building

Build all filters, demo and screenshots by running the following:

```bash
npm run build
```

Build single filter by running the following:

```bash
npm run build:prod -- --scope "@pixi/filter-flame"
```

Build multiple filters where scope is a glob expression:

```bash
npm run build:prod -- --scope "{@pixi/filter-light2d,@pixi/filter-mosaic}"
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
