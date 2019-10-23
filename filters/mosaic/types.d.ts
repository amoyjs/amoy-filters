/// <reference types="pixi.js" />
declare module "@pixi/filter-mosaic" {
    export class MosaicFilter extends PIXI.Filter {
        constructor(tileSize?:number);
        tileSize:number;
    }
}
