import vertex from '../../default.vert';
import fragment from './inneroutline.frag';
import {Filter} from '@pixi/core';

/**
 * @class
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 */

class InnerOutlineFilter extends Filter{
    constructor(color={r:1.0, g:0, b:0}, delta = 0.0) {
        super(vertex, fragment);
        this.uniforms.uColor  = new Float32Array(3);
        this._color = {r:color.r, g:color.g, b:color.b};
        this.delta = delta;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.uColor[0] = this._color.r;
        this.uniforms.uColor[1] = this._color.g;
        this.uniforms.uColor[2] = this._color.b;
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

    get color(){
        return this._color;
    }

    set color(value) {
        this._color = value;
        this.uniforms.uColor[0] = value.r;
        this.uniforms.uColor[1] = value.g;
        this.uniforms.uColor[2] = value.b;
    }

    set delta(value) {
        this.uniforms.uTime = value;
    }
}

export { InnerOutlineFilter };