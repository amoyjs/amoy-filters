import vertex from '../../default.vert';
import fragment from './blood-splash.frag';
import { Filter } from '@pixi/core';

/**
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/filter-light2d}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 * @param {number} [posx=10.0] light  x position
 * @param {number} [posy=10.0] light  y position
 */

class AmoyBloodSplashFilter extends Filter {
    constructor(posx = 10.0, posy = 10.0, delta=0., color={r:1.0, g:0, b:0}) {
        super(vertex, fragment);
        // sub class
        this.posx = posx;
        this.posy = posy;
        this.delta = delta;
        this.uniforms.uColor  = new Float32Array(3);
        this._color = {r:color.r, g:color.g, b:color.b};

    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.uPosx = this.posx <= 0 ? 10.0 : this.posx;
        this.uniforms.uPosy = this.posy <= 0 ? 10.0 : this.posy;
        this.uniforms.uColor[0] = this._color.r;
        this.uniforms.uColor[1] = this._color.g;
        this.uniforms.uColor[2] = this._color.b;
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

    get color(){
        return this._color;
    }

    set color(value) {
        this._color = value;
        this.uniforms.uColor[0] = value.r;
        this.uniforms.uColor[1] = value.g;
        this.uniforms.uColor[2] = value.b;
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

export { AmoyBloodSplashFilter };
