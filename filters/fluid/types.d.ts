/// <reference types="pixi.js" />
declare module "@amoy/filter-fluid" {
    export class AmoyFluidFilter extends PIXI.Filter {
        constructor(strength?:number);
        strength:number;
    }
}
