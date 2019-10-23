/// <reference types="pixi.js" />
declare module "@amoy/filter-lens-halo" {
    export class AmoySparksDriftingFilter extends PIXI.Filter {
        constructor(height?:number, width?:number, strength?:number, delta?:number);
        height:number;
        width:number;
        strength:number;
        delta:number;
    }
}