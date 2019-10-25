import vertex from '../../default.vert';
import fragment from './broken_cam_distortion.frag';
import {Filter} from '@pixi/core';
import { timingSafeEqual } from 'crypto';

/**
 * The CRTFilter applies a CRT effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/broken-cam-distortion.gif)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 *  @param {number} [delta=0] - For animating interlaced lines
 */

class AmoyBrokenCamDistortionFilter extends Filter{
    constructor(delta = 0){
        super(vertex, fragment);
        this.delta = delta;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.uTime = this.delta <= 0 ? 0 : this.delta;
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

    set delta(value) {
        this.uniforms.uTime = value;
    }
}

export { AmoyBrokenCamDistortionFilter };