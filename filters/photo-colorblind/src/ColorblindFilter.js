import vertex from '../../default.vert';
import fragment from './colorblind.frag';
import { Filter } from '@pixi/core';


var AMOY_CLORBLINDE_TYPE_ENUM = {
    Protanopia:1,
    Protanomaly:2,
    Deuteranopia:3,
    Deuteranomaly:4,
    Tritanopia:5,
    Tritanomaly:6,
    Achromatopsia:7,
    Achromatomaly:8
}

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
        this.uniforms.uBlindType = value;
    }

    get blindType(){
        return this.uniforms.uBlindType;
    }

}

export { AmoyColorblindFilter, AMOY_CLORBLINDE_TYPE_ENUM };
