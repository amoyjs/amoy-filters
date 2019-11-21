import vertex from '../../default.vert';
import fragment from './fisheye.frag';
import { Filter } from '@pixi/core';

/**
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/filter-fisheye}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 */

class AmoyFishEyeFilter extends Filter {
    constructor() {
        super(vertex, fragment);

    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        filterManager.applyFilter(this, input, output, clear);
    }

}

export { AmoyFishEyeFilter };
