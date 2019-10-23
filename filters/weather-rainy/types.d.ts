/// <reference types="pixi.js" />
declare module "@amoy/filter-weather-rainy" {
    export class AmoyWeatherRainyFilter extends PIXI.Filter {
        constructor(delta?:number,);
        delta:number;
    }
}