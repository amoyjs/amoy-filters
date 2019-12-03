
import {Filter} from '@pixi/core';
import { settings } from '@pixi/settings';
/**
 * The NTFluidFilter applies a Fluid effect to an object.<br>
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/filter-fluid}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [strength=15] - the strength of blur
 */
class AmoyFluidFilter extends Filter {

    constructor(strength) {
        super();
        this._blurFilter = new PIXI.filters.BlurFilter(strength || 15);
        this._colFilter = new PIXI.filters.ColorMatrixFilter();

        //use this matrix to change alpha value
        this._colFilter.matrix = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 100, -12];
        this.resolution = settings.RESOLUTION;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        let renderTarget = filterManager.getFilterTexture();
        let renderTarget1 = filterManager.getFilterTexture();

        this._blurFilter.apply(filterManager, input, renderTarget, true);
        this._colFilter.apply(filterManager, renderTarget, renderTarget1, true);

        filterManager.applyFilter(this, renderTarget1, output, clear);

        filterManager.returnFilterTexture(renderTarget1);
        filterManager.returnFilterTexture(renderTarget);
    }

    /**
     * The resolution of the filter.
     *
     * @member {number}
     */
    get resolution() {
        return this._resolution;
    }

    set resolution(value) {
        this._resolution = value;

        if (this._colFilter) {
            this._colFilter.resolution = value;
        }
        if (this._blurFilter) {
            this._blurFilter.resolution = value;
        }
    }

}



export { AmoyFluidFilter };
