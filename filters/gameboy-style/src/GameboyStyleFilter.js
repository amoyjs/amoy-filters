import vertex from '../../default.vert';
import fragment from './gameboystyle.frag';
import {Filter} from '@pixi/core';

/**
 * 
 *  * The AmoyGameboyStyleFilter applies the effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/AmoyGameboyStyleFilter.png)
 *
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/filter-gameboy-style}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 */

class AmoyGameboyStyleFilter extends Filter{
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

export { AmoyGameboyStyleFilter };