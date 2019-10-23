import testVert from '../../default.vert';
import testFrag from './pixelvibration.frag';
import {Filter} from '@pixi/core';

/**
 * @class
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 */

class AmoyPixelVibrationFilter extends Filter{
    constructor(intensity = 3.0, blursize = 2.0){
        super(testVert, testFrag);
        this.intensity = intensity;
        this.blursize = blursize;
        this.threshold = 0.5;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.uIntensity = this.intensity <= 0 ? 3.0 : this.intensity;
        this.uniforms.uBlursize = this.blursize <= 0 ? 2.0 : this.blursize;
        this.uniforms.uThreshold = this.threshold <= 0 ? 0.0 : this.threshold;
        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * intensity
     *
     * @member {number}
     * @default 3.0
     */
    get intensity() {
        return this.uniforms.uIntensity;
    }

    set intensity(value) {
        this.uniforms.uIntensity = Math.min(Math.max(2.0, value), 6.0);
    }

    /**
     * blursize
     *
     * @member {number}
     * @default 2.0
     */
    get blursize() {
        return this.uniforms.uBlursize;
    }

    set blursize(value) {
        this.uniforms.uBlursize = Math.min(Math.max(2.0, value), 6.0);
    }

    /**
     * threshold
     *
     * @member {number}
     * @default 2.0
     */
    get threshold() {
        return this.uniforms.uThreshold;
    }

    set threshold(value) {
        this.uniforms.uThreshold = Math.min(Math.max(0.0, value), 1.0);
    }
}

export { AmoyPixelVibrationFilter };