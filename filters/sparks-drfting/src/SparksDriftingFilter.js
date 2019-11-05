import vertex from '../../default.vert';
import fragment from './sparksdrifting.frag';
import {Filter} from '@pixi/core';

/**
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/spark-drfting}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 * @param {number} [height=0.0] spark height
 * @param {number} [widht=0.0] spark width
 * @param {number} [strength=0.0] strength
 * @param {number} [delta=0.0] time for shader animation
 */

class AmoySparksDriftingFilter extends Filter{
    constructor(height = 0.0, width = 0.0, strength = 2., delta = 0.0) {
        super(vertex, fragment);
        // sub class
        this.height = height;
        this.width = width;
        this.strength = strength;
        this.delta = delta;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.uWidth = this.width;
        this.uniforms.uHeight = this.height;
        this.uniforms.uStrength = this.strength;
        this.uniforms.uTime = this.delta;
        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * fire w
     */
    get width() {
        return this.uniforms.uWidth;
    }

    set width(value) {
        this.uniforms.uWidth = value;
    }

    /**
     * fire H
     */
    get height() {
        return this.uniforms.uHeight;
    }

    set height(value) {
        this.uniforms.uHeight = value;
    }

    /**
     * fire strength
     */
    get strength() {
        return this.uniforms.uStrength;
    }

    set strength(value) {
        this.uniforms.uStrength = value;
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

export { AmoySparksDriftingFilter };