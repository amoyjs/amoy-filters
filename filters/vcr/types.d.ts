/// <reference types="pixi.js" />
declare module "@amoy/filter-vcr" {
    export class AmoyVcrFilter extends PIXI.Filter {
        constructor(delta?:number);
        delta:number;
    }
}