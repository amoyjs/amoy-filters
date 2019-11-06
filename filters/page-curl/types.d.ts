/// <reference types="pixi.js" />
declare module "@amoy/filter-page-curl" {
    export class AmoyPageCurlFilter extends PIXI.Filter {
        constructor(posx?:number, posy?:number, startPosx?:number, startPosy?:number, nextPageTexture?:HTMLImageElement|HTMLCanvasElement|PIXI.BaseTexture|PIXI.Texture, radius?:number,flipMode?:Boolean);
        posx:number;
        poxy:number;
        startPosx:number;
        startPoxy:number;
        nextPageTexture:PIXI.Texture;
        radius:number;
        flipMode:Boolean;
    }
}