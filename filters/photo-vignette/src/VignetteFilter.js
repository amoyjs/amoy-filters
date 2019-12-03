import vertex from '../../default.vert';
import fragment from './vignette.frag';
import { Filter } from '@pixi/core';

/**
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/filter-vignette}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 */

class AmoyVignetteFilter extends Filter {
    constructor(posx = 10.0, posy = 10.0) {
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

export { AmoyVignetteFilter };
