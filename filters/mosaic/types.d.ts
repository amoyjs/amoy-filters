/// <reference types="pixi.js" />
declare module "@amoy/filter-mosaic" {
    export class MosaicFilter extends PIXI.Filter {
        constructor(tileSize?:number);
        tileSize:number;
    }
}
