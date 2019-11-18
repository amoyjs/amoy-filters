import vertex from '../../default.vert';
import fragment from './magnify.frag';
import { Filter } from '@pixi/core';

/**
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/filter-magnify}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 * @param {number} [posx=10.0] light  x position
 * @param {number} [posy=10.0] light  y position
 * @param {number} [magnification=2.0] magnification
 * @param {number} [lensRadius=10.0] lensRadius
 */

class AmoyMagnifyFilter extends Filter {
    constructor(posx = 10.0, posy = 10.0, magnification=2.0, lensRadius=50.) {
        super(vertex, fragment);
        // sub class
        this.posx = posx;
        this.posy = posy;
        this.magnification = magnification;
        this.lensRadius = lensRadius;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.uMagnification =  this.magnification;
        this.uniforms.uLensRadius =  this.lensRadius;
        this.uniforms.uPosx = this.posx <= 0 ? 10.0 : this.posx;
        this.uniforms.uPosy = this.posy <= 0 ? 10.0 : this.posy;
        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * center x pos of lens circle
     */
    get posx() {
        return this.uniforms.uPosx;
    }

    set posx(value) {
        this.uniforms.uPosx = value;
    }

    /**
     * center y pos of lens circle
     */
    get posy() {
        return this.uniforms.uPosy;
    }

    set posy(value) {
        this.uniforms.uPosy = value;
    }

    get magnification() {
        return this.uniforms.uMagnification;
    }

    set magnification(value) {
        this.uniforms.uMagnification = value;
    }

    get lensRadius() {
        return this.uniforms.uLensRadius;
    }

    set lensRadius(value) {
        this.uniforms.uLensRadius = value;
    }
}

export { AmoyMagnifyFilter };
