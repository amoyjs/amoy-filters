import vertex from '../../default.vert';
import fragment from './vcr.frag';
import {Filter} from '@pixi/core';

/**
 * @class
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 */

class AmoyVcrFilter extends Filter{
    constructor(posx = 10.0, posy = 10.0, delta = 0.0) {
        super(vertex, fragment);
        // sub class
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

export { AmoyVcrFilter };