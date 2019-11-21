/// <reference types="pixi.js" />
declare module "@amoy/filter-barrel-distortion" {
    export class AmoyBarrelDistortionFilter extends PIXI.Filter {
        constructor(barrelPower?:number);
        barrelPower:number;
    }
}