import vertex from '../../default.vert';
import {Filter} from '@pixi/core';

/**
 * The NTFluidFilter applies a Fluid effect to an object.<br>
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/filter-fluid}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [tileSize=32] - The maximum size of the tilesize is 64
 */
class AmoyFluidFilter extends Filter {

    constructor(strength) {
        super(vertex);
        this.blurFilter = new PIXI.filters.BlurFilter(strength || 15);
        this.colFilter = new PIXI.filters.ColorMatrixFilter();
        this.colFilter.matrix = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 80, -12];

    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        const renderTarget = filterManager.getFilterTexture();

        this.blurFilter.apply(filterManager, input, renderTarget, true);
        this.colFilter.apply(filterManager, renderTarget, output, clear);

        filterManager.returnFilterTexture(renderTarget);
    }

    /**
     * Fluid tile size
     *
     * @member {number}
     * @default 32.0
     */
    get tileSize() {
        return this.uniforms.uTileSize;
    }

    set tileSize(value) {
        if (value < 0.0 || value > 64.0) {
            value = 32.0;
        }
        this.uniforms.uTileSize = value;
    }
}

export { AmoyFluidFilter };
