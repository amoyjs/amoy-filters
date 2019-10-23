/// <reference types="pixi.js" />
declare module "@amoy/filter-broken-cam-distortion" {
    export class AmoyBrokenCamDistortionFilter extends PIXI.Filter {
        constructor(delta?:number);
        delta:number;
    }
}