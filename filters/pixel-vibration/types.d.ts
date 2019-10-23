/// <reference types="pixi.js" />
declare module "@amoy/filter-pixel-vibration" {
    export class AmoyPixelVibrationFilter extends PIXI.Filter {
        constructor(intensity?:number, blursize?:number);
        intensity:number;
        blursize:number;
        threshold:number;
    }
}