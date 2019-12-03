import vertex from '../../default.vert';
import fragment from './pencildraw.frag';
import { Filter } from '@pixi/core';

/**
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/filter-pencil-draw}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 */

class AmoyPencilDrawFilter extends Filter {
    constructor(colorThreshold=0.5) {
        super(vertex, fragment);
        // sub class
        this.colorThreshold = colorThreshold;

    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        filterManager.applyFilter(this, input, output, clear);
    }

    get colorThreshold(){
        return this.uniforms.uColorThreshold;
    }

    set colorThreshold(value){
        this.uniforms.uColorThreshold =value;
    }
}

export { AmoyPencilDrawFilter };
