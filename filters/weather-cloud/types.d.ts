/// <reference types="pixi.js" />
declare module "@amoy/filter-cloud" {
    export class AmoyWeatherCloudFilter extends PIXI.Filter {
        constructor(delta?:number);
        delta:number;
    }
}