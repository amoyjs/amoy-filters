import vertex from '../../default.vert';
import fragment from './warhol.frag';
import { Filter } from '@pixi/core';

/**
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/filter-Warhol}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 * @param {number} [posx=10.0] light  x position
 * @param {number} [posy=10.0] light  y position
 */

class AmoyWarholFilter extends Filter {
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

export { AmoyWarholFilter };
