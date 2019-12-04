import vertex from '../../default.vert';
import fragment from './colorblind.frag';
import { Filter } from '@pixi/core';


let AMOY_CLORBLINDE_TYPE_ENUM = {
    Protanopia:1,
    Protanomaly:2,
    Deuteranopia:3,
    Deuteranomaly:4,
    Tritanopia:5,
    Tritanomaly:6,
    Achromatopsia:7,
    Achromatomaly:8
};

const Protanopia = [0.567,0.433,0,0,0, 0.558,0.442,0,0,0, 0,0.242,0.758,0,0, 0,0,0,1,0, 0,0,0,0,1];

const Protanomaly= [0.817,0.183,0,0,0, 0.333,0.667,0,0,0, 0,0.125,0.875,0,0, 0,0,0,1,0, 0,0,0,0,1];

const Deuteranopia= [0.625,0.375,0,0,0, 0.7,0.3,0,0,0, 0,0.3,0.7,0,0, 0,0,0,1,0, 0,0,0,0,1];

const Deuteranomaly = [0.8,0.2,0,0,0, 0.258,0.742,0,0,0, 0,0.142,0.858,0,0, 0,0,0,1,0, 0,0,0,0,1];

const Tritanopia = [0.95,0.05,0,0,0, 0,0.433,0.567,0,0, 0,0.475,0.525,0,0, 0,0,0,1,0, 0,0,0,0,1];

const Tritanomaly = [0.967,0.033,0,0,0, 0,0.733,0.267,0,0, 0,0.183,0.817,0,0, 0,0,0,1,0, 0,0,0,0,1];

const Achromatopsia = [0.299,0.587,0.114,0,0, 0.299,0.587,0.114,0,0, 0.299,0.587,0.114,0,0, 0,0,0,1,0, 0,0,0,0,1];

const Achromatomaly = [0.618,0.320,0.062,0,0, 0.163,0.775,0.062,0,0, 0.163,0.320,0.516,0,0,0,0,0,1,0,0,0,0,0];

/**
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/filter-Warhol}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 */

class AmoyColorblindFilter extends Filter {
    constructor() {
        super(vertex, fragment);
        // sub class
        this.blindType = AMOY_CLORBLINDE_TYPE_ENUM.Protanopia;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        filterManager.applyFilter(this, input, output, clear);
    }

    set blindType(value){
        this._blindType = value;
        switch(this._blindType)
        {
            case AMOY_CLORBLINDE_TYPE_ENUM.Protanopia:{
                this.uniforms.m = Protanopia;
                break;
            }
            case AMOY_CLORBLINDE_TYPE_ENUM.Protanomaly:{
                this.uniforms.m = Protanomaly;
                break;
            }
            case AMOY_CLORBLINDE_TYPE_ENUM.Tritanopia:{
                this.uniforms.m = Tritanopia;
                break;
            }
            case AMOY_CLORBLINDE_TYPE_ENUM.Tritanomaly:{
                this.uniforms.m = Tritanomaly;
                break;
            }
            case AMOY_CLORBLINDE_TYPE_ENUM.Deuteranopia:{
                this.uniforms.m = Deuteranopia;
                break;
            }
            case AMOY_CLORBLINDE_TYPE_ENUM.Deuteranomaly:{
                this.uniforms.m = Deuteranomaly;
                break;
            }
            case AMOY_CLORBLINDE_TYPE_ENUM.Achromatopsia:{
                this.uniforms.m = Achromatopsia;
                break;
            }
            case AMOY_CLORBLINDE_TYPE_ENUM.Achromatomaly:{
                this.uniforms.m = Achromatomaly;
                break;
            }
        }        
    }

    get blindType(){
        return this._blindType;
    }

}

export { AmoyColorblindFilter, AMOY_CLORBLINDE_TYPE_ENUM };
