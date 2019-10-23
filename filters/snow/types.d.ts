/// <reference types="pixi.js" />
declare module "@amoy/filter-snow" {
    export class AmoySnowFilter extends PIXI.Filter {
        constructor(blizard?:boolean, delta?:number,);
        blizard:boolean;
        delta:number;
    }
}