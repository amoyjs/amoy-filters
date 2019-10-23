import vertex from '../../default.vert';
import fragment from './flame.frag';
import {Filter} from '@pixi/core';

/**
 * @class
 * @extends PIXI.Filter
 * @memberof AMOY.filters
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