import testVert from '../../default.vert';
import testFrag from './test.frag';
import {Filter} from '@pixi/core';

/**
 * @class
 * @extends PIXI.Filter
 * @memberof AMOY.filters
 */

class AmoyTestFilter extends Filter{
    constructor(){
        super(testVert, testFrag);
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        filterManager.applyFilter(this, input, output, clear);
    }

}

export { AmoyTestFilter };