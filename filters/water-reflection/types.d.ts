/// <reference types="pixi.js" />
declare module "@amoy/filter-water-reflection" {
    export class AmoyWaterReflectionFilter extends PIXI.Filter {
        constructor(delta?:number,boundary?:number);
        delta:number;
        boundary:number;
    }
}