import vertex from '../../default.vert';
import fragment from './flame.frag';
import {Filter} from '@pixi/core';

/**
 * 
 *  * The AmoyFlameFilter applies the effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/AmoyFlameFilter.gif)
 *
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/filter-flame}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 * @param {number} [posx=10.0] flame center x position in pic
 * @param {number} [posy=10.0] flame center y position in pic 
 * @param {number} [delta=0] - For animating interlaced lines
 */

class AmoyFlameFilter extends Filter{
    constructor(posx = 10.0, posy = 10.0, strength = 2., delta = 0.0) {
        super(vertex, fragment);
        // sub class
        this.posx = posx;
        this.posy = posy;
        this.strength = strength;
        this.delta = delta;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.uPosx = this.posx <= 0 ? 10.0 : this.posx;
        this.uniforms.uPosy = this.posy <= 0 ? 10.0 : this.posy;
        this.uniforms.uStrength = this.strength;
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

export { AmoyFlameFilter };