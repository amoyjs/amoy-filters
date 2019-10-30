/// <reference types="pixi.js" />
declare module "@amoy/filter-sparks-drifting" {
    export class AmoySparksDriftingFilter extends PIXI.Filter {
        constructor(height?:number, width?:number, strength?:number, delta?:number);
        height:number;
        width:number;
        strength:number;
        delta:number;
    }
}