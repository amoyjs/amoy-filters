/// <reference types="pixi.js" />
declare module "@amoy/filter-lens-halo" {
    export class AmoyPageCurlFilter extends PIXI.Filter {
        constructor(posx?:number, posy?:number, startPosx?:number, startPosy?:number, nextPageTexture?:HTMLImageElement|HTMLCanvasElement|PIXI.BaseTexture|PIXI.Texture);
        posx:number;
        poxy:number;
        startPosx:number;
        startPoxy:number;
        nextPageTexture:PIXI.Texture;
    }
}