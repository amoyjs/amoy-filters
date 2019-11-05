import vertex from '../../default.vert';
import fragment from './rainfall.frag';
import {Filter} from '@pixi/core';

/**
 * The AmoyRainfallFilter applies the effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/AmoyRainfallFilter.gif)
 *
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/filter-rainfall}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 * @param {number} [rainR=2.0] rain numbers
 * @param {number} {delta=0} time for shader animation
 */

class AmoyRainfallFilter extends Filter{
    constructor(rainR = 2.0, delta = 0.0){
        super(vertex, fragment);
        this.rainR = rainR;
        this.delta = delta;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.uRainR = this.rainR <= 0 ? 2.0 : this.rainR;
        this.uniforms.uTime = this.delta <= 0 ? 2.0 : this.delta;

        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * rain radias size
     *
     * @member {number}
     * @default 2.0
     */
    get rainR() {
        return this.uniforms.uRainR;
    }

    set rainR(value) {
        this.uniforms.uRainR = value;
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

export { AmoyRainfallFilter };