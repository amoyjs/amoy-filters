import vertex from '../../default.vert';
import fragment from './barreldistortion.frag';
import { Filter } from '@pixi/core';

/**
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/filter-barreldistortion}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 */

class AmoyBarrelDistortionFilter extends Filter {
    constructor(barrelPower=2.0) {
        super(vertex, fragment);
        this.barrelPower = barrelPower;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.uBarrelPower = this.barrelPower;
        filterManager.applyFilter(this, input, output, clear);
    }

        /**
     * filter area point x
     */
    get barrelPower() {
        return this.uniforms.uBarrelPower;
    }

    set barrelPower(value) {
        this.uniforms.uBarrelPower = value;
    }


}

export { AmoyBarrelDistortionFilter };
