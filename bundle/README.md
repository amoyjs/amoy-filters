
# Amoy Filters
[![Build Status](https://travis-ci.org/amoyjs/amoy-filters.svg?branch=master)](https://travis-ci.org/amoyjs/amoy-filters)

PixiJS v5 optional display filters.

Filters include:

* **AmoyRainfallFilter**  _@amoy/filter-rainfall_
* **AmoyMosaicFilter** _@amoy/filter-mosaic_
* **AmoyPixiVibrationFilter** _@amoy/filter-pixel-vibration_
* **AmoyLight2dFilter** _@amoy/filter-light2d_
* **AmoyLensHaloFilter** _@amoy/filter-lens-halo_
* **AmoyBrokenCamDistortionFilter** _@amoy/filter-broken-cam-distortion_
* **AmoyPageCurlFilter** _@amoy/filter-page-curl_
* **AmoySparksDriftingFilter** _@amoy/filter-sparks-drifting_
* **AmoyWhiteBlackSketchFilter** _@amoy/filter-white-black-sketch_
* **AmoyVcrFilter** _@amoy/filter-vcr_
* **AmoyFlameFilter** _@amoy/filter-flame_
* **AmoyGameboyStyleFilter** _@amoy/filter-gameboy-style_
* **AmoySnowFilter** _@amoy/filter-snow_
* **AmoyLightSweepFilter** _@amoy/filter-light-sweep_
* **AmoyReflectionFilter** _@amoy/filter-reflection_
* **AmoyWaterReflection** _@amoy/filter-water-reflection_
* **AmoyWeatherRainy** _@amoy/filter-weather-rainy_
* **AmoyWeatherCloud** _@amoy/filter-weather-cloud_
* **AmoyInnerOutlineFilter** _@amoy/filter-inner-outline_


## Demos
Click [here](https://amoyjs.github.io/amoy-filters/tools/demo/index.html) for filter demos.

## Real examples
Click [here](https://amoyjs.github.io/amoyjs-filters-examples/examples/index.html) to interactively play with filters to see how they work.


## Installation

Using NPM:

```bash
npm install @amoy/filters
```

Using Yarn:
```bash
yarn add @amoy/filters
```

## Usage

### Browser

```html
<script src="https://pixijs.download/release/pixi.min.js"></script>
<script src="/dist/amoy-filters.js"></script>
```
```js
var filter = new PIXI.filters.AmoyMosaicFilter();
```

### Bundler (Rollup, Webpack, etc)

Use ES6+ imports to import the specific filter. _Note: `PIXI` global is not accessible when building with bundlers._

```js
import { AmoyMosaicFilter } from 'amoy-filters';
const filter = new AmoyMosaicFilter();
```

## Documentation

API documention can be found [here](http://amoyjs.github.io/amoy-filters/docs/).
