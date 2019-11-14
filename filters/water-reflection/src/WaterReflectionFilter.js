import vertex from '../../default.vert';
import fragment from './waterreflection.frag';
import {Filter} from '@pixi/core';

/**
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/filter-weather-reflection}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 * @param {number} [delta = 0] time for animation
 */

class AmoyWaterReflectionFilter extends Filter{
    constructor(delta = 0.0, boundary = .5) {
        super(vertex, fragment);
        // sub class
        this.delta = delta;
        this.boundary = boundary;
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

    /**
     * Vertical position of the reflection point, default is 50% (middle)
     * smaller numbers produce a larger reflection, larger numbers produce a smaller reflection.
     *
     * @member {number}
     * @default 0.5
     */
    set boundary(value) {
        this.uniforms.boundary = value;
    }
    get boundary() {
        return this.uniforms.boundary;
    }

}

export { AmoyWaterReflectionFilter };