import vertex from '../../default.vert';
import fragment from './lightsweep.frag';
import {Filter} from '@pixi/core';

/**
 * The AmoyLightSweepFilter applies the effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/AmoyLightSweepFilter.gif)
 *
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/filter-light-sweep}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 * @param {number} [delta=0] time for shader animation
 */

class AmoyLightSweepFilter extends Filter{
    constructor(delta = 0.0) {
        super(vertex, fragment);
        this.delta = delta;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.uTime = this.delta <= 0 ? 2.0 : this.delta;
        filterManager.applyFilter(this, input, output, clear);
    }
    /**
     * time for animation
     *
     * @member {number}
     * @default 0.0
     */
    get delta() {
        return this.uniforms.uTime;
    }

    set delta(value) {
        this.uniforms.uTime = value;
    }
}

export { AmoyLightSweepFilter };