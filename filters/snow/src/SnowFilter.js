import vertex from '../../default.vert';
import fragment from './snow.frag';
import {Filter} from '@pixi/core';

/**
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/snow}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 * @param {Boolen} [blizard=false] snow mode true or false
 * @param {number} [delta=0] time for animation
 */

class AmoySnowFilter extends Filter{
    constructor(blizard = false, delta = 0.0) {
        super(vertex, fragment);
        // sub class
        this._blizard = blizard;
        this.blizard = this._blizard;
        this.delta = delta;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.uBlizard = this._blizard?1:0;
        this.uniforms.uTime = this.delta <= 0 ? 2.0 : this.delta;
        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     *  snow model
     */
    get blizard() {
        return this._blizard;
    }

    set blizard(value) {
        this._blizard = value;
        this.uniforms.uBlizard = value?1:0;
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

export { AmoySnowFilter };