/// <reference types="pixi.js" />
declare module "@amoy/filter-weather-cloud" {
    export class AmoyWeatherCloudFilter extends PIXI.Filter {
        constructor(delta?:number);
        delta:number;
    }
}