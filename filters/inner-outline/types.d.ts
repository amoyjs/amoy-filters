/// <reference types="pixi.js" />
declare module "@amoy/filter-inner-outline" {
    export class AmoyInnerOutlineFilter extends PIXI.Filter {
        constructor(color?:Object, delta?:number);
        delta:number;
        color:Object;
    }
}