import vertex from '../../default.vert';
import fragment from './light2d.frag';
import { Filter } from '@pixi/core';

/**
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/light2d}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 * @param {number} [posx=10.0] light  x position
 * @param {number} [posy=10.0] light  y position
 */

class AmoyLight2dFilter extends Filter {
    constructor(posx = 10.0, posy = 10.0) {
        super(vertex, fragment);
        // sub class
        this.posx = posx;
        this.posy = posy;

    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.uPosx = this.posx <= 0 ? 10.0 : this.posx;
        this.uniforms.uPosy = this.posy <= 0 ? 10.0 : this.posy;
        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * filter area point x
     */
    get posx() {
        return this.uniforms.uPosx;
    }

    set posx(value) {
        this.uniforms.uPosx = value;
    }

    /**
     * filter area point y
     */
    get posy() {
        return this.uniforms.uPosy;
    }

    set posy(value) {
        this.uniforms.uPosy = value;
    }
}

export { AmoyLight2dFilter };
