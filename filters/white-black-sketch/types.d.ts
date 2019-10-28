/// <reference types="pixi.js" />
declare module "@amoy/filter-white-black-sketch" {
    export class AmoyWhiteBlackSketchFilter extends PIXI.Filter {
        constructor(invertColor?:boolean, delta?:number);
        invertColor:boolean;
        delta:number;
    }
}