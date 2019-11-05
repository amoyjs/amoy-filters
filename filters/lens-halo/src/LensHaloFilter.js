import vertex from '../../default.vert';
import fragment from './lenshalo.frag';
import {Filter} from '@pixi/core';

/**
 * The AmoyInnerOutlineFilter applies the effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/AmoyLensHaloFilter.gif)
 *
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/filter-lens-halo}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 */

class AmoyLensHaloFilter extends Filter{
    constructor(posx = 10.0, posy = 10.0, delta = 0.0) {
        super(vertex, fragment);
        // sub class
        this.posx = posx;
        this.posy = posy;
        this.delta = delta;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.uPosx = this.posx <= 0 ? 10.0 : this.posx;
        this.uniforms.uPosy = this.posy <= 0 ? 10.0 : this.posy;
        this.uniforms.uTime = this.delta <= 0 ? 2.0 : this.delta;
        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * current x
     */
    get posx() {
        return this.uniforms.uPosx;
    }

    set posx(value) {
        this.uniforms.uPosx = value;
    }

    /**
     * current y
     */
    get posy() {
        return this.uniforms.uPosy;
    }

    set posy(value) {
        this.uniforms.uPosy = value;
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

export { AmoyLensHaloFilter };