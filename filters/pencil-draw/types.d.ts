/// <reference types="pixi.js" />
declare module "@amoy/filter-pencil-draw" {
    export class AmoyPencelDrawFilter extends PIXI.Filter {
        constructor(colorThreshold?:number);
        colorThreshold:number;
    }
}