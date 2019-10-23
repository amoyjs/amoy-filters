/// <reference types="pixi.js" />
declare module "@amoy/filter-flame" {
    export class AmoyLensHaloFilter extends PIXI.Filter {
        constructor(posx?:number, posy?:number,strength?:number, delta?:number,);
        posx:number;
        poxy:number;
        strength:number;
        delta:number;
    }
}