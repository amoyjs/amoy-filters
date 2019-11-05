import vertex from '../../default.vert';
import fragment from './mosaic.frag';
import {Filter} from '@pixi/core';

/**
 * The NTMosaicFilter applies a mosaic effect to an object.<br>
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/filter-mosaic}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} [tileSize=32] - The maximum size of the tilesize is 64
 */
class AmoyMosaicFilter extends Filter {

    constructor(tileSize = 32.0) {
        super(vertex, fragment);
        this.uniforms.dimensions = new Float32Array(2);
        this.tileSize = tileSize;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.uTileSize = this.tileSize <= 0 ? 32.0 : this.tileSize;
        this.uniforms.dimensions[0] = input.filterFrame.width;
        this.uniforms.dimensions[1] = input.filterFrame.height;
        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * mosaic tile size
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

export { AmoyMosaicFilter };
