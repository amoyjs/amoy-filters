import vertex from '../../default.vert';
import fragment from './pagecurl.frag';
import {Filter, Texture} from '@pixi/core';

/**
 * @class
 * @see {@link https://www.npmjs.com/package/@amoy/filter-page-curl}
 * @see {@link https://www.npmjs.com/package/@amoy/filters}
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 * @param {number} [posx=0.] drag moving x position
 * @param {number} [posy=0.] drag moving y position
 * @param {number} [startPosx=0.] drag start x position
 * @param {number} [startPosy=0.] drag start y position
 */

class AmoyPageCurlFilter extends Filter{
    constructor(posx = 0.0, posy = 0.0, startPosx = 0., startPosy = 0.0, nextPageTexture, radius=0.04) {
        super(vertex, fragment);
        // sub class
        this.posx = posx;
        this.posy = posy;

        this._size = 0;
        this._sliceSize = 0;
        this._slicePixelSize = 0;
        this._sliceInnerSize = 0;

        this._scaleMode = null;

        this.radius = radius;

        this.startPosx = startPosx;
        this.startPosy = startPosy;

        this.nextPageTexture = nextPageTexture;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.uPosx = this.posx <= 0 ? 0.0 : this.posx;
        this.uniforms.uPosy = this.posy <= 0 ? 0.0 : this.posy;
        this.uniforms.uRadius = this.radius;
        this.uniforms.uStartPosx = this.startPosx <= 0 ? 0.0 : this.startPosx;
        this.uniforms.uStartPosy = this.startPosy <= 0 ? 0.0 : this.startPosy;

        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * current pos x
     */
    get posx() {
        return this.uniforms.uPosx;
    }

    set posx(value) {
        this.uniforms.uPosx = value;
    }

    /**
     * current pos x
     */
    get radius() {
        return this.uniforms.uRadius;
    }

    set radius(value) {
        this.uniforms.uRadius = Math.max(Math.min(value, 0.04), 0.01);
    }


    /**
     * current pos y
     */
    get posy() {
        return this.uniforms.uPosy;
    }

    set posy(value) {
        this.uniforms.uPosy = value;
    }

    /**
     * start pos x
     */
    get startPosx() {
        return this.uniforms.uStartPosx;
    }

    set startPosx(value) {
        this.uniforms.uStartPosx = value;
    }

    /**
     * start pos y
     */
    get startPosy() {
        return this.uniforms.uStartPosy;
    }

    set startPosy(value) {
        this.uniforms.uStartPosy = value;
    }

    /**
     * the nextPageTexture texture
     * @member {PIXI.Texture}
     */
    get nextPageTexture() {
        return this._nextPageTexture;
    }
    set nextPageTexture(nextPageTexture) {
        if (!(nextPageTexture instanceof Texture)) {
            nextPageTexture = Texture.from(nextPageTexture);
        }
        if (nextPageTexture && nextPageTexture.baseTexture) {
            nextPageTexture.baseTexture.scaleMode = this._scaleMode;
            nextPageTexture.baseTexture.mipmap = false;

            this._size = nextPageTexture.height;
            this._sliceSize = 1 / this._size;
            this._slicePixelSize = this._sliceSize / this._size;
            this._sliceInnerSize = this._slicePixelSize * (this._size - 1);

            this.uniforms._size = this._size;
            this.uniforms._sliceSize = this._sliceSize;
            this.uniforms._slicePixelSize = this._slicePixelSize;
            this.uniforms._sliceInnerSize = this._sliceInnerSize;

            this.uniforms.nextPageTexture = nextPageTexture;
        }

        this._nextPageTexture = nextPageTexture;
    }

    /**
     * If the nextPageTexture is based on canvas , and the content of canvas has changed,
     *   then call `updateColorMap` for update texture.
     */
    updateNextPageTexture() {
        const texture = this._nextPageTexture;

        if (texture && texture.baseTexture) {
            texture._updateID++;
            texture.baseTexture.emit('update', texture.baseTexture);

            this.nextPageTexture = texture;
        }
    }

    /**
     * Destroys this filter
     *
     * @param {boolean} [destroyBase=false] Whether to destroy the base texture of nextPageTexture as well
     */
    destroy(destroyBase) {
        if (this._nextPageTexture) {
            this._nextPageTexture.destroy(destroyBase);
        }
        super.destroy();
    }
}

export { AmoyPageCurlFilter };