/// <reference types="pixi.js" />
declare module "@amoy/filter-manify" {
    export class AmoyMagnifyFilter extends PIXI.Filter {
        constructor(posx?:number, posy?:number, magnification?:number, lensRadius?:number);
        posx:number;
        poxy:number;
        magnification:number;
        lensRadius:number;
    }
}