/// <reference types="pixi.js" />
declare module "@amoy/filter-lens-halo" {
    export class AmoyLensHaloFilter extends PIXI.Filter {
        constructor(posx?:number, posy?:number, delta?:number,);
        posx:number;
        poxy:number;
        delta:number;
    }
}