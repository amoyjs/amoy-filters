/// <reference types="pixi.js" />
declare module "@amoy/filter-clear-background" {
    export class AmoyClearBackgroundFilter extends PIXI.Filter {
        constructor(color?:Object);
        color:object;
    }
}