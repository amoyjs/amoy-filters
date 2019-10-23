/// <reference types="pixi.js" />
declare module "@amoy/filter-rainfall" {
    export class AmoyRainfallFilter extends PIXI.Filter {
        constructor(rainR?:number, delta?:number);
        rainR:number;
        delta:number;
    }
}