import vertex from '../../default.vert';
import fragment from './clear-background.frag';
import { Filter } from '@pixi/core';

/**
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/filter-clear-background}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 * @param {number} [posx=10.0] light  x position
 * @param {number} [posy=10.0] light  y position
 */

class AmoyClearBackgroundFilter extends Filter {
    constructor(color={r:1.0, g:0, b:0}, offset=0.15) {
        super(vertex, fragment);
        // sub class
        this.uniforms.uColor  = new Float32Array(3);
        this.offset = offset;
        this._color = {r:color.r, g:color.g, b:color.b};
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.uColor[0] = this._color.r;
        this.uniforms.uColor[1] = this._color.g;
        this.uniforms.uColor[2] = this._color.b;
        this.uniforms.uOffset = this.offset;
        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     *  the color is need to be removed
     * @member {object}
     */
    get color(){
        return this._color;
    }

    set color(value) {
        this._color = value;
        this.uniforms.uColor[0] = value.r;
        this.uniforms.uColor[1] = value.g;
        this.uniforms.uColor[2] = value.b;
    }

    get offset(){
        return this.uniforms.uOffset;
    }

    set offset(value) {
        return this.uniforms.uOffset = value;
    }
}

export { AmoyClearBackgroundFilter };
