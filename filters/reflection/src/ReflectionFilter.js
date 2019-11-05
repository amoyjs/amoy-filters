import vertex from '../../default.vert';
import fragment from './reflection.frag';
import {Filter} from '@pixi/core';

/**
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/filter-reflection}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 */

class AmoyReflectionFilter extends Filter{
    constructor() {
        super(vertex, fragment);
        // sub class
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        filterManager.applyFilter(this, input, output, clear);
    }

}

export { AmoyReflectionFilter };