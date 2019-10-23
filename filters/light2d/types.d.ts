/// <reference types="pixi.js" />
declare module "@amoy/filter-light2d" {
    export class AmoyLight2dFilter extends PIXI.Filter {
        constructor(posx?:number, posy?:number);
        posx:number;
        poxy:number;
    }
}