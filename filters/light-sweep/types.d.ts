/// <reference types="pixi.js" />
declare module "@amoy/filter-light-sweep" {
    export class AmoyLightSweepFilter extends PIXI.Filter {
        constructor(delta?:number,);
        delta:number;
    }
}