# amoy-filters
Amoy-filters 是基于pixijs，对pixi-filter的扩充。提供更丰富的滤镜2D游戏效果。目的是方便开发者快速的实现想要的游戏效果。

## Filters

All filters work with PixiJS v5.

## Building 构建

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