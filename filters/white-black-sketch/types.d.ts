/// <reference types="pixi.js" />
declare module "@amoy/filter-lens-halo" {
    export class AmoyLensHaloFilter extends PIXI.Filter {
        constructor(invertColor?:boolean, delta?:number);
        invertColor:boolean;
        delta:number;
    }
}