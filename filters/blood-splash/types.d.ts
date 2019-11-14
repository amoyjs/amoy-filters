/// <reference types="pixi.js" />
declare module "@amoy/filter-blood-splash" {
    export class AmoyBloodSplashFilter extends PIXI.Filter {
        constructor(posx?:number, posy?:number, delta?:number, color?:Object);
        posx:number;
        poxy:number;
        delta:number;
        color:object;
    }
}