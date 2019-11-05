import vertex from '../../default.vert';
import fragment from './whiteblacksketch.frag';
import {Filter} from '@pixi/core';

/**
 * @class
 * @extends PIXI.Filter
 * @see {@link https://www.npmjs.com/package/@amoy/filter-white-black-sketch}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @memberof AMOY.filters
 * @param {boolean} [invertColor = false] invertcolor true or false
 * @param {number} [delta = 0] time for animation
 */

class AmoyWhiteBlackSketchFilter extends Filter{
    constructor(invertColor = false, delta = 0.0) {
        super(vertex, fragment);
        // sub class
        this._invertColor = invertColor;
        this.invertColor = invertColor;
        this.delta = delta;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.uInvertColor = this.invertColor ? 1 : 0;
        this.uniforms.uTime = this.delta;
        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * color invert boolean
     */
    get invertColor() {
        return this._invertColor;
    }

    set invertColor(value) {
        this._invertColor = value;
        this.uniforms.uInvertColor = value ? 1 : 0;
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

export { AmoyWhiteBlackSketchFilter };