(function (core, pixi_js) {
  'use strict';

  /*!
   * @amoy/filter-rainfall - v3.0.25
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-rainfall is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment = "varying vec2 vTextureCoord;//passed from vect shader \nuniform sampler2D uSampler; // 2d texture\n\nuniform vec4 filterArea;\n//uniform vec2 dimensions;\n\nuniform float uTime;\nuniform float uRainR; // Radius of the rain\n\n// Maximum number of cells a ripple can cross.\n#define MAX_RADIUS 2\n\n// Set to 1 to hash twice. Slower, but less patterns.\n#define DOUBLE_HASH 0\n\n// Hash functions shamefully stolen from:\n// https://www.shadertoy.com/view/4djSRW\n#define HASHSCALE1 .1031\n#define HASHSCALE3 vec3(.1031, .1030, .0973)\n\nfloat hash12(vec2 p)\n{\n\tvec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);\n    p3 += dot(p3, p3.yzx + 19.19);\n    return fract((p3.x + p3.y) * p3.z);\n}\n\nvec2 hash22(vec2 p)\n{\n\tvec3 p3 = fract(vec3(p.xyx) * HASHSCALE3);\n    p3 += dot(p3, p3.yzx+19.19);\n    return fract((p3.xx+p3.yz)*p3.zy);\n\n}\n\nvec4 image()\n{\n\n\tvec2 uv1 = (vTextureCoord * filterArea.xy) / filterArea.y * uRainR;\n    \n    vec2 p0 = floor(uv1);\n\n    vec2 circles = vec2(0.);\n    for (int j = -MAX_RADIUS; j <= MAX_RADIUS; ++j)\n    {\n        for (int i = -MAX_RADIUS; i <= MAX_RADIUS; ++i)\n        {\n\t\t\tvec2 pi = p0 + vec2(i, j);\n            #if DOUBLE_HASH\n            vec2 hsh = hash22(pi);\n            #else\n            vec2 hsh = pi;\n            #endif\n            vec2 p = pi + hash22(hsh);\n\n            float t = fract(0.3*uTime + hash12(hsh));\n            vec2 v = p - uv1;\n            float d = length(v) - (float(MAX_RADIUS) + 1.)*t;\n\n            float h = 1e-3;\n            float d1 = d - h;\n            float d2 = d + h;\n            float p1 = sin(31.*d1) * smoothstep(-0.6, -0.3, d1) * smoothstep(0., -0.3, d1);\n            float p2 = sin(31.*d2) * smoothstep(-0.6, -0.3, d2) * smoothstep(0., -0.3, d2);\n            circles += 0.5 * normalize(v) * ((p2 - p1) / (2. * h) * (1. - t) * (1. - t));\n        }\n    }\n    int r = (MAX_RADIUS*2+1);\n    circles /= float(r*r);\n\n    float intensity = mix(0.01, 0.15, smoothstep(0.1, 0.6, abs(fract(0.05*uTime + 0.5)*2.-1.)));\n    vec3 n = vec3(circles, sqrt(1. - dot(circles, circles)));\n\n    vec3 color = texture2D(uSampler, vTextureCoord).rgb + 5.*pow(clamp(dot(n, normalize(vec3(1., 0.7, 0.5))), 0., 1.), 6.);\n\n\treturn vec4(color, 1.0);\n}\n\n\nvoid main(void)\n{\n    gl_FragColor = image();\n}";

  /**
   * The AmoyRainfallFilter applies the effect to an object.<br>
   * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/AmoyRainfallFilter.gif)
   *
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-rainfall}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   * @param {number} [rainR=2.0] rain numbers
   * @param {number} {delta=0} time for shader animation
   */

  var AmoyRainfallFilter = /*@__PURE__*/(function (Filter) {
      function AmoyRainfallFilter(rainR, delta){
          if ( rainR === void 0 ) { rainR = 2.0; }
          if ( delta === void 0 ) { delta = 0.0; }

          Filter.call(this, vertex, fragment);
          this.rainR = rainR;
          this.delta = delta;
      }

      if ( Filter ) { AmoyRainfallFilter.__proto__ = Filter; }
      AmoyRainfallFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyRainfallFilter.prototype.constructor = AmoyRainfallFilter;

      var prototypeAccessors = { rainR: { configurable: true },delta: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyRainfallFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          this.uniforms.uRainR = this.rainR <= 0 ? 2.0 : this.rainR;
          this.uniforms.uTime = this.delta <= 0 ? 2.0 : this.delta;

          filterManager.applyFilter(this, input, output, clear);
      };

      /**
       * rain radias size
       *
       * @member {number}
       * @default 2.0
       */
      prototypeAccessors.rainR.get = function () {
          return this.uniforms.uRainR;
      };

      prototypeAccessors.rainR.set = function (value) {
          this.uniforms.uRainR = value;
      };

      /**
       * time for animation
       *
       * @member {number}
       * @default 0.0
       */
      prototypeAccessors.delta.get = function () {
          return this.uniforms.uTime;
      };

      prototypeAccessors.delta.set = function (value) {
          this.uniforms.uTime = value;
      };

      Object.defineProperties( AmoyRainfallFilter.prototype, prototypeAccessors );

      return AmoyRainfallFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-mosaic - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-mosaic is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$1 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$1 = "varying vec2 vTextureCoord;//passed from vect shader\nuniform vec4 filterArea;\nuniform sampler2D uSampler;// 2d texture\nuniform float uTileSize;\n\nvoid main(void)\n{\n    \n    vec2 uv=vTextureCoord;\n    if(filterArea.y<filterArea.x){\n        uv.y*=filterArea.y/filterArea.x;\n    }else{\n        uv.x*=filterArea.x/filterArea.y;\n    }\n    \n    uv=uv*uTileSize;\n    \n    uv=floor(uv);\n    \n    uv=uv/uTileSize;\n    \n    vec4 tex=texture2D(uSampler,uv);\n    \n    gl_FragColor=tex;\n}\n";

  /**
   * The NTMosaicFilter applies a mosaic effect to an object.<br>
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-mosaic}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof PIXI.filters
   * @param {number} [tileSize=32] - The maximum size of the tilesize is 64
   */
  var AmoyMosaicFilter = /*@__PURE__*/(function (Filter) {
      function AmoyMosaicFilter(tileSize) {
          if ( tileSize === void 0 ) { tileSize = 32.0; }

          Filter.call(this, vertex$1, fragment$1);
          this.uniforms.dimensions = new Float32Array(2);
          this.tileSize = tileSize;
      }

      if ( Filter ) { AmoyMosaicFilter.__proto__ = Filter; }
      AmoyMosaicFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyMosaicFilter.prototype.constructor = AmoyMosaicFilter;

      var prototypeAccessors = { tileSize: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyMosaicFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          this.uniforms.uTileSize = this.tileSize <= 0 ? 32.0 : this.tileSize;
          this.uniforms.dimensions[0] = input.filterFrame.width;
          this.uniforms.dimensions[1] = input.filterFrame.height;
          filterManager.applyFilter(this, input, output, clear);
      };

      /**
       * mosaic tile size
       *
       * @member {number}
       * @default 32.0
       */
      prototypeAccessors.tileSize.get = function () {
          return this.uniforms.uTileSize;
      };

      prototypeAccessors.tileSize.set = function (value) {
          if (value < 0.0 || value > 64.0) {
              value = 32.0;
          }
          this.uniforms.uTileSize = value;
      };

      Object.defineProperties( AmoyMosaicFilter.prototype, prototypeAccessors );

      return AmoyMosaicFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-pixel-vibration - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-pixel-vibration is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var testVert = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var testFrag = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform vec4 filterArea;\n\nuniform sampler2D uSampler; // 2d texture\n\nuniform float uIntensity;\nuniform float uBlursize;\nuniform float uThreshold;\n\n#define T(t, c, u, v, m) texture2D(t, c + vec2(u, v), m)\n\nvec4 B(in vec2 C, in sampler2D X, in float m)\n{\n\tvec2 d = m / filterArea.xy;\n    \n    vec4  c = texture2D(X, C, m);\n    c += T(X, C,  d.x, 0.0, m);    \t\n    c += T(X, C, -d.x, 0.0, m);    \t\n    c += T(X, C, 0.0,  d.y, m);    \t\n    c += T(X, C, 0.0, -d.y, m);    \t\n    c += T(X, C,  d.x, d.y, m);    \t\n    c += T(X, C, -d.x, d.y, m);    \t\n    c += T(X, C,  d.x,-d.y, m);    \t\n    c += T(X, C, -d.x,-d.y, m);    \n    return c / 9.0;\n}\n\nint modi(int x, int y) {\n    return x - y * (x / y);\n}\n\nint and(int a, int b) {\n    int result = 0;\n    int n = 1;\n\tconst int BIT_COUNT = 32;\n\n    for(int i = 0; i < BIT_COUNT; i++) {\n        if ((modi(a, 2) == 1) && (modi(b, 2) == 1)) {\n            result += n;\n        }\n\n        a = a / 2;\n        b = b / 2;\n        n = n * 2;\n\n        if (!(a > 0 && b > 0))\n            break;\n    }\n    return result;\n}\n\nvec4 vibrance(vec4 inCol, float vibrance) //r,g,b 0.0 to 1.0,  vibrance 1.0 no change, 0.0 image B&W.\n{\n    vec4 outCol;\n    if (vibrance <= 1.0)\n    {\n        float avg = dot(inCol.rgb, vec3(0.3, 0.6, 0.1));\n        outCol.rgb = mix(vec3(avg), inCol.rgb, vibrance); \n    }\n    else // vibrance > 1.0\n    {\n        float hue_a, a, f, p1, p2, p3, i, h, s, v, amt, _max, _min, dlt;\n        float br1, br2, br3, br4, br5, br2_or_br1, br3_or_br1, br4_or_br1, br5_or_br1;\n        int use;\n\n        _min = min(min(inCol.r, inCol.g), inCol.b);\n        _max = max(max(inCol.r, inCol.g), inCol.b);\n        dlt = _max - _min + 0.00001 /*Hack to fix divide zero infinities*/;\n        h = 0.0;\n        v = _max;\n\n\t\tbr1 = step(_max, 0.0);\n        s = (dlt / _max) * (1.0 - br1);\n        h = -1.0 * br1;\n\n\t\tbr2 = 1.0 - step(_max - inCol.r, 0.0); \n        br2_or_br1 = max(br2, br1);\n        h = ((inCol.g - inCol.b) / dlt) * (1.0 - br2_or_br1) + (h*br2_or_br1);\n\n\t\tbr3 = 1.0 - step(_max - inCol.g, 0.0); \n        \n        br3_or_br1 = max(br3, br1);\n        h = (2.0 + (inCol.b - inCol.r) / dlt) * (1.0 - br3_or_br1) + (h*br3_or_br1);\n\n        br4 = 1.0 - br2*br3;\n        br4_or_br1 = max(br4, br1);\n        h = (4.0 + (inCol.r - inCol.g) / dlt) * (1.0 - br4_or_br1) + (h*br4_or_br1);\n\n        h = h*(1.0 - br1);\n\n        hue_a = abs(h); // between h of -1 and 1 are skin tones\n        a = dlt;      // Reducing enhancements on small rgb differences\n\n        // Reduce the enhancements on skin tones.    \n        a = step(1.0, hue_a) * a * (hue_a * 0.67 + 0.33) + step(hue_a, 1.0) * a;                                    \n        a *= (vibrance - 1.0);\n        s = (1.0 - a) * s + a * pow(s, 0.25);\n\n        i = floor(h);\n        f = h - i;\n\n        p1 = v * (1.0 - s);\n        p2 = v * (1.0 - (s * f));\n        p3 = v * (1.0 - (s * (1.0 - f)));\n\n        inCol.rgb = vec3(0.0); \n        i += 6.0;\n        //use = 1 << ((int)i % 6);\n        use = int(pow(2.0,mod(i,6.0)));\n        a = float(and(use , 1)); // i == 0;\n        use = use / 2;\n        inCol.rgb += a * vec3(v, p3, p1);\n\n        a = float(and(use , 1)); // i == 1;\n        use = use / 2;\n        inCol.rgb += a * vec3(p2, v, p1); \n\n        a = float( and(use,1)); // i == 2;\n        use = use / 2;\n        inCol.rgb += a * vec3(p1, v, p3);\n\n        a = float(and(use, 1)); // i == 3;\n        use = use / 2;\n        inCol.rgb += a * vec3(p1, p2, v);\n\n        a = float(and(use, 1)); // i == 4;\n        use = use / 2;\n        inCol.rgb += a * vec3(p3, p1, v);\n\n        a = float(and(use, 1)); // i == 5;\n        use = use / 2;\n        inCol.rgb += a * vec3(v, p1, p2);\n\n        outCol = inCol;\n    }\n    return outCol;\n}\n\nvec4 mainImage()\n{\n    float t = uThreshold, // threshold\n\t \t  I = uIntensity, // intensity\n          b = uBlursize; // blursize\n\n    vec4 c = texture2D(uSampler, vTextureCoord);//采样\n    vec4 H = clamp(B(vTextureCoord, uSampler, b) - t, 0.0, 1.0) * 1.0 / (1.0 - t); // highlight\n    vec4 imgC = 1.0 - (1.0 - c) * (1.0 - H * I); //Screen Blend Mode\n    \n    imgC = vibrance(imgC, 2.0);\n    return imgC;\n}\n\nvoid main(void)\n{ \n    gl_FragColor = mainImage();\n}";

  /**
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-pixel-vibration}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   * @param {number} [intensity = 3.0] blur strength
   * @param {number} [blursize = 2.0] blur size
   */

  var AmoyPixelVibrationFilter = /*@__PURE__*/(function (Filter) {
      function AmoyPixelVibrationFilter(intensity, blursize){
          if ( intensity === void 0 ) { intensity = 3.0; }
          if ( blursize === void 0 ) { blursize = 2.0; }

          Filter.call(this, testVert, testFrag);
          this.intensity = intensity;
          this.blursize = blursize;
          this.threshold = 0.5;
      }

      if ( Filter ) { AmoyPixelVibrationFilter.__proto__ = Filter; }
      AmoyPixelVibrationFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyPixelVibrationFilter.prototype.constructor = AmoyPixelVibrationFilter;

      var prototypeAccessors = { intensity: { configurable: true },blursize: { configurable: true },threshold: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyPixelVibrationFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          this.uniforms.uIntensity = this.intensity <= 0 ? 3.0 : this.intensity;
          this.uniforms.uBlursize = this.blursize <= 0 ? 2.0 : this.blursize;
          this.uniforms.uThreshold = this.threshold <= 0 ? 0.0 : this.threshold;
          filterManager.applyFilter(this, input, output, clear);
      };

      /**
       * intensity
       *
       * @member {number}
       * @default 3.0
       */
      prototypeAccessors.intensity.get = function () {
          return this.uniforms.uIntensity;
      };

      prototypeAccessors.intensity.set = function (value) {
          this.uniforms.uIntensity = Math.min(Math.max(2.0, value), 6.0);
      };

      /**
       * blursize
       *
       * @member {number}
       * @default 2.0
       */
      prototypeAccessors.blursize.get = function () {
          return this.uniforms.uBlursize;
      };

      prototypeAccessors.blursize.set = function (value) {
          this.uniforms.uBlursize = Math.min(Math.max(2.0, value), 6.0);
      };

      /**
       * threshold
       *
       * @member {number}
       * @default 2.0
       */
      prototypeAccessors.threshold.get = function () {
          return this.uniforms.uThreshold;
      };

      prototypeAccessors.threshold.set = function (value) {
          this.uniforms.uThreshold = Math.min(Math.max(0.0, value), 1.0);
      };

      Object.defineProperties( AmoyPixelVibrationFilter.prototype, prototypeAccessors );

      return AmoyPixelVibrationFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-light2d - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-light2d is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$2 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$2 = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;// 2d texture\n\nuniform float uPosx;\nuniform float uPosy;\n\nvoid main(void)\n{\nvec2 uv=vTextureCoord;\n\nvec3 col=texture2D(uSampler,uv).xyz;\n\nvec2 fragCoord=vTextureCoord*filterArea.xy;\n\nfloat lightY=0.1*filterArea.y;\n\nvec3 lightPos=vec3(uPosx,lightY,uPosy);\n\nvec3 lightDir=lightPos-vec3(fragCoord.x,0.,fragCoord.y);\n\nfloat diffuse=max(dot(normalize(lightDir),vec3(0.,1.,0.)),0.);\n\ngl_FragColor=vec4(col,1.)*diffuse;\n\n}";

  /**
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-light2d}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   * @param {number} [posx=10.0] light  x position
   * @param {number} [posy=10.0] light  y position
   */

  var AmoyLight2dFilter = /*@__PURE__*/(function (Filter) {
      function AmoyLight2dFilter(posx, posy) {
          if ( posx === void 0 ) { posx = 10.0; }
          if ( posy === void 0 ) { posy = 10.0; }

          Filter.call(this, vertex$2, fragment$2);
          // sub class
          this.posx = posx;
          this.posy = posy;

      }

      if ( Filter ) { AmoyLight2dFilter.__proto__ = Filter; }
      AmoyLight2dFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyLight2dFilter.prototype.constructor = AmoyLight2dFilter;

      var prototypeAccessors = { posx: { configurable: true },posy: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyLight2dFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          this.uniforms.uPosx = this.posx <= 0 ? 10.0 : this.posx;
          this.uniforms.uPosy = this.posy <= 0 ? 10.0 : this.posy;
          filterManager.applyFilter(this, input, output, clear);
      };

      /**
       * filter area point x
       */
      prototypeAccessors.posx.get = function () {
          return this.uniforms.uPosx;
      };

      prototypeAccessors.posx.set = function (value) {
          this.uniforms.uPosx = value;
      };

      /**
       * filter area point y
       */
      prototypeAccessors.posy.get = function () {
          return this.uniforms.uPosy;
      };

      prototypeAccessors.posy.set = function (value) {
          this.uniforms.uPosy = value;
      };

      Object.defineProperties( AmoyLight2dFilter.prototype, prototypeAccessors );

      return AmoyLight2dFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-lens-halo - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-lens-halo is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$3 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$3 = "varying vec2 vTextureCoord;//passed from vect shader\nuniform sampler2D uSampler;// 2d texture\nuniform vec4 filterArea;\n\nuniform float uPosx;\nuniform float uPosy;\nuniform float uTime;\n\nfloat noise(float t)\n{\n\treturn texture2D(uSampler,vec2(t,0.)/filterArea.xy).x;\n}\n\nfloat noise(vec2 t)\n{\n\treturn texture2D(uSampler,(t+vec2(uTime))/filterArea.xy).x;\n}\n\nvec3 lenshalo(vec2 uv,vec2 pos)\n{\n\tvec2 m=uv-pos;\n\tvec2 uvd=uv*(length(uv));\n\t\n\tfloat ang=atan(m.y,m.x);\n\tfloat dist=length(m);dist=pow(dist,.1);\n\tfloat n=noise(vec2((ang-uTime/9.)*16.,dist*32.));\n\t\n\tfloat f0=1./(length(uv-pos)*16.+1.);\n\t\n\tf0=f0+f0*(sin((ang+uTime/18.+noise(abs(ang)+n/2.)*2.)*12.)*.1+dist*.1+.8);\n\t\n\tfloat f2=max(1./(1.+32.*pow(length(uvd+.8*pos),2.)),.0)*.25;\n\tfloat f22=max(1./(1.+32.*pow(length(uvd+.85*pos),2.)),.0)*.23;\n\tfloat f23=max(1./(1.+32.*pow(length(uvd+.9*pos),2.)),.0)*.21;\n\t\n\tvec2 uvx=mix(uv,uvd,-.5);\n\t\n\tfloat f4=max(.01-pow(length(uvx+.4*pos),2.4),.0)*6.;\n\tfloat f42=max(.01-pow(length(uvx+.45*pos),2.4),.0)*5.;\n\tfloat f43=max(.01-pow(length(uvx+.5*pos),2.4),.0)*3.;\n\t\n\tuvx=mix(uv,uvd,-.4);\n\t\n\tfloat f5=max(.01-pow(length(uvx+.2*pos),5.5),.0)*2.;\n\tfloat f52=max(.01-pow(length(uvx+.4*pos),5.5),.0)*2.;\n\tfloat f53=max(.01-pow(length(uvx+.6*pos),5.5),.0)*2.;\n\t\n\tuvx=mix(uv,uvd,-.5);\n\t\n\tfloat f6=max(.01-pow(length(uvx-.3*pos),1.6),.0)*6.;\n\tfloat f62=max(.01-pow(length(uvx-.325*pos),1.6),.0)*3.;\n\tfloat f63=max(.01-pow(length(uvx-.35*pos),1.6),.0)*5.;\n\t\n\tvec3 c=vec3(.0);\n\t\n\tc.r+=f2+f4+f5+f6;c.g+=f22+f42+f52+f62;c.b+=f23+f43+f53+f63;\n\tc+=vec3(f0);\n\t\n\treturn c;\n}\n\nvec3 cc(vec3 color,float factor,float factor2)// color modifier\n{\n\tfloat w=color.x+color.y+color.z;\n\treturn mix(color,vec3(w)*factor,w*factor2);\n}\n\nvoid main(void)\n{\n\tvec2 uv=vTextureCoord.xy-.5;\n\t\n\tuv.x*=filterArea.x/filterArea.y;//fix aspect ratio\n\t\n\tvec3 mouse=vec3(vec2(uPosx,uPosy).xy/filterArea.xy-.5,0.);\n\t\n\tmouse.x*=filterArea.x/filterArea.y;//fix aspect ratio\n\t\n\tvec3 color=vec3(1.4,1.2,1.)*lenshalo(uv,mouse.xy);\n\t\n\tcolor=cc(color,.5,.1);\n\t\n\tgl_FragColor=vec4(color,1.)+texture2D(uSampler,vTextureCoord);\n}";

  /**
   * The AmoyInnerOutlineFilter applies the effect to an object.<br>
   * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/AmoyLensHaloFilter.gif)
   *
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-lens-halo}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   */

  var AmoyLensHaloFilter = /*@__PURE__*/(function (Filter) {
      function AmoyLensHaloFilter(posx, posy, delta) {
          if ( posx === void 0 ) { posx = 10.0; }
          if ( posy === void 0 ) { posy = 10.0; }
          if ( delta === void 0 ) { delta = 0.0; }

          Filter.call(this, vertex$3, fragment$3);
          // sub class
          this.posx = posx;
          this.posy = posy;
          this.delta = delta;
      }

      if ( Filter ) { AmoyLensHaloFilter.__proto__ = Filter; }
      AmoyLensHaloFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyLensHaloFilter.prototype.constructor = AmoyLensHaloFilter;

      var prototypeAccessors = { posx: { configurable: true },posy: { configurable: true },delta: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyLensHaloFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          this.uniforms.uPosx = this.posx <= 0 ? 10.0 : this.posx;
          this.uniforms.uPosy = this.posy <= 0 ? 10.0 : this.posy;
          this.uniforms.uTime = this.delta <= 0 ? 2.0 : this.delta;
          filterManager.applyFilter(this, input, output, clear);
      };

      /**
       * current x
       */
      prototypeAccessors.posx.get = function () {
          return this.uniforms.uPosx;
      };

      prototypeAccessors.posx.set = function (value) {
          this.uniforms.uPosx = value;
      };

      /**
       * current y
       */
      prototypeAccessors.posy.get = function () {
          return this.uniforms.uPosy;
      };

      prototypeAccessors.posy.set = function (value) {
          this.uniforms.uPosy = value;
      };

      /**
       * time for animation
       *
       * @member {number}
       * @default 0.0
       */
      prototypeAccessors.delta.get = function () {
          return this.uniforms.uTime;
      };

      prototypeAccessors.delta.set = function (value) {
          this.uniforms.uTime = value;
      };

      Object.defineProperties( AmoyLensHaloFilter.prototype, prototypeAccessors );

      return AmoyLensHaloFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-broken-cam-distortion - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-broken-cam-distortion is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$4 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$4 = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform sampler2D uSampler; // 2d texture\nuniform float uTime;\n\nfloat rand(float co) {\n    return fract(sin(dot(co,12.9898+78.233)) * 43758.5453);\n}\n\nvoid main(void) {\n\tvec2 uv = vTextureCoord;\n\tvec2 uv1 = uv;\n    uv1.y-=rand(uv.x*uTime)/60.;\n    \n    vec4 e = texture2D(uSampler,uv1);\n    vec4 bn = vec4(vec3(e.r+e.g+e.b)/3.,1.0);\n\t\n\tvec2 offset = vec2(0.01*rand(uTime),sin(uTime)/30.);\n\te.r = texture2D(uSampler, uv+offset.xy).r;\n\te.g = texture2D(uSampler, uv).g;\n\te.b = texture2D(uSampler, uv+offset.yx).b;\n\n    if(sin(uTime*rand(uTime))<0.99) {\n        gl_FragColor=mix(e,bn,0.6);\n    } else {\n        uv.y+=rand(uTime)/(sin(uTime)*10.);\n        uv.x-=rand(uTime+2.)/(sin(uTime)*10.)/30.;\n        gl_FragColor=texture2D(uSampler,uv);\n    }\n}";

  /**
   * The AmoyBrokenCamDistortionFilter applies the effect to an object.<br>
   * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/AmoyBrokenCamDistortionFilter.gif)
   *
   * @class
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   * @see {@link https://www.npmjs.com/package/@amoy/filter-broken-cam-distortion}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @param {number} [delta=0] - For animating interlaced lines
   */

  var AmoyBrokenCamDistortionFilter = /*@__PURE__*/(function (Filter) {
      function AmoyBrokenCamDistortionFilter(delta){
          if ( delta === void 0 ) { delta = 0; }

          Filter.call(this, vertex$4, fragment$4);
          this.delta = delta;
      }

      if ( Filter ) { AmoyBrokenCamDistortionFilter.__proto__ = Filter; }
      AmoyBrokenCamDistortionFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyBrokenCamDistortionFilter.prototype.constructor = AmoyBrokenCamDistortionFilter;

      var prototypeAccessors = { delta: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyBrokenCamDistortionFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          this.uniforms.uTime = this.delta <= 0 ? 0 : this.delta;
          filterManager.applyFilter(this, input, output, clear);
      };

      /**
       * time for animation
       *
       * @member {number}
       * @default 0.0
       */
      prototypeAccessors.delta.get = function () {
          return this.uniforms.uTime;
      };

      prototypeAccessors.delta.set = function (value) {
          this.uniforms.uTime = value;
      };

      Object.defineProperties( AmoyBrokenCamDistortionFilter.prototype, prototypeAccessors );

      return AmoyBrokenCamDistortionFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-page-curl - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-page-curl is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$5 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$5 = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform sampler2D uSampler;// 2d texture\nuniform sampler2D nextPageTexture;// 2d texture\n\nuniform vec4 filterArea;\n\nuniform float uPosx;\nuniform float uPosy;\nuniform float uStartPosx;\nuniform float uStartPosy;\nuniform float uRadius;//翻卷半径\nuniform int uFlipmode;//反向翻转模式 0 or 1\n\n\n#define pi 3.14159265359\n//#define uRadius .04\n\n#define iResolution filterArea\n#define iTime uTime\n#define fragColor gl_FragColor\n#define texture texture2D\n\nvoid main(void)\n{\n\tfloat aspect=iResolution.x/iResolution.y;\n\tfloat radius = uRadius;\n\n\tvec2 uv=vTextureCoord*filterArea.xy*vec2(aspect,1.)/iResolution.xy;\n\tvec2 maxuv = filterArea.xy*vec2(aspect,1.)/iResolution.xy;\n\tif(uFlipmode > 0){\n\t\tuv.x = maxuv.x - uv.x;\n\t}else{\n\t\tvec2 maxuv = vec2(1.0);\n\t}\n\t\n\tvec4 virtualMouse=vec4(uPosx,uPosy,uStartPosx,uStartPosy);\n\tvec2 mouse=virtualMouse.xy*vec2(aspect,1.)/iResolution.xy;\n\tvec2 mouseDir=normalize(abs(virtualMouse.zw)-virtualMouse.xy);\n\tvec2 origin=clamp(mouse-mouseDir*mouse.x/mouseDir.x,0.,1.);\n\t\n\tfloat mouseDist=clamp(length(mouse-origin)+(aspect-(abs(virtualMouse.z)/iResolution.x)*aspect)/mouseDir.x,0.,aspect/mouseDir.x);\n\t\n\tif(mouseDir.x<0.)\n\t{\n\t\tmouseDist=distance(mouse,origin);\n\t}\n\t\n\tfloat proj=dot(uv-origin,mouseDir);\n\tfloat dist=proj-mouseDist;\n\t\n\tvec2 linePoint=uv-dist*mouseDir;\n\t\n\tif(dist>radius)\n\t{\n\t\t//下一页面\n\t\tif(uFlipmode > 0){\n\t\t\tuv.x = maxuv.x- uv.x;\n\t\t}\n\t\tfragColor=texture(nextPageTexture,uv*vec2(1./aspect,1.));\n\t\tfragColor.rgb*= clamp(min(.99, .5 + 1. - radius/.04), 1.0, pow(clamp((dist-radius)*14.0,0.,1.),max(.05,5.*radius)));\n\t}\n\telse if(dist>=0.)\n\t{\n\t\t// 圆柱面点映射\n\t\tfloat theta=asin(dist/radius);\n\t\tvec2 p2=linePoint+mouseDir*(pi-theta)*radius;\n\t\tvec2 p1=linePoint+mouseDir*theta*radius;\n\t\tif(p2.x<=aspect&&p2.y<=1.&&p2.x>0.&&p2.y>0.){\n\t\t\tuv = p2;\n\t\t\t//背面页 圆柱面\n\t\t\tif(uFlipmode > 0){\n\t\t\t\tuv = (maxuv- uv*vec2(1./aspect,1.));\n\t\t\t\tuv.y = maxuv.y- uv.y;\n\t\t\t\tuv.x = maxuv.x- uv.x;\n\t\t\t}else{\n\t\t\t\tuv = (1.0- uv*vec2(1./aspect,1.));\n\t\t\t\tuv.y = 1.0- uv.y;\n\t\t\t}\n\t\t\tfragColor = texture(nextPageTexture, uv);\n\t\t\tfragColor.rgb*=clamp(min(.99, .6 + 1. - uRadius/.04), 1.0, pow(clamp((radius-dist)/radius,0.,1.), max(.05,5.*radius)));\n\t\t\tfragColor.a = 1.;\n\t\t}else{\n\t\t\t//corer 圆角\n\t\t\tuv = p1;\n\t\t\tif(uFlipmode > 0){\n\t\t\t\tuv.x = maxuv.x- uv.x;\n\t\t\t}\n\t\t\tfragColor = texture(uSampler, uv * vec2(1. / aspect, 1.));\n\t\t\tfragColor.rgb*=clamp(.94, 1.0, pow(clamp((radius-dist)/radius,0.,1.),max(.05,5.*radius)));\n\t\t}\n\t}\n\telse\n\t{\n\t\tvec2 p=linePoint+mouseDir*(abs(dist)+pi*radius);\n\t\tif(p.x<=aspect&&p.y<=1.&&p.x>0.&&p.y>0.&&length(mouseDir)>0.){\n\t\t\tuv = p ;\n\t\t\t// 背面页平面区域\n\t\t\tif(uFlipmode > 0){\n\t\t\t\tuv = (maxuv - uv*vec2(1./aspect,1.));\n\t\t\t\tuv.y = maxuv.y - uv.y;\n\t\t\t\tuv.x = maxuv.x- uv.x;\n\t\t\t}else{\n\t\t\t\tuv = (1.0 - uv*vec2(1./aspect,1.));\n\t\t\t\tuv.y = 1.0 - uv.y;\n\t\t\t}\n\t\t\tfragColor=texture(nextPageTexture,uv);\n\t\t\tfragColor.a = 1.;\n\t\t}else{\n\t\t\t// 正面页面\n\t\t\tif(uFlipmode > 0){\n\t\t\t\tuv.x = maxuv.x- uv.x;\n\t\t\t}\n\t\t\tfragColor=texture(uSampler,uv*vec2(1./aspect,1.));\n\t\t}\n\t\t\n\t}\n}";

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

  var AmoyPageCurlFilter = /*@__PURE__*/(function (Filter) {
      function AmoyPageCurlFilter(posx, posy, startPosx, startPosy, nextPageTexture, radius, flipMode) {
          if ( posx === void 0 ) { posx = 0.0; }
          if ( posy === void 0 ) { posy = 0.0; }
          if ( startPosx === void 0 ) { startPosx = 0.; }
          if ( startPosy === void 0 ) { startPosy = 0.0; }
          if ( radius === void 0 ) { radius=0.04; }
          if ( flipMode === void 0 ) { flipMode=false; }

          Filter.call(this, vertex$5, fragment$5);
          // sub class
          this.posx = posx;
          this.posy = posy;

          this._size = 0;
          this._sliceSize = 0;
          this._slicePixelSize = 0;
          this._sliceInnerSize = 0;
          this._flipMode = flipMode;

          this._scaleMode = null;

          this.radius = radius;

          this.startPosx = startPosx;
          this.startPosy = startPosy;

          this.nextPageTexture = nextPageTexture;
      }

      if ( Filter ) { AmoyPageCurlFilter.__proto__ = Filter; }
      AmoyPageCurlFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyPageCurlFilter.prototype.constructor = AmoyPageCurlFilter;

      var prototypeAccessors = { flipMode: { configurable: true },posx: { configurable: true },radius: { configurable: true },posy: { configurable: true },startPosx: { configurable: true },startPosy: { configurable: true },nextPageTexture: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyPageCurlFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          this.uniforms.uPosx = this.posx <= 0 ? 0.0 : this.posx;
          this.uniforms.uPosy = this.posy <= 0 ? 0.0 : this.posy;
          this.uniforms.uRadius = this.radius;
          this.uniforms.uFlipmode = this._flipMode ? 1:0;
          this.uniforms.uStartPosx = this.startPosx <= 0 ? 0.0 : this.startPosx;
          this.uniforms.uStartPosy = this.startPosy <= 0 ? 0.0 : this.startPosy;

          filterManager.applyFilter(this, input, output, clear);
      };

      /**
       * current pos x
       */
      prototypeAccessors.flipMode.get = function () {
          return this.uFlipmode.uFlipMode;
      };

      prototypeAccessors.flipMode.set = function (value) {
          this._flipMode = value;
          this.uniforms.uFlipmode = this._flipMode ? 1:0;
      };

      /**
       * current pos x
       */
      prototypeAccessors.posx.get = function () {
          return this.uniforms.uPosx;
      };

      prototypeAccessors.posx.set = function (value) {
          this.uniforms.uPosx = value;
      };

      /**
       * current pos x
       */
      prototypeAccessors.radius.get = function () {
          return this.uniforms.uRadius;
      };

      prototypeAccessors.radius.set = function (value) {
          this.uniforms.uRadius = Math.max(Math.min(value, 0.04), 0.000001);
      };


      /**
       * current pos y
       */
      prototypeAccessors.posy.get = function () {
          return this.uniforms.uPosy;
      };

      prototypeAccessors.posy.set = function (value) {
          this.uniforms.uPosy = value;
      };

      /**
       * start pos x
       */
      prototypeAccessors.startPosx.get = function () {
          return this.uniforms.uStartPosx;
      };

      prototypeAccessors.startPosx.set = function (value) {
          this.uniforms.uStartPosx = value;
      };

      /**
       * start pos y
       */
      prototypeAccessors.startPosy.get = function () {
          return this.uniforms.uStartPosy;
      };

      prototypeAccessors.startPosy.set = function (value) {
          this.uniforms.uStartPosy = value;
      };

      /**
       * the nextPageTexture texture
       * @member {PIXI.Texture}
       */
      prototypeAccessors.nextPageTexture.get = function () {
          return this._nextPageTexture;
      };
      prototypeAccessors.nextPageTexture.set = function (nextPageTexture) {
          if (!(nextPageTexture instanceof core.Texture)) {
              nextPageTexture = core.Texture.from(nextPageTexture);
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
      };

      /**
       * If the nextPageTexture is based on canvas , and the content of canvas has changed,
       *   then call `updateColorMap` for update texture.
       */
      AmoyPageCurlFilter.prototype.updateNextPageTexture = function updateNextPageTexture () {
          var texture = this._nextPageTexture;

          if (texture && texture.baseTexture) {
              texture._updateID++;
              texture.baseTexture.emit('update', texture.baseTexture);

              this.nextPageTexture = texture;
          }
      };

      /**
       * Destroys this filter
       *
       * @param {boolean} [destroyBase=false] Whether to destroy the base texture of nextPageTexture as well
       */
      AmoyPageCurlFilter.prototype.destroy = function destroy (destroyBase) {
          if (this._nextPageTexture) {
              this._nextPageTexture.destroy(destroyBase);
          }
          Filter.prototype.destroy.call(this);
      };

      Object.defineProperties( AmoyPageCurlFilter.prototype, prototypeAccessors );

      return AmoyPageCurlFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-sparks-drifting - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-sparks-drifting is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$6 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$6 = "\nvarying vec2 vTextureCoord;//passed from vect shader \n\nuniform sampler2D uSampler;// 2d texture\nuniform vec4 filterArea;\n\nuniform float uHeight;\nuniform float uWidth;\nuniform float uStrength;\nuniform float uTime;\n\n#define iResolution filterArea\n#define iTime uTime\n#define texture texture2D\n\n//模拟汽油燃烧\n// Description : Array and textureless GLSL 2D/3D/4D simplex \n//\t\t\t\t\t\t\t noise functions.\n//\t\t\tAuthor : Ian McEwan, Ashima Arts.\n//\tMaintainer : ijm\n//\t\t Lastmod : 20110822 (ijm)\n//\t\t License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//\t\t\t\t\t\t\t Distributed under the MIT License. See LICENSE file.\n//\t\t\t\t\t\t\t https://github.com/ashima/webgl-noise\n// \n\nvec3 mod289(vec3 x){\n\treturn x-floor(x*(1./289.))*289.;\n}\n\nvec4 mod289(vec4 x){\n\treturn x-floor(x*(1./289.))*289.;\n}\n\nvec4 permute(vec4 x){\n\treturn mod289(((x*34.)+1.)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n\treturn 1.79284291400159-.85373472095314*r;\n}\n\nfloat snoise(vec3 v)\n{\n\tconst vec2 C=vec2(1./6.,1./3.);\n\tconst vec4 D=vec4(0.,.5,1.,2.);\n\t\n\t// First corner\n\tvec3 i=floor(v+dot(v,C.yyy));\n\tvec3 x0=v-i+dot(i,C.xxx);\n\t\n\t// Other corners\n\tvec3 g=step(x0.yzx,x0.xyz);\n\tvec3 l=1.-g;\n\tvec3 i1=min(g.xyz,l.zxy);\n\tvec3 i2=max(g.xyz,l.zxy);\n\t\n\t//\t x0 = x0 - 0.0 + 0.0 * C.xxx;\n\t//\t x1 = x0 - i1\t+ 1.0 * C.xxx;\n\t//\t x2 = x0 - i2\t+ 2.0 * C.xxx;\n\t//\t x3 = x0 - 1.0 + 3.0 * C.xxx;\n\tvec3 x1=x0-i1+C.xxx;\n\tvec3 x2=x0-i2+C.yyy;// 2.0*C.x = 1/3 = C.y\n\tvec3 x3=x0-D.yyy;// -1.0+3.0*C.x = -0.5 = -D.y\n\t\n\t// Permutations\n\ti=mod289(i);\n\tvec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));\n\t\n\t// Gradients: 7x7 points over a square, mapped onto an octahedron.\n\t// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n\tfloat n_=.142857142857;// 1.0/7.0\n\tvec3 ns=n_*D.wyz-D.xzx;\n\t\n\tvec4 j=p-49.*floor(p*ns.z*ns.z);//\tmod(p,7*7)\n\t\n\tvec4 x_=floor(j*ns.z);\n\tvec4 y_=floor(j-7.*x_);// mod(j,N)\n\t\n\tvec4 x=x_*ns.x+ns.yyyy;\n\tvec4 y=y_*ns.x+ns.yyyy;\n\tvec4 h=1.-abs(x)-abs(y);\n\t\n\tvec4 b0=vec4(x.xy,y.xy);\n\tvec4 b1=vec4(x.zw,y.zw);\n\t\n\t//vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n\t//vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n\tvec4 s0=floor(b0)*2.+1.;\n\tvec4 s1=floor(b1)*2.+1.;\n\tvec4 sh=-step(h,vec4(0.));\n\t\n\tvec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;\n\tvec4 a1=b1.xzyw+s1.xzyw*sh.zzww;\n\t\n\tvec3 p0=vec3(a0.xy,h.x);\n\tvec3 p1=vec3(a0.zw,h.y);\n\tvec3 p2=vec3(a1.xy,h.z);\n\tvec3 p3=vec3(a1.zw,h.w);\n\t\n\t//Normalise gradients\n\t//vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n\tvec4 norm=inversesqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));\n\tp0*=norm.x;\n\tp1*=norm.y;\n\tp2*=norm.z;\n\tp3*=norm.w;\n\t\n\t// Mix final noise value\n\tvec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);\n\tm=m*m;\n\treturn 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));\n}\n\n//////////////////////////////////////////////////////////////\n\n// PRNG\n// From https://www.shadertoy.com/view/4djSRW\nfloat prng(in vec2 seed){\n\tseed=fract(seed*vec2(5.3983,5.4427));\n\tseed+=dot(seed.yx,seed.xy+vec2(21.5351,14.3137));\n\treturn fract(seed.x*seed.y*95.4337);\n}\n\n//////////////////////////////////////////////////////////////\n\nfloat PI=3.1415926535897932384626433832795;\n\nfloat noiseStack(vec3 pos,int octaves,float falloff){\n\tfloat noise=snoise(vec3(pos));\n\tfloat off=1.;\n\tif(octaves>1){\n\t\tpos*=2.;\n\t\toff*=falloff;\n\t\tnoise=(1.-off)*noise+off*snoise(vec3(pos));\n\t}\n\tif(octaves>2){\n\t\tpos*=2.;\n\t\toff*=falloff;\n\t\tnoise=(1.-off)*noise+off*snoise(vec3(pos));\n\t}\n\tif(octaves>3){\n\t\tpos*=2.;\n\t\toff*=falloff;\n\t\tnoise=(1.-off)*noise+off*snoise(vec3(pos));\n\t}\n\treturn(1.+noise)/2.;\n}\n\nvec2 noiseStackUV(vec3 pos,int octaves,float falloff,float diff){\n\tfloat displaceA=noiseStack(pos,octaves,falloff);\n\tfloat displaceB=noiseStack(pos+vec3(3984.293,423.21,5235.19),octaves,falloff);\n\treturn vec2(displaceA,displaceB);\n}\n\nvoid main(){\n\tfloat time=iTime;\n\tvec2 resolution=iResolution.xy;\n\tvec2 fragCoord=vTextureCoord*filterArea.xy;\n\tvec2 offset=vec2(0.);\n\t//\n\tfloat xpart=fragCoord.x/resolution.x;\n\tfloat ypart=fragCoord.y/resolution.y;\n\t//\n\tfloat clip=uHeight;\n\tfloat ypartClip=1.0 - fragCoord.y/clip;//开始Y方向\n\tfloat ypartClippedFalloff=clamp(2.-ypartClip,0.,1.);//【0-1】\n\tfloat ypartClipped=min(ypartClip,1.);\n\tfloat ypartClippedn=1.-ypartClipped;\n\t//X方向油量\n\tfloat xfuel=pow(1.-abs(2.*xpart-1.),(1.0 - (uWidth/resolution.x))*5.0);\n\t//\n\tfloat timeSpeed=.5;\n\tfloat realTime=timeSpeed*time;\n\t//\n\tvec2 coordScaled=.01*fragCoord-.02*vec2(offset.x,0.);\n\tvec3 position=vec3(coordScaled,0.)+vec3(1223.,6434.,8425.);\n\tvec3 flow=vec3(4.1*(.5-xpart)*pow(ypartClippedn,4.),-2.*xfuel*pow(ypartClippedn,64.),0.);\n\tvec3 timing=realTime*vec3(0.,1.7,1.1)+flow;\n\t//\n\tvec3 displacePos=vec3(1.,.5,1.)*2.4*position+realTime*vec3(.01,.7,1.3);\n\tvec3 displace3=vec3(noiseStackUV(displacePos,2,.4,.1),0.);\n\t//\n\tvec3 noiseCoord=(vec3(2.,1.,1.)*position+timing+.4*displace3)/1.;\n\tfloat noise=noiseStack(noiseCoord,3,.4);\n\t//\n\tfloat flames=pow(ypartClipped,.3*xfuel)*pow(noise,.3*xfuel);\n\t//\n\tfloat f=ypartClippedFalloff*pow(1.-flames*flames*flames,8.);\n\tfloat fff=f*f*f;\n\tvec3 fire=uStrength*vec3(f,fff,fff*fff);\n\t\n\t// smoke\n\tfloat smokeNoise=.5+snoise(.4*position+timing*vec3(1.,1.,.2))/2.;\n\tvec3 smoke=vec3(.3*pow(xfuel,3.)*pow(ypart,2.)*(smokeNoise+.4*(1.-noise)));\n\t\n\t// sparks\n\tfloat sparkGridSize=30.*uStrength;\n\tvec2 sparkCoord=0.0 - fragCoord-vec2(2.*offset.x,190.*realTime);\n\tsparkCoord-=30.*noiseStackUV(.01*vec3(sparkCoord,30.*time),1,.4,.1);\n\tsparkCoord+=100.*flow.xy;\n\tif(mod(sparkCoord.y/sparkGridSize,2.)<1.)sparkCoord.x+=.5*sparkGridSize;\n\tvec2 sparkGridIndex=vec2(floor(sparkCoord/sparkGridSize));\n\tfloat sparkRandom=prng(sparkGridIndex);\n\tfloat sparkLife=min(10.*(1.-min((sparkGridIndex.y+(190.*realTime/sparkGridSize))/(24.-20.*sparkRandom),1.)),1.);\n\tvec3 sparks=vec3(0.);\n\tif(sparkLife>0.){\n\t\tfloat sparkSize=xfuel*xfuel*sparkRandom*.08;\n\t\tfloat sparkRadians=999.*sparkRandom*2.*PI+2.*time;\n\t\tvec2 sparkCircular=vec2(sin(sparkRadians),cos(sparkRadians));\n\t\tvec2 sparkOffset=(.5-sparkSize)*sparkGridSize*sparkCircular;\n\t\tvec2 sparkModulus=mod(sparkCoord+sparkOffset,sparkGridSize)-.5*vec2(sparkGridSize);\n\t\tfloat sparkLength=length(sparkModulus);\n\t\tfloat sparksGray=max(0.,1.-sparkLength/(sparkSize*sparkGridSize));\n\t\tsparks=sparkLife*sparksGray*vec3(0.9333, 0.498, 0.1412);\n\t}\n\t//\n\tvec4 effect = vec4(max(fire,sparks)+smoke,1.);\n\teffect.a = effect.r;\n\tgl_FragColor = effect + texture2D(uSampler, vTextureCoord);\n}";

  /**
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/spark-drfting}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   * @param {number} [height=0.0] spark height
   * @param {number} [widht=0.0] spark width
   * @param {number} [strength=0.0] strength
   * @param {number} [delta=0.0] time for shader animation
   */

  var AmoySparksDriftingFilter = /*@__PURE__*/(function (Filter) {
      function AmoySparksDriftingFilter(height, width, strength, delta) {
          if ( height === void 0 ) { height = 0.0; }
          if ( width === void 0 ) { width = 0.0; }
          if ( strength === void 0 ) { strength = 2.; }
          if ( delta === void 0 ) { delta = 0.0; }

          Filter.call(this, vertex$6, fragment$6);
          // sub class
          this.height = height;
          this.width = width;
          this.strength = strength;
          this.delta = delta;
      }

      if ( Filter ) { AmoySparksDriftingFilter.__proto__ = Filter; }
      AmoySparksDriftingFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoySparksDriftingFilter.prototype.constructor = AmoySparksDriftingFilter;

      var prototypeAccessors = { width: { configurable: true },height: { configurable: true },strength: { configurable: true },delta: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoySparksDriftingFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          this.uniforms.uWidth = this.width;
          this.uniforms.uHeight = this.height;
          this.uniforms.uStrength = this.strength;
          this.uniforms.uTime = this.delta;
          filterManager.applyFilter(this, input, output, clear);
      };

      /**
       * fire w
       */
      prototypeAccessors.width.get = function () {
          return this.uniforms.uWidth;
      };

      prototypeAccessors.width.set = function (value) {
          this.uniforms.uWidth = value;
      };

      /**
       * fire H
       */
      prototypeAccessors.height.get = function () {
          return this.uniforms.uHeight;
      };

      prototypeAccessors.height.set = function (value) {
          this.uniforms.uHeight = value;
      };

      /**
       * fire strength
       */
      prototypeAccessors.strength.get = function () {
          return this.uniforms.uStrength;
      };

      prototypeAccessors.strength.set = function (value) {
          this.uniforms.uStrength = value;
      };

      /**
       * time for animation
       *
       * @member {number}
       * @default 0.0
       */
      prototypeAccessors.delta.get = function () {
          return this.uniforms.uTime;
      };

      prototypeAccessors.delta.set = function (value) {
          this.uniforms.uTime = value;
      };

      Object.defineProperties( AmoySparksDriftingFilter.prototype, prototypeAccessors );

      return AmoySparksDriftingFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-white-black-sketch - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-white-black-sketch is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$7 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$7 = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform sampler2D uSampler;// 2d texture2D\nuniform vec4 filterArea;\n\nuniform int uInvertColor;\nuniform float uTime;\n\nfloat rand(float x)\n{\n    return fract(sin(x)*43758.5453);\n}\n\nfloat triangle(float x)\n{\n    return abs(1.-mod(abs(x),2.))*2.-1.;\n}\n\nvoid main()\n{\n    float time=floor(uTime*16.)/16.;\n    \n    vec2 uv=vTextureCoord;\n    \n    // pixel position\n    vec2 p=uv;\n    p+=vec2(triangle(p.y*rand(time)*4.)*rand(time*1.9)*.015,\n    triangle(p.x*rand(time*3.4)*4.)*rand(time*2.1)*.015);\n    p+=vec2(rand(p.x*3.1+p.y*8.7)*.01,\n    rand(p.x*1.1+p.y*6.7)*.01);\n    \n    // vec2 blurredUV = vec2(p.x+0.003,p.y+0.003);\n    // vec4 baseColor = vec4(texture(iChannel0, blurredUV).rgb,1.);\n\n    vec4 baseColor=vec4(texture2D(uSampler,uv).rgb,1.);\n    vec4 edges=1.-(baseColor/vec4(texture2D(uSampler,p).rgb,1.));\n    \n    if(uInvertColor>0){\n        baseColor.rgb=vec3(baseColor.r);\n        gl_FragColor=baseColor/vec4(length(edges));\n    }else{\n        gl_FragColor=vec4(length(edges));\n    }\n}";

  /**
   * @class
   * @extends PIXI.Filter
   * @see {@link https://www.npmjs.com/package/@amoy/filter-white-black-sketch}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @memberof AMOY.filters
   * @param {boolean} [invertColor = false] invertcolor true or false
   * @param {number} [delta = 0] time for animation
   */

  var AmoyWhiteBlackSketchFilter = /*@__PURE__*/(function (Filter) {
      function AmoyWhiteBlackSketchFilter(invertColor, delta) {
          if ( invertColor === void 0 ) { invertColor = false; }
          if ( delta === void 0 ) { delta = 0.0; }

          Filter.call(this, vertex$7, fragment$7);
          // sub class
          this._invertColor = invertColor;
          this.invertColor = invertColor;
          this.delta = delta;
      }

      if ( Filter ) { AmoyWhiteBlackSketchFilter.__proto__ = Filter; }
      AmoyWhiteBlackSketchFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyWhiteBlackSketchFilter.prototype.constructor = AmoyWhiteBlackSketchFilter;

      var prototypeAccessors = { invertColor: { configurable: true },delta: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyWhiteBlackSketchFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          this.uniforms.uInvertColor = this.invertColor ? 1 : 0;
          this.uniforms.uTime = this.delta;
          filterManager.applyFilter(this, input, output, clear);
      };

      /**
       * color invert boolean
       */
      prototypeAccessors.invertColor.get = function () {
          return this._invertColor;
      };

      prototypeAccessors.invertColor.set = function (value) {
          this._invertColor = value;
          this.uniforms.uInvertColor = value ? 1 : 0;
      };

      /**
       * time for animation
       *
       * @member {number}
       * @default 0.0
       */
      prototypeAccessors.delta.get = function () {
          return this.uniforms.uTime;
      };

      prototypeAccessors.delta.set = function (value) {
          this.uniforms.uTime = value;
      };

      Object.defineProperties( AmoyWhiteBlackSketchFilter.prototype, prototypeAccessors );

      return AmoyWhiteBlackSketchFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-vcr - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-vcr is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$8 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$8 = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform sampler2D uSampler; // 2d texture2D\nuniform vec4 filterArea;\n\nuniform float uTime;\n\n//噪音简化算法，效率高\n// Description : Array and textureless GLSL 2D simplex snoise function.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : stegu\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-snoise\n//               https://github.com/stegu/webgl-snoise\n// \n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec2 mod289(vec2 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec3 permute(vec3 x) {\n  return mod289(((x*34.0)+1.0)*x);\n}\n\nfloat snoise(vec2 v)\n  {\n  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0\n                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)\n                     -0.577350269189626,  // -1.0 + 2.0 * C.x\n                      0.024390243902439); // 1.0 / 41.0\n// First corner\n  vec2 i  = floor(v + dot(v, C.yy) );\n  vec2 x0 = v -   i + dot(i, C.xx);\n\n// Other corners\n  vec2 i1;\n  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0\n  //i1.y = 1.0 - i1.x;\n  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n  // x0 = x0 - 0.0 + 0.0 * C.xx ;\n  // x1 = x0 - i1 + 1.0 * C.xx ;\n  // x2 = x0 - 1.0 + 2.0 * C.xx ;\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n\n// Permutations\n  i = mod289(i); // Avoid truncation effects in permutation\n  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))\n\t\t+ i.x + vec3(0.0, i1.x, 1.0 ));\n\n  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\n  m = m*m ;\n  m = m*m ;\n\n// Gradients: 41 points uniformly over a line, mapped onto a diamond.\n// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)\n\n  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n\n// Normalise gradients implicitly by scaling m\n// Approximation of: m *= inversesqrt( a0*a0 + h*h );\n  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\n\n// Compute final snoise value at P\n  vec3 g;\n  g.x  = a0.x  * x0.x  + h.x  * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130.0 * dot(m, g);\n}\n\nfloat onOff(float a, float b, float c)\n{\n\treturn step(c, sin(uTime + a*cos(uTime*b)));\n}\n\nfloat ramp(float y, float start, float end)\n{\n\tfloat inside = step(start,y) - step(end,y);\n\tfloat fact = (y-start)/(end-start)*inside;\n\treturn (1.-fact) * inside;\n\t\n}\n\nfloat stripes(vec2 uv)\n{\n\tfloat noi = snoise(uv*vec2(0.5,1.) + vec2(1.,3.));\n\treturn ramp(mod(uv.y*4. + uTime/2.+sin(uTime + sin(uTime*0.63)),1.),0.5,0.6)*noi;\n}\n\nvec3 getVideo(vec2 uv)\n{\n\tvec2 look = uv;\n\tfloat window = 1./(1.+20.*(look.y-mod(uTime/4.,1.))*(look.y-mod(uTime/4.,1.)));\n\tlook.x = look.x + sin(look.y*10. + uTime)/50.*onOff(4.,4.,.3)*(1.+cos(uTime*80.))*window;\n\tfloat vShift = 0.4*onOff(2.,3.,.9)*(sin(uTime)*sin(uTime*20.) + (0.5 + 0.1*sin(uTime*200.)*cos(uTime)));\n\tlook.y = mod(look.y + vShift, 1.);\n\tvec3 video = vec3(texture2D(uSampler,look));\n\treturn video;\n}\n\nvec2 screenDistort(vec2 uv)\n{\n\tuv -= vec2(.5,.5);\n\tuv = uv*1.2*(1./1.2+2.*uv.x*uv.x*uv.y*uv.y);\n\tuv += vec2(.5,.5);\n\treturn uv;\n}\n\nvoid main(void)\n{\n\tvec2 uv = vTextureCoord;\n\tuv = screenDistort(uv);\n\tvec3 video = getVideo(uv);\n\tfloat vigAmt = 3.+.3*sin(uTime + 5.*cos(uTime*5.));\n\tfloat vignette = (1.-vigAmt*(uv.y-.5)*(uv.y-.5))*(1.-vigAmt*(uv.x-.5)*(uv.x-.5));\n\t\n\tvideo += stripes(uv);\n\tvideo += snoise(uv*2.)/2.;\n\tvideo *= vignette;\n\tvideo *= (12.+mod(uv.y*30.+uTime,1.))/13.;\n\t\n\tgl_FragColor = vec4(video,1.0);\n}";

  /**
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-vcr}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   * @param {number} [delta] time for shader animation
   */

  var AmoyVcrFilter = /*@__PURE__*/(function (Filter) {
      function AmoyVcrFilter(delta) {
          if ( delta === void 0 ) { delta = 0.0; }

          Filter.call(this, vertex$8, fragment$8);
          // sub class
          this.delta = delta;
      }

      if ( Filter ) { AmoyVcrFilter.__proto__ = Filter; }
      AmoyVcrFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyVcrFilter.prototype.constructor = AmoyVcrFilter;

      var prototypeAccessors = { delta: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyVcrFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          this.uniforms.uTime = this.delta <= 0 ? 2.0 : this.delta;
          filterManager.applyFilter(this, input, output, clear);
      };

      /**
       * time for animation
       *
       * @member {number}
       * @default 0.0
       */
      prototypeAccessors.delta.get = function () {
          return this.uniforms.uTime;
      };

      prototypeAccessors.delta.set = function (value) {
          this.uniforms.uTime = value;
      };

      Object.defineProperties( AmoyVcrFilter.prototype, prototypeAccessors );

      return AmoyVcrFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-flame - v3.0.25
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-flame is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$9 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$9 = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform sampler2D uSampler;// 2d texture\nuniform vec4 filterArea;\n\nuniform float uPosx;\nuniform float uPosy;\nuniform float uStrength;\nuniform float uTime;\n//////////////////////\n// Fire Flame shader\n\n// procedural noise from IQ\nvec2 hash(vec2 p)\n{\n\tp=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));\n\treturn-1.+2.*fract(sin(p)*43758.5453123);\n}\n\nfloat noise(in vec2 p)\n{\n\tconst float K1=.366025404;// (sqrt(3)-1)/2;\n\tconst float K2=.211324865;// (3-sqrt(3))/6;\n\t\n\tvec2 i=floor(p+(p.x+p.y)*K1);\n\t\n\tvec2 a=p-i+(i.x+i.y)*K2;\n\tvec2 o=(a.x>a.y)?vec2(1.,0.):vec2(0.,1.);\n\tvec2 b=a-o+K2;\n\tvec2 c=a-1.+2.*K2;\n\t\n\tvec3 h=max(.5-vec3(dot(a,a),dot(b,b),dot(c,c)),0.);\n\t\n\tvec3 n=h*h*h*h*vec3(dot(a,hash(i+0.)),dot(b,hash(i+o)),dot(c,hash(i+1.)));\n\t\n\treturn dot(n,vec3(70.));\n}\n\nfloat fbm(vec2 uv)\n{\n\tfloat f;\n\tmat2 m=mat2(1.6,1.2,-1.2,1.6);\n\tf=.5000*noise(uv);uv=m*uv;\n\tf+=.2500*noise(uv);uv=m*uv;\n\tf+=.1250*noise(uv);uv=m*uv;\n\tf+=.0625*noise(uv);uv=m*uv;\n\tf=.5+.5*f;\n\treturn f;\n}\n\nvoid main()\n{\n\tvec2 uv=vTextureCoord;\n\tvec2 q=uv;\n\tq.y = 1.0 - q.y;\n\tfloat strength=uStrength;\n\tfloat T3=max(3.,1.25*strength)*uTime;\n\tq.x-=uPosx/filterArea.x;\n\tq.y-=uPosy/filterArea.y;\n\tfloat n=fbm(strength*q-vec2(0,T3));\n\tfloat c=1.-26.*pow(max(0.,length(q*vec2(1.8+q.y*1.5,.75))-n*max(0.,q.y+.25)),1.2);\n\tfloat c1=n*c*(1.5-pow(1.50*(1.0 - uv.y),1.2));\n\tc1=clamp(c1,0.,1.);\n\t\n\tvec3 col=vec3(1.5*c1,1.5*c1*c1*c1,c1*c1*c1*c1*c1*c1);\n\t\n\tfloat a=c*(1.-pow(uv.y,3.));\n\tgl_FragColor=vec4(mix(vec3(0.),col,a),1.)+texture2D(uSampler,vTextureCoord);\n}";

  /**
   *
   *  * The AmoyFlameFilter applies the effect to an object.<br>
   * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/AmoyFlameFilter.gif)
   *
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-flame}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   * @param {number} [posx=10.0] flame center x position in pic
   * @param {number} [posy=10.0] flame center y position in pic
   * @param {number} [strength=2.0] strength of flame
   * @param {number} [delta=0] - For animating interlaced lines
   */

  var AmoyFlameFilter = /*@__PURE__*/(function (Filter) {
      function AmoyFlameFilter(posx, posy, strength, delta) {
          if ( posx === void 0 ) { posx = 10.0; }
          if ( posy === void 0 ) { posy = 10.0; }
          if ( strength === void 0 ) { strength = 2.; }
          if ( delta === void 0 ) { delta = 0.0; }

          Filter.call(this, vertex$9, fragment$9);
          // sub class
          this.posx = posx;
          this.posy = posy;
          this.strength = strength;
          this.delta = delta;
      }

      if ( Filter ) { AmoyFlameFilter.__proto__ = Filter; }
      AmoyFlameFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyFlameFilter.prototype.constructor = AmoyFlameFilter;

      var prototypeAccessors = { posx: { configurable: true },posy: { configurable: true },strength: { configurable: true },delta: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyFlameFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          this.uniforms.uPosx = this.posx <= 0 ? 10.0 : this.posx;
          this.uniforms.uPosy = this.posy <= 0 ? 10.0 : this.posy;
          this.uniforms.uStrength = this.strength;
          this.uniforms.uTime = this.delta <= 0 ? 2.0 : this.delta;
          filterManager.applyFilter(this, input, output, clear);
      };

      /**
       * current x
       */
      prototypeAccessors.posx.get = function () {
          return this.uniforms.uPosx;
      };

      prototypeAccessors.posx.set = function (value) {
          this.uniforms.uPosx = value;
      };

      /**
       * current y
       */
      prototypeAccessors.posy.get = function () {
          return this.uniforms.uPosy;
      };

      prototypeAccessors.posy.set = function (value) {
          this.uniforms.uPosy = value;
      };

      /**
       * flame strength
       */
      prototypeAccessors.strength.get = function () {
          return this.uniforms.uStrength;
      };

      prototypeAccessors.strength.set = function (value) {
          this.uniforms.uStrength = value;
      };


      /**
       * time for animation
       *
       * @member {number}
       * @default 0.0
       */
      prototypeAccessors.delta.get = function () {
          return this.uniforms.uTime;
      };

      prototypeAccessors.delta.set = function (value) {
          this.uniforms.uTime = value;
      };

      Object.defineProperties( AmoyFlameFilter.prototype, prototypeAccessors );

      return AmoyFlameFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-gameboy-style - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-gameboy-style is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$a = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$a = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform sampler2D uSampler;// 2d texture\nuniform vec4 filterArea;\n\nuniform float uPosx;\nuniform float uPosy;\nuniform float uTime;\n\nvoid main(){\n\tvec2 fragCoord=vTextureCoord*filterArea.xy;\n\tvec2 uv=fragCoord.xy/filterArea.xy;\n\tconst float resolution=160.;//步长\n\tuv=floor(uv*resolution)/resolution;// 0 or 1\n\t\n\tvec3 color=texture2D(uSampler,uv).rgb;\n\t\n\tfloat intensity=(color.r+color.g+color.b)/3.;\n\tint index=int(intensity*4.);\n\n\tif(index == 0){\n\t\tgl_FragColor=vec4(vec3(15./255., 56./255., 15./255.),1.);\n\t}else if(index == 1){\n\t\tgl_FragColor=vec4(vec3(48./255., 98./255., 48./255.),1.);\n\t}else if(index == 2){\n\t\tgl_FragColor=vec4(vec3(139./255., 172./255., 15./255.),1.);\n\t}else{\n\t\tgl_FragColor=vec4(vec3(155./255., 188./255., 15./255.),1.);\n\t}\n}";

  /**
   *
   *  * The AmoyGameboyStyleFilter applies the effect to an object.<br>
   * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/AmoyGameboyStyleFilter.png)
   *
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-gameboy-style}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   */

  var AmoyGameboyStyleFilter = /*@__PURE__*/(function (Filter) {
      function AmoyGameboyStyleFilter() {
          Filter.call(this, vertex$a, fragment$a);
          // sub class
      }

      if ( Filter ) { AmoyGameboyStyleFilter.__proto__ = Filter; }
      AmoyGameboyStyleFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyGameboyStyleFilter.prototype.constructor = AmoyGameboyStyleFilter;

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyGameboyStyleFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          filterManager.applyFilter(this, input, output, clear);
      };

      return AmoyGameboyStyleFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-snow - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-snow is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$b = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$b = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform sampler2D uSampler;// 2d texture\nuniform vec4 filterArea;\n\nuniform int uBlizard;\nuniform float uTime;\n\nconst mat3 p=mat3(13.323122,23.5112,21.71123,21.1212,28.7312,11.9312,21.8112,14.7212,61.3934);\n\t\nvec3 createSnow(int i,float depth,float width,float speed,float dof,vec2 uv){\n\tfloat fi=float(i);\n\tvec2 q=uv*(1.+fi*depth);\n\tq+=vec2(q.y*(width*mod(fi*7.238917,1.)-width*.5),speed*uTime/(1.+fi*depth*.03));\n\tvec3 n=vec3(floor(q),31.189+fi);\n\tvec3 m=floor(n)*.00001+fract(n);\n\tvec3 mp=(31415.9+m)/fract(p*m);\n\tvec3 r=fract(mp);\n\tvec2 s=abs(mod(q,1.)-.5+.9*r.xy-.45);\n\ts+=.01*abs(2.*fract(10.*q.yx)-1.);\n\tfloat d=.6*max(s.x-s.y,s.x+s.y)+max(s.x,s.y)-.01;\n\tfloat edge=.005+.05*min(.5*abs(fi-5.-dof),1.);\n\treturn vec3(smoothstep(edge,-edge,d)*(r.x/(1.+.02*fi*depth)));\n}\n\nvoid main()\n{\n\tvec2 fragCoord=vTextureCoord*filterArea.xy;\n\tvec2 uv=vec2(1.,filterArea.y/filterArea.x)*fragCoord.xy/filterArea.xy;\n\tvec3 acc=vec3(0.);\n\tfloat dof=5.*sin(uTime*.1);\n\tif(uBlizard==1){\n\t\tfor(int i=0;i<100;i++){\n\t\t\tacc+=createSnow(i,.1,.8,-1.5,dof,uv);\n\t\t}\n\t}else{\n\t\tfor(int i=0;i<50;i++){\n\t\t\tacc+=createSnow(i,.5,.3,-.6,dof,uv);\n\t\t}\n\t}\n\tgl_FragColor=vec4(vec3(acc),1.) + texture2D(uSampler, vTextureCoord);\n}";

  /**
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/snow}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   * @param {Boolen} [blizard=false] snow mode true or false
   * @param {number} [delta=0] time for animation
   */

  var AmoySnowFilter = /*@__PURE__*/(function (Filter) {
      function AmoySnowFilter(blizard, delta) {
          if ( blizard === void 0 ) { blizard = false; }
          if ( delta === void 0 ) { delta = 0.0; }

          Filter.call(this, vertex$b, fragment$b);
          // sub class
          this._blizard = blizard;
          this.blizard = this._blizard;
          this.delta = delta;
      }

      if ( Filter ) { AmoySnowFilter.__proto__ = Filter; }
      AmoySnowFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoySnowFilter.prototype.constructor = AmoySnowFilter;

      var prototypeAccessors = { blizard: { configurable: true },delta: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoySnowFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          this.uniforms.uBlizard = this._blizard?1:0;
          this.uniforms.uTime = this.delta <= 0 ? 2.0 : this.delta;
          filterManager.applyFilter(this, input, output, clear);
      };

      /**
       *  snow model
       */
      prototypeAccessors.blizard.get = function () {
          return this._blizard;
      };

      prototypeAccessors.blizard.set = function (value) {
          this._blizard = value;
          this.uniforms.uBlizard = value?1:0;
      };

      /**
       * time for animation
       *
       * @member {number}
       * @default 0.0
       */
      prototypeAccessors.delta.get = function () {
          return this.uniforms.uTime;
      };

      prototypeAccessors.delta.set = function (value) {
          this.uniforms.uTime = value;
      };

      Object.defineProperties( AmoySnowFilter.prototype, prototypeAccessors );

      return AmoySnowFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-light-sweep - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-light-sweep is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$c = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$c = "varying vec2 vTextureCoord;//passed from vect shader\n\nuniform sampler2D uSampler;// 2d texture\nuniform vec4 filterArea;\n\nuniform float uTime;\n\nvoid main()\n{\n\t\n\tvec2 uv=vTextureCoord;\n\tuv.x *=.5;\n\tfloat col=sin(uv.y+uv.x*3.-uTime*6.)*.9;\n\tcol*=col*col*.6;\n\n\tcol= clamp(col,0.,1.);\n\t\n\tvec4 tex=texture2D(uSampler,vTextureCoord);\n\tif(tex.a < .005){\n\t\tdiscard;\n\t}\n\tgl_FragColor=tex+vec4(col,col,col,tex.a);\n}";

  /**
   * The AmoyLightSweepFilter applies the effect to an object.<br>
   * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/AmoyLightSweepFilter.gif)
   *
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-light-sweep}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   * @param {number} [delta=0] time for shader animation
   */

  var AmoyLightSweepFilter = /*@__PURE__*/(function (Filter) {
      function AmoyLightSweepFilter(delta) {
          if ( delta === void 0 ) { delta = 0.0; }

          Filter.call(this, vertex$c, fragment$c);
          this.delta = delta;
      }

      if ( Filter ) { AmoyLightSweepFilter.__proto__ = Filter; }
      AmoyLightSweepFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyLightSweepFilter.prototype.constructor = AmoyLightSweepFilter;

      var prototypeAccessors = { delta: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyLightSweepFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          this.uniforms.uTime = this.delta <= 0 ? 2.0 : this.delta;
          filterManager.applyFilter(this, input, output, clear);
      };
      /**
       * time for animation
       *
       * @member {number}
       * @default 0.0
       */
      prototypeAccessors.delta.get = function () {
          return this.uniforms.uTime;
      };

      prototypeAccessors.delta.set = function (value) {
          this.uniforms.uTime = value;
      };

      Object.defineProperties( AmoyLightSweepFilter.prototype, prototypeAccessors );

      return AmoyLightSweepFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-reflection - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-reflection is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$d = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$d = "varying vec2 vTextureCoord;//passed from vect shader\n\nuniform sampler2D uSampler;// 2d texture\nuniform vec4 filterArea;\n\nvoid main(void)\n{\n\tvec2 uv;\n\tuv.x=vTextureCoord.x;\n\tuv.y=1.-vTextureCoord.y;\n\t\n\tgl_FragColor=texture2D(uSampler,uv)*uv.y;\n}";

  /**
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-reflection}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   */

  var AmoyReflectionFilter = /*@__PURE__*/(function (Filter) {
      function AmoyReflectionFilter() {
          Filter.call(this, vertex$d, fragment$d);
          // sub class
      }

      if ( Filter ) { AmoyReflectionFilter.__proto__ = Filter; }
      AmoyReflectionFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyReflectionFilter.prototype.constructor = AmoyReflectionFilter;

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyReflectionFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          filterManager.applyFilter(this, input, output, clear);
      };

      return AmoyReflectionFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-water-reflection - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-water-reflection is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$e = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$e = "varying vec2 vTextureCoord;//passed from vect shader\n\nuniform sampler2D uSampler;// 2d texture\nuniform vec4 filterArea;\nuniform float boundary;\nuniform float uTime;\n\nvoid main()\n{\n    vec2 uv=vTextureCoord;\n    vec4 waterColor=vec4(1.);\n    float reflactionY=boundary;\n    if(uv.y>reflactionY)\n    {\n        float oy=uv.y;\n        uv.y=2.*reflactionY-uv.y;\n        uv.y=uv.y+sin(1./(oy-reflactionY)+uTime*10.)*.003;\n        waterColor=vec4(.5882,.7529,.9216,1.);\n    }\n    \n    gl_FragColor=texture2D(uSampler,uv)*waterColor;\n}\n";

  /**
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-weather-reflection}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   * @param {number} [delta = 0] time for animation
   */

  var AmoyWaterReflectionFilter = /*@__PURE__*/(function (Filter) {
      function AmoyWaterReflectionFilter(delta, boundary) {
          if ( delta === void 0 ) { delta = 0.0; }
          if ( boundary === void 0 ) { boundary = .5; }

          Filter.call(this, vertex$e, fragment$e);
          // sub class
          this.delta = delta;
          this.boundary = boundary;
      }

      if ( Filter ) { AmoyWaterReflectionFilter.__proto__ = Filter; }
      AmoyWaterReflectionFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyWaterReflectionFilter.prototype.constructor = AmoyWaterReflectionFilter;

      var prototypeAccessors = { delta: { configurable: true },boundary: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyWaterReflectionFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          this.uniforms.uTime = this.delta <= 0 ? 2.0 : this.delta;
          filterManager.applyFilter(this, input, output, clear);
      };

      /**
       * time for animation
       *
       * @member {number}
       * @default 0.0
       */
      prototypeAccessors.delta.get = function () {
          return this.uniforms.uTime;
      };

      prototypeAccessors.delta.set = function (value) {
          this.uniforms.uTime = value;
      };

      /**
       * Vertical position of the reflection point, default is 50% (middle)
       * smaller numbers produce a larger reflection, larger numbers produce a smaller reflection.
       *
       * @member {number}
       * @default 0.5
       */
      prototypeAccessors.boundary.set = function (value) {
          this.uniforms.boundary = value;
      };
      prototypeAccessors.boundary.get = function () {
          return this.uniforms.boundary;
      };

      Object.defineProperties( AmoyWaterReflectionFilter.prototype, prototypeAccessors );

      return AmoyWaterReflectionFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-weather-rainy - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-weather-rainy is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$f = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$f = "varying vec2 vTextureCoord;//passed from vect shader\n\nuniform sampler2D uSampler;// 2d texture\nuniform vec4 filterArea;\n\nuniform float uTime;\n\nfloat rand(vec2 p){\n\tp+=.2127+p.x+.3713*p.y;\n\tvec2 r=4.789*sin(789.123*(p));\n\treturn fract(r.x*r.y);\n}\n//sample noise\nfloat sn(vec2 p){\n\tvec2 i=floor(p-.5);\n\tvec2 f=fract(p-.5);\n\tf=f*f*f*(f*(f*6.-15.)+10.);\n\tfloat rt=mix(rand(i),rand(i+vec2(1.,0.)),f.x);\n\tfloat rb=mix(rand(i+vec2(0.,1.)),rand(i+vec2(1.,1.)),f.x);\n\treturn mix(rt,rb,f.y);\n}\n\nvoid main(void)\n{\n\tvec2 uv=vTextureCoord;\n\tuv.y = 1.0 - uv.y;\n\tvec2 newUV=uv;\n\tnewUV.x-=uTime*.3;\n\tnewUV.y+=uTime*3.;\n\tfloat strength=sin(uTime*.5+sn(newUV))*.1+.2;\n\tfloat rain=sn(vec2(newUV.x*20.1,newUV.y*40.1+newUV.x*400.1-20.*strength));\n\tfloat rain2=sn(vec2(newUV.x*45.+uTime*.5,newUV.y*30.1+newUV.x*100.1));\n\train=strength-rain;\n\train+=rain2*(sin(strength)-.4)*2.;\n\train=clamp(rain,0.,.5)*.8;\n\t\n\tgl_FragColor=vec4(vec3(rain),1.)+texture2D(uSampler,vTextureCoord);\n}";

  /**
   * @class
   * @extends PIXI.Filter
   * @see {@link https://www.npmjs.com/package/@amoy/weather-rainy|@amoy/weather-rainy}
   * @see {@link https://www.npmjs.com/package/@amoy/filters|@amoy/filters}
   * @memberof AMOY.filters
   * @param {number} [delta = 0] time for animation
   */

  var AmoyWeatherRainyFilter = /*@__PURE__*/(function (Filter) {
      function AmoyWeatherRainyFilter(delta) {
          if ( delta === void 0 ) { delta = 0.0; }

          Filter.call(this, vertex$f, fragment$f);
          // sub class
          this.delta = delta;
      }

      if ( Filter ) { AmoyWeatherRainyFilter.__proto__ = Filter; }
      AmoyWeatherRainyFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyWeatherRainyFilter.prototype.constructor = AmoyWeatherRainyFilter;

      var prototypeAccessors = { delta: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyWeatherRainyFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          this.uniforms.uTime = this.delta <= 0 ? 2.0 : this.delta;
          filterManager.applyFilter(this, input, output, clear);
      };

      /**
       * time for animation
       *
       * @member {number}
       * @default 0.0
       */
      prototypeAccessors.delta.get = function () {
          return this.uniforms.uTime;
      };

      prototypeAccessors.delta.set = function (value) {
          this.uniforms.uTime = value;
      };

      Object.defineProperties( AmoyWeatherRainyFilter.prototype, prototypeAccessors );

      return AmoyWeatherRainyFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-weather-cloud - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-weather-cloud is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$g = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$g = "varying vec2 vTextureCoord;//passed from vect shader\n\nuniform sampler2D uSampler;// 2d texture\nuniform vec4 filterArea;\n\nuniform float uPosx;\nuniform float uPosy;\nuniform float uTime;\n\nvec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}\nvec4 mod289(vec4 x){\n\treturn x-floor(x*(1./289.))*289.;\n}\nvec4 permute(vec4 x){\n\treturn mod289(((x*34.)+1.)*x);\n}\nvec4 taylorInvSqrt(vec4 r){\n\treturn 1.79284291400159-.85373472095314*r;\n}\nvec3 fade(vec3 t){\n\treturn t*t*t*(t*(t*6.-15.)+10.);\n}\nfloat noise(vec3 P){\n\tvec3 i0=mod289(floor(P)),i1=mod289(i0+vec3(1.)),\n\tf0=fract(P),f1=f0-vec3(1.),f=fade(f0);\n\tvec4 ix=vec4(i0.x,i1.x,i0.x,i1.x),iy=vec4(i0.yy,i1.yy),\n\tiz0=i0.zzzz,iz1=i1.zzzz,\n\tixy=permute(permute(ix)+iy),ixy0=permute(ixy+iz0),ixy1=permute(ixy+iz1),\n\tgx0=ixy0*(1./7.),gy0=fract(floor(gx0)*(1./7.))-.5,\n\tgx1=ixy1*(1./7.),gy1=fract(floor(gx1)*(1./7.))-.5;\n\tgx0=fract(gx0);gx1=fract(gx1);\n\tvec4 gz0=vec4(.5)-abs(gx0)-abs(gy0),sz0=step(gz0,vec4(0.)),\n\tgz1=vec4(.5)-abs(gx1)-abs(gy1),sz1=step(gz1,vec4(0.));\n\tgx0-=sz0*(step(0.,gx0)-.5);gy0-=sz0*(step(0.,gy0)-.5);\n\tgx1-=sz1*(step(0.,gx1)-.5);gy1-=sz1*(step(0.,gy1)-.5);\n\tvec3 g0=vec3(gx0.x,gy0.x,gz0.x),g1=vec3(gx0.y,gy0.y,gz0.y),\n\tg2=vec3(gx0.z,gy0.z,gz0.z),g3=vec3(gx0.w,gy0.w,gz0.w),\n\tg4=vec3(gx1.x,gy1.x,gz1.x),g5=vec3(gx1.y,gy1.y,gz1.y),\n\tg6=vec3(gx1.z,gy1.z,gz1.z),g7=vec3(gx1.w,gy1.w,gz1.w);\n\tvec4 norm0=taylorInvSqrt(vec4(dot(g0,g0),dot(g2,g2),dot(g1,g1),dot(g3,g3))),\n\tnorm1=taylorInvSqrt(vec4(dot(g4,g4),dot(g6,g6),dot(g5,g5),dot(g7,g7)));\n\tg0*=norm0.x;g2*=norm0.y;g1*=norm0.z;g3*=norm0.w;\n\tg4*=norm1.x;g6*=norm1.y;g5*=norm1.z;g7*=norm1.w;\n\tvec4 nz=mix(vec4(dot(g0,vec3(f0.x,f0.y,f0.z)),dot(g1,vec3(f1.x,f0.y,f0.z)),\n\tdot(g2,vec3(f0.x,f1.y,f0.z)),dot(g3,vec3(f1.x,f1.y,f0.z))),\n\tvec4(dot(g4,vec3(f0.x,f0.y,f1.z)),dot(g5,vec3(f1.x,f0.y,f1.z)),\n\tdot(g6,vec3(f0.x,f1.y,f1.z)),dot(g7,vec3(f1.x,f1.y,f1.z))),f.z);\n\treturn 2.2*mix(mix(nz.x,nz.z,f.y),mix(nz.y,nz.w,f.y),f.x);\n}\n\nvoid main()\n{\n\t// Normalized pixel coordinates (from 0 to 1) and center pos\n\tvec2 uv=vTextureCoord;\n\tuv = uv -.5;\n\n\tfloat c=0.;\n\t// BUILD A FRACTAL TEXTURE USING\n\t// NOISE THAT ANIMATES THROUGH Z\n\tfloat x=uv.x+uTime*.2;\n\tfloat y=uv.y;\n\n\tfor(int n=1;n<=5;n++){\n\t\tfloat z=float(n);\n\t\tvec3 p=vec3(x,y,z+.05*uTime);\n\t\tfloat frequency=pow(2.,z);\n\t\tc+=(noise(frequency*p)/frequency);\n\t}\n\t\n\n\t// CLOUDS SHOT WITH COLOR\n\tvec3 sky=vec3(.1,.3,.9);\n\tvec3 white=vec3(1.0, 1.0, 1.0);\n\tvec3 pink=vec3(0.8549, 0.7569, 0.7569);\n\tvec3 cloud=mix(pink,white,c);\n\tc=clamp(c+y,0.,1.);\n\tvec3 color=mix(sky,cloud,c);\n\t\n\t// Output to screen\n\tgl_FragColor=vec4(sqrt(color),1.);\n\n}";

  /**
   * @author lilieming
   * original shader :https://www.shadertoy.com/view/Wl2XWR by @lilieming
   */

  /**
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-weather-cloud}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   * @param {number} [delta = 0] time for animation
   */

  var AmoyWeatherCloudFilter = /*@__PURE__*/(function (Filter) {
      function AmoyWeatherCloudFilter(delta) {
          if ( delta === void 0 ) { delta = 0.0; }

          Filter.call(this, vertex$g, fragment$g);
          // sub class
          this.delta = delta;
      }

      if ( Filter ) { AmoyWeatherCloudFilter.__proto__ = Filter; }
      AmoyWeatherCloudFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyWeatherCloudFilter.prototype.constructor = AmoyWeatherCloudFilter;

      var prototypeAccessors = { delta: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyWeatherCloudFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          this.uniforms.uTime = this.delta <= 0 ? 2.0 : this.delta;
          filterManager.applyFilter(this, input, output, clear);
      };

      /**
       * time for animation
       *
       * @member {number}
       * @default 0.0
       */
      prototypeAccessors.delta.get = function () {
          return this.uniforms.uTime;
      };

      prototypeAccessors.delta.set = function (value) {
          this.uniforms.uTime = value;
      };

      Object.defineProperties( AmoyWeatherCloudFilter.prototype, prototypeAccessors );

      return AmoyWeatherCloudFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-inner-outline - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-inner-outline is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$h = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$h = "varying vec2 vTextureCoord;//passed from vect shader\nuniform sampler2D uSampler;// 2d texture\nuniform vec4 filterArea;\n\nuniform float uTime;\nuniform vec3 uColor;\n\nfloat rand(vec2 n){\n\treturn fract(sin(dot(n,vec2(12.9898,12.1414)))*83758.5453);\n}\n\nfloat noise(vec2 n){\n\tconst vec2 d=vec2(0.,1.);\n\tvec2 b=floor(n);\n\tvec2 f=mix(vec2(0.),vec2(1.),fract(n));\n\treturn mix(mix(rand(b),rand(b+d.yx),f.x),mix(rand(b+d.xy),rand(b+d.yy),f.x),f.y);\n}\n\nvec3 ramp(float t){\n\treturn t<=.5?vec3(1.-t*1.4,.2,1.05)/t:vec3(.3*(1.-t)*2.,.2,1.05)/t;\n}\n\nfloat fire(vec2 n){\n\treturn noise(n)+noise(n*2.1)*.6+noise(n*5.4)*.42;\n}\n\nvec3 getLine(vec3 col,vec2 fc,mat2 mtx,float shift){\n\tfloat t=uTime;\n\tvec2 uv=(fc/filterArea.xy)*mtx;\n\t\n\tuv.x+=uv.y<.5?23.+t*.35:-11.+t*.3;\n\tuv.y=abs(uv.y-shift);\n\tuv*=5.;\n\t\n\tfloat q=fire(uv-t*.013)/2.;\n\tvec2 r=vec2(fire(uv+q/2.+t-uv.x-uv.y),fire(uv+q-t));\n\tvec3 color=vec3(1./(pow(vec3(.5,0.,.1)+1.61,vec3(4.))));\n\t\n\tfloat grad=pow((r.y+r.y)*max(.0,uv.y)+.1,4.);\n\tcolor=ramp(grad);\n\tcolor/=(1.50+max(vec3(0),color));\n\t\n\tif(color.b<.00000005)\n\tcolor=vec3(.0);\n\t\n\treturn mix(col,color,color.b);\n}\n\nvoid main(){\n\tvec2 fragCoord=vTextureCoord.xy*filterArea.xy;\n\tvec2 uv=fragCoord/filterArea.xy;\n\tvec3 color=vec3(0.);\n\tcolor=getLine(color,fragCoord,mat2(1.,1.,0.,1.),1.02);\n\tcolor=getLine(color,fragCoord,mat2(1.,1.,1.,0.),1.02);\n\tcolor=getLine(color,fragCoord,mat2(1.,1.,0.,1.),-.02);\n\tcolor=getLine(color,fragCoord,mat2(1.,1.,1.,0.),-.02);\n\tgl_FragColor=vec4(vec3(color.b)*uColor,1.)+texture2D(uSampler,vTextureCoord);\n}";

  /**
   * The AmoyInnerOutlineFilter applies the effect to an object.<br>
   * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/AmoyInnerOutlineFilter.gif)
   *
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-gameboy-style}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   * @param {Object} [color={r:1.0, g:0, b:0}] outline color
   * @param {number} [delta=0.0] time for shader animation
   */

  var AmoyInnerOutlineFilter = /*@__PURE__*/(function (Filter) {
      function AmoyInnerOutlineFilter(color, delta) {
          if ( color === void 0 ) { color={r:1.0, g:0, b:0}; }
          if ( delta === void 0 ) { delta = 0.0; }

          Filter.call(this, vertex$h, fragment$h);
          this.uniforms.uColor  = new Float32Array(3);
          this._color = {r:color.r, g:color.g, b:color.b};
          this.delta = delta;
      }

      if ( Filter ) { AmoyInnerOutlineFilter.__proto__ = Filter; }
      AmoyInnerOutlineFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyInnerOutlineFilter.prototype.constructor = AmoyInnerOutlineFilter;

      var prototypeAccessors = { color: { configurable: true },delta: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyInnerOutlineFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          this.uniforms.uColor[0] = this._color.r;
          this.uniforms.uColor[1] = this._color.g;
          this.uniforms.uColor[2] = this._color.b;
          this.uniforms.uTime = this.delta <= 0 ? 2.0 : this.delta;
          filterManager.applyFilter(this, input, output, clear);
      };


      prototypeAccessors.color.get = function (){
          return this._color;
      };

      prototypeAccessors.color.set = function (value) {
          this._color = value;
          this.uniforms.uColor[0] = value.r;
          this.uniforms.uColor[1] = value.g;
          this.uniforms.uColor[2] = value.b;
      };

      /**
       * time for animation
       *
       * @member {number}
       * @default 0.0
       */
      prototypeAccessors.delta.get = function () {
          return this.uniforms.uTime;
      };

      prototypeAccessors.delta.set = function (value) {
          this.uniforms.uTime = value;
      };

      Object.defineProperties( AmoyInnerOutlineFilter.prototype, prototypeAccessors );

      return AmoyInnerOutlineFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-fluid - v3.0.25
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-fluid is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var isMobile = createCommonjsModule(function (module) {
  (function(global) {
    var apple_phone = /iPhone/i,
      apple_ipod = /iPod/i,
      apple_tablet = /iPad/i,
      android_phone = /\bAndroid(?:.+)Mobile\b/i, // Match 'Android' AND 'Mobile'
      android_tablet = /Android/i,
      amazon_phone = /\bAndroid(?:.+)SD4930UR\b/i,
      amazon_tablet = /\bAndroid(?:.+)(?:KF[A-Z]{2,4})\b/i,
      windows_phone = /Windows Phone/i,
      windows_tablet = /\bWindows(?:.+)ARM\b/i, // Match 'Windows' AND 'ARM'
      other_blackberry = /BlackBerry/i,
      other_blackberry_10 = /BB10/i,
      other_opera = /Opera Mini/i,
      other_chrome = /\b(CriOS|Chrome)(?:.+)Mobile/i,
      other_firefox = /Mobile(?:.+)Firefox\b/i; // Match 'Mobile' AND 'Firefox'

    function match(regex, userAgent) {
      return regex.test(userAgent);
    }

    function isMobile(userAgent) {
      var ua =
        userAgent ||
        (typeof navigator !== 'undefined' ? navigator.userAgent : '');

      // Facebook mobile app's integrated browser adds a bunch of strings that
      // match everything. Strip it out if it exists.
      var tmp = ua.split('[FBAN');
      if (typeof tmp[1] !== 'undefined') {
        ua = tmp[0];
      }

      // Twitter mobile app's integrated browser on iPad adds a "Twitter for
      // iPhone" string. Same probably happens on other tablet platforms.
      // This will confuse detection so strip it out if it exists.
      tmp = ua.split('Twitter');
      if (typeof tmp[1] !== 'undefined') {
        ua = tmp[0];
      }

      var result = {
        apple: {
          phone: match(apple_phone, ua) && !match(windows_phone, ua),
          ipod: match(apple_ipod, ua),
          tablet:
            !match(apple_phone, ua) &&
            match(apple_tablet, ua) &&
            !match(windows_phone, ua),
          device:
            (match(apple_phone, ua) ||
              match(apple_ipod, ua) ||
              match(apple_tablet, ua)) &&
            !match(windows_phone, ua)
        },
        amazon: {
          phone: match(amazon_phone, ua),
          tablet: !match(amazon_phone, ua) && match(amazon_tablet, ua),
          device: match(amazon_phone, ua) || match(amazon_tablet, ua)
        },
        android: {
          phone:
            (!match(windows_phone, ua) && match(amazon_phone, ua)) ||
            (!match(windows_phone, ua) && match(android_phone, ua)),
          tablet:
            !match(windows_phone, ua) &&
            !match(amazon_phone, ua) &&
            !match(android_phone, ua) &&
            (match(amazon_tablet, ua) || match(android_tablet, ua)),
          device:
            (!match(windows_phone, ua) &&
              (match(amazon_phone, ua) ||
                match(amazon_tablet, ua) ||
                match(android_phone, ua) ||
                match(android_tablet, ua))) ||
            match(/\bokhttp\b/i, ua)
        },
        windows: {
          phone: match(windows_phone, ua),
          tablet: match(windows_tablet, ua),
          device: match(windows_phone, ua) || match(windows_tablet, ua)
        },
        other: {
          blackberry: match(other_blackberry, ua),
          blackberry10: match(other_blackberry_10, ua),
          opera: match(other_opera, ua),
          firefox: match(other_firefox, ua),
          chrome: match(other_chrome, ua),
          device:
            match(other_blackberry, ua) ||
            match(other_blackberry_10, ua) ||
            match(other_opera, ua) ||
            match(other_firefox, ua) ||
            match(other_chrome, ua)
        }
      };
      (result.any =
        result.apple.device ||
        result.android.device ||
        result.windows.device ||
        result.other.device),
        // excludes 'other' devices and ipods, targeting touchscreen phones
        (result.phone =
          result.apple.phone || result.android.phone || result.windows.phone),
        (result.tablet =
          result.apple.tablet || result.android.tablet || result.windows.tablet);

      return result;
    }

    if (
      
      module.exports &&
      typeof window === 'undefined'
    ) {
      // Node.js
      module.exports = isMobile;
    } else if (
      
      module.exports &&
      typeof window !== 'undefined'
    ) {
      // Browserify
      module.exports = isMobile();
      module.exports.isMobile = isMobile;
    } else {
      global.isMobile = isMobile();
    }
  })(commonjsGlobal);
  });
  var isMobile_1 = isMobile.isMobile;

  /*!
   * @pixi/settings - v5.1.3
   * Compiled Mon, 09 Sep 2019 04:51:53 UTC
   *
   * @pixi/settings is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  /**
   * The maximum recommended texture units to use.
   * In theory the bigger the better, and for desktop we'll use as many as we can.
   * But some mobile devices slow down if there is to many branches in the shader.
   * So in practice there seems to be a sweet spot size that varies depending on the device.
   *
   * In v4, all mobile devices were limited to 4 texture units because for this.
   * In v5, we allow all texture units to be used on modern Apple or Android devices.
   *
   * @private
   * @param {number} max
   * @returns {number}
   */
  function maxRecommendedTextures(max)
  {
      var allowMax = true;

      if (isMobile.tablet || isMobile.phone)
      {
          allowMax = false;

          if (isMobile.apple.device)
          {
              var match = (navigator.userAgent).match(/OS (\d+)_(\d+)?/);

              if (match)
              {
                  var majorVersion = parseInt(match[1], 10);

                  // All texture units can be used on devices that support ios 11 or above
                  if (majorVersion >= 11)
                  {
                      allowMax = true;
                  }
              }
          }
          if (isMobile.android.device)
          {
              var match$1 = (navigator.userAgent).match(/Android\s([0-9.]*)/);

              if (match$1)
              {
                  var majorVersion$1 = parseInt(match$1[1], 10);

                  // All texture units can be used on devices that support Android 7 (Nougat) or above
                  if (majorVersion$1 >= 7)
                  {
                      allowMax = true;
                  }
              }
          }
      }

      return allowMax ? max : 4;
  }

  /**
   * Uploading the same buffer multiple times in a single frame can cause performance issues.
   * Apparent on iOS so only check for that at the moment
   * This check may become more complex if this issue pops up elsewhere.
   *
   * @private
   * @returns {boolean}
   */
  function canUploadSameBuffer()
  {
      return !isMobile.apple.device;
  }

  /**
   * User's customizable globals for overriding the default PIXI settings, such
   * as a renderer's default resolution, framerate, float precision, etc.
   * @example
   * // Use the native window resolution as the default resolution
   * // will support high-density displays when rendering
   * PIXI.settings.RESOLUTION = window.devicePixelRatio;
   *
   * // Disable interpolation when scaling, will make texture be pixelated
   * PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
   * @namespace PIXI.settings
   */
  var settings = {

      /**
       * If set to true WebGL will attempt make textures mimpaped by default.
       * Mipmapping will only succeed if the base texture uploaded has power of two dimensions.
       *
       * @static
       * @name MIPMAP_TEXTURES
       * @memberof PIXI.settings
       * @type {PIXI.MIPMAP_MODES}
       * @default PIXI.MIPMAP_MODES.POW2
       */
      MIPMAP_TEXTURES: 1,

      /**
       * Default anisotropic filtering level of textures.
       * Usually from 0 to 16
       *
       * @static
       * @name ANISOTROPIC_LEVEL
       * @memberof PIXI.settings
       * @type {number}
       * @default 0
       */
      ANISOTROPIC_LEVEL: 0,

      /**
       * Default resolution / device pixel ratio of the renderer.
       *
       * @static
       * @name RESOLUTION
       * @memberof PIXI.settings
       * @type {number}
       * @default 1
       */
      RESOLUTION: 1,

      /**
       * Default filter resolution.
       *
       * @static
       * @name FILTER_RESOLUTION
       * @memberof PIXI.settings
       * @type {number}
       * @default 1
       */
      FILTER_RESOLUTION: 1,

      /**
       * The maximum textures that this device supports.
       *
       * @static
       * @name SPRITE_MAX_TEXTURES
       * @memberof PIXI.settings
       * @type {number}
       * @default 32
       */
      SPRITE_MAX_TEXTURES: maxRecommendedTextures(32),

      // TODO: maybe change to SPRITE.BATCH_SIZE: 2000
      // TODO: maybe add PARTICLE.BATCH_SIZE: 15000

      /**
       * The default sprite batch size.
       *
       * The default aims to balance desktop and mobile devices.
       *
       * @static
       * @name SPRITE_BATCH_SIZE
       * @memberof PIXI.settings
       * @type {number}
       * @default 4096
       */
      SPRITE_BATCH_SIZE: 4096,

      /**
       * The default render options if none are supplied to {@link PIXI.Renderer}
       * or {@link PIXI.CanvasRenderer}.
       *
       * @static
       * @name RENDER_OPTIONS
       * @memberof PIXI.settings
       * @type {object}
       * @property {HTMLCanvasElement} view=null
       * @property {number} resolution=1
       * @property {boolean} antialias=false
       * @property {boolean} forceFXAA=false
       * @property {boolean} autoDensity=false
       * @property {boolean} transparent=false
       * @property {number} backgroundColor=0x000000
       * @property {boolean} clearBeforeRender=true
       * @property {boolean} preserveDrawingBuffer=false
       * @property {number} width=800
       * @property {number} height=600
       * @property {boolean} legacy=false
       */
      RENDER_OPTIONS: {
          view: null,
          antialias: false,
          forceFXAA: false,
          autoDensity: false,
          transparent: false,
          backgroundColor: 0x000000,
          clearBeforeRender: true,
          preserveDrawingBuffer: false,
          width: 800,
          height: 600,
          legacy: false,
      },

      /**
       * Default Garbage Collection mode.
       *
       * @static
       * @name GC_MODE
       * @memberof PIXI.settings
       * @type {PIXI.GC_MODES}
       * @default PIXI.GC_MODES.AUTO
       */
      GC_MODE: 0,

      /**
       * Default Garbage Collection max idle.
       *
       * @static
       * @name GC_MAX_IDLE
       * @memberof PIXI.settings
       * @type {number}
       * @default 3600
       */
      GC_MAX_IDLE: 60 * 60,

      /**
       * Default Garbage Collection maximum check count.
       *
       * @static
       * @name GC_MAX_CHECK_COUNT
       * @memberof PIXI.settings
       * @type {number}
       * @default 600
       */
      GC_MAX_CHECK_COUNT: 60 * 10,

      /**
       * Default wrap modes that are supported by pixi.
       *
       * @static
       * @name WRAP_MODE
       * @memberof PIXI.settings
       * @type {PIXI.WRAP_MODES}
       * @default PIXI.WRAP_MODES.CLAMP
       */
      WRAP_MODE: 33071,

      /**
       * Default scale mode for textures.
       *
       * @static
       * @name SCALE_MODE
       * @memberof PIXI.settings
       * @type {PIXI.SCALE_MODES}
       * @default PIXI.SCALE_MODES.LINEAR
       */
      SCALE_MODE: 1,

      /**
       * Default specify float precision in vertex shader.
       *
       * @static
       * @name PRECISION_VERTEX
       * @memberof PIXI.settings
       * @type {PIXI.PRECISION}
       * @default PIXI.PRECISION.HIGH
       */
      PRECISION_VERTEX: 'highp',

      /**
       * Default specify float precision in fragment shader.
       * iOS is best set at highp due to https://github.com/pixijs/pixi.js/issues/3742
       *
       * @static
       * @name PRECISION_FRAGMENT
       * @memberof PIXI.settings
       * @type {PIXI.PRECISION}
       * @default PIXI.PRECISION.MEDIUM
       */
      PRECISION_FRAGMENT: isMobile.apple.device ? 'highp' : 'mediump',

      /**
       * Can we upload the same buffer in a single frame?
       *
       * @static
       * @name CAN_UPLOAD_SAME_BUFFER
       * @memberof PIXI.settings
       * @type {boolean}
       */
      CAN_UPLOAD_SAME_BUFFER: canUploadSameBuffer(),

      /**
       * Enables bitmap creation before image load. This feature is experimental.
       *
       * @static
       * @name CREATE_IMAGE_BITMAP
       * @memberof PIXI.settings
       * @type {boolean}
       * @default false
       */
      CREATE_IMAGE_BITMAP: false,

      /**
       * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
       * Advantages can include sharper image quality (like text) and faster rendering on canvas.
       * The main disadvantage is movement of objects may appear less smooth.
       *
       * @static
       * @constant
       * @memberof PIXI.settings
       * @type {boolean}
       * @default false
       */
      ROUND_PIXELS: false,
  };

  /**
   * The NTFluidFilter applies a Fluid effect to an object.<br>
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-fluid}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof PIXI.filters
   * @param {number} [strength=15] - the strength of blur
   */
  var AmoyFluidFilter = /*@__PURE__*/(function (Filter) {
      function AmoyFluidFilter(strength) {
          Filter.call(this);
          this._blurFilter = new PIXI.filters.BlurFilter(strength || 15);
          this._colFilter = new PIXI.filters.ColorMatrixFilter();

          //use this matrix to change alpha value
          this._colFilter.matrix = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,100./255., -12/255.];
          this.resolution = settings.RESOLUTION;

          this.padding = Math.abs(this._blurFilter.blur) * 2;
      }

      if ( Filter ) { AmoyFluidFilter.__proto__ = Filter; }
      AmoyFluidFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyFluidFilter.prototype.constructor = AmoyFluidFilter;

      var prototypeAccessors = { resolution: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyFluidFilter.prototype.apply = function apply (filterManager, input, output) {
          var renderTarget = filterManager.getFilterTexture();
          var renderTarget1 = filterManager.getFilterTexture(input);

          this._blurFilter.apply(filterManager, input, renderTarget, true);
          this._colFilter.apply(filterManager, renderTarget, renderTarget1, true);

          filterManager.applyFilter(this, renderTarget1, output, false);

          filterManager.returnFilterTexture(renderTarget1);
          filterManager.returnFilterTexture(renderTarget);
      };

      /**
       * The resolution of the filter.
       *
       * @member {number}
       */
      prototypeAccessors.resolution.get = function () {
          return this._resolution;
      };

      prototypeAccessors.resolution.set = function (value) {
          this._resolution = value;

          if (this._colFilter) {
              this._colFilter.resolution = value;
          }
          if (this._blurFilter) {
              this._blurFilter.resolution = value;
          }
      };

      Object.defineProperties( AmoyFluidFilter.prototype, prototypeAccessors );

      return AmoyFluidFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-blood-splash - v3.0.25
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-blood-splash is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$i = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$i = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;// 2d texture\n\nuniform float uPosx;\nuniform float uPosy;\nuniform float uTime;\nuniform vec3 uColor;\n\n#define SEED 0.12345679\n#define GRAV vec2(0.,-.26)\n#define SIZE 0.024\n#define DIE_TIME 0.9\n#define PARTICLE_COUNT 120.0\n#define PI 3.14159265359\n\nfloat rand (vec2 p) {\n    return fract(sin(dot(p.xy,vec2(6.8245,7.1248)))*9.1283);\n}\n\nfloat particle(vec2 uv, float identifier, vec2 anchor, vec2 velocity, float creationTime) {\n    float particleTime = max(0., uTime - creationTime);\n\n    float size = max(0., DIE_TIME - particleTime) * SIZE;\n\n    vec2 velocityOffset = velocity * particleTime;\n    vec2 gravityOffset = GRAV * pow(particleTime, 1.798);\n    \n    vec2 point = anchor + velocityOffset + gravityOffset;\n    \n    float dist = distance(uv, point);\n    float hit = smoothstep(size, 0., dist);\n    \n    return hit;\n}\n\nvec3 currentColor() {\n    float c = uTime * 0.2;\n    float r = sin(c * PI) / 2. + .5;\n    float g = sin((c + .6) * PI) / 2. + .5;\n    float b = sin((c + 1.2) * PI) / 2. + .5;\n    return vec3(r, g, b);\n}\n\nvoid main( )\n{\n    vec2 uv = vTextureCoord;\n    vec3 col = vec3(0.);\n\n    \n    for (float i = 0.0; i < PARTICLE_COUNT; i++) {\n        float seed = SEED + floor(i / PARTICLE_COUNT + uTime);\n\n        vec2 anchor = vec2(uPosx/filterArea.x, uPosy/filterArea.y);\n\n        vec2 velocity = vec2(mix(-.5, .5, rand(vec2(seed, i))), mix(-.5, .5, rand(vec2(i, seed) / 3.)));\n\n        float creationTime = uTime - fract(i / PARTICLE_COUNT + uTime);\n\n      col += particle(uv, 0., anchor, velocity, creationTime) * uColor;\n    }\n\n    col = smoothstep(.6, .9, col);\n\n    vec4 tc = texture2D(uSampler, vTextureCoord);\n    gl_FragColor = vec4(col, col.r)*col.r + tc*(1.0 -col.r);\n}";

  /**
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-blood-splash}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   * @param {number} [posx=10.0] light  x position
   * @param {number} [posy=10.0] light  y position
   */

  var AmoyBloodSplashFilter = /*@__PURE__*/(function (Filter) {
      function AmoyBloodSplashFilter(posx, posy, delta, color) {
          if ( posx === void 0 ) { posx = 10.0; }
          if ( posy === void 0 ) { posy = 10.0; }
          if ( delta === void 0 ) { delta=0.; }
          if ( color === void 0 ) { color={r:1.0, g:0, b:0}; }

          Filter.call(this, vertex$i, fragment$i);
          // sub class
          this.posx = posx;
          this.posy = posy;
          this.delta = delta;
          this.uniforms.uColor  = new Float32Array(3);
          this._color = {r:color.r, g:color.g, b:color.b};

      }

      if ( Filter ) { AmoyBloodSplashFilter.__proto__ = Filter; }
      AmoyBloodSplashFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyBloodSplashFilter.prototype.constructor = AmoyBloodSplashFilter;

      var prototypeAccessors = { posx: { configurable: true },color: { configurable: true },delta: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyBloodSplashFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          this.uniforms.uPosx = this.posx <= 0 ? 10.0 : this.posx;
          this.uniforms.uPosy = this.posy <= 0 ? 10.0 : this.posy;
          this.uniforms.uColor[0] = this._color.r;
          this.uniforms.uColor[1] = this._color.g;
          this.uniforms.uColor[2] = this._color.b;
          filterManager.applyFilter(this, input, output, clear);
      };

      /**
       * filter area point x
       * @member {number}
       */
      prototypeAccessors.posx.get = function () {
          return this.uniforms.uPosx;
      };

      prototypeAccessors.posx.set = function (value) {
          this.uniforms.uPosx = value;
      };

      /**
       *  the color of blood
       * @member {object}
       */
      prototypeAccessors.color.get = function (){
          return this._color;
      };

      prototypeAccessors.color.set = function (value) {
          this._color = value;
          this.uniforms.uColor[0] = value.r;
          this.uniforms.uColor[1] = value.g;
          this.uniforms.uColor[2] = value.b;
      };

      /**
       * time for animation
       *
       * @member {number}
       * @default 0.0
       */
      prototypeAccessors.delta.get = function () {
          return this.uniforms.uTime;
      };

      prototypeAccessors.delta.set = function (value) {
          this.uniforms.uTime = value;
      };

      Object.defineProperties( AmoyBloodSplashFilter.prototype, prototypeAccessors );

      return AmoyBloodSplashFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-magnify - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-magnify is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$j = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$j = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;// 2d texture\n\nuniform float uPosx;\nuniform float uPosy;\n\nuniform float uMagnification;\nuniform float uLensRadius;\n\n\nconst float border_thickness = 0.01;\n\nvoid main( )\n{   \n    //Convert to UV coordinates, accounting for aspect ratio\n    vec2 uv = vTextureCoord;\n    float aspect = filterArea.x / filterArea.y;\n    uv.x = uv.x * aspect;\n\n    float lens_radius = uLensRadius / filterArea.y;\n    float magnification = uMagnification;\n    \n    //at the beginning of the sketch, center the magnifying glass.\n    //Thanks to FabriceNeyret2 for the suggestion\n    vec2 mouse = vec2(uPosx, uPosy);\n    if (mouse == vec2(0.0)) {\n        mouse = filterArea.xy / 2.0;\n    }\n    \n    //UV coordinates of mouse\n    vec2 mouse_uv = mouse / filterArea.y;\n    \n    //Distance to mouse\n    float mouse_dist = distance(uv, mouse_uv);\n    \n    //Draw the texture\n\tgl_FragColor = texture2D(uSampler, vTextureCoord);\n    \n    //Draw the outline of the glass\n    if (mouse_dist < lens_radius + border_thickness) {\n        gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0);\n    }\n    \n    //Draw a zoomed-in version of the texture\n    if (mouse_dist < lens_radius) {\n        uv.x = uv.x / aspect;\n        mouse_uv.x = mouse_uv.x / aspect;\n        \n        gl_FragColor = texture2D(uSampler, mouse_uv + (uv - mouse_uv) / magnification);\n    }    \n}";

  /**
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-magnify}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   * @param {number} [posx=10.0] light  x position
   * @param {number} [posy=10.0] light  y position
   * @param {number} [magnification=2.0] magnification
   * @param {number} [lensRadius=10.0] lensRadius
   */

  var AmoyMagnifyFilter = /*@__PURE__*/(function (Filter) {
      function AmoyMagnifyFilter(posx, posy, magnification, lensRadius) {
          if ( posx === void 0 ) { posx = 10.0; }
          if ( posy === void 0 ) { posy = 10.0; }
          if ( magnification === void 0 ) { magnification=2.0; }
          if ( lensRadius === void 0 ) { lensRadius=50.; }

          Filter.call(this, vertex$j, fragment$j);
          // sub class
          this.posx = posx;
          this.posy = posy;
          this.magnification = magnification;
          this.lensRadius = lensRadius;
      }

      if ( Filter ) { AmoyMagnifyFilter.__proto__ = Filter; }
      AmoyMagnifyFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyMagnifyFilter.prototype.constructor = AmoyMagnifyFilter;

      var prototypeAccessors = { posx: { configurable: true },posy: { configurable: true },magnification: { configurable: true },lensRadius: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyMagnifyFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          this.uniforms.uMagnification =  this.magnification;
          this.uniforms.uLensRadius =  this.lensRadius;
          this.uniforms.uPosx = this.posx <= 0 ? 10.0 : this.posx;
          this.uniforms.uPosy = this.posy <= 0 ? 10.0 : this.posy;
          filterManager.applyFilter(this, input, output, clear);
      };

      /**
       * center x pos of lens circle
       */
      prototypeAccessors.posx.get = function () {
          return this.uniforms.uPosx;
      };

      prototypeAccessors.posx.set = function (value) {
          this.uniforms.uPosx = value;
      };

      /**
       * center y pos of lens circle
       */
      prototypeAccessors.posy.get = function () {
          return this.uniforms.uPosy;
      };

      prototypeAccessors.posy.set = function (value) {
          this.uniforms.uPosy = value;
      };

      prototypeAccessors.magnification.get = function () {
          return this.uniforms.uMagnification;
      };

      prototypeAccessors.magnification.set = function (value) {
          this.uniforms.uMagnification = value;
      };

      prototypeAccessors.lensRadius.get = function () {
          return this.uniforms.uLensRadius;
      };

      prototypeAccessors.lensRadius.set = function (value) {
          this.uniforms.uLensRadius = value;
      };

      Object.defineProperties( AmoyMagnifyFilter.prototype, prototypeAccessors );

      return AmoyMagnifyFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-fisheye - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-fisheye is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$k = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$k = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;// 2d texture\n\nconst float PI = 3.1415926535;\n\nvoid main(void)\n{\n    float aperture = 178.0;\n    float apertureHalf = 0.5 * aperture * (PI / 180.0);\n    float maxFactor = sin(apertureHalf);\n    \n    vec2 uv;\n    vec2 xy = 2.0 * vTextureCoord.xy - 1.0;\n    float d = length(xy);\n    if (d < (2.0-maxFactor))\n    {\n        d = length(xy * maxFactor);\n        float z = sqrt(1.0 - d * d);\n        float r = atan(d, z) / PI;\n        float phi = atan(xy.y, xy.x);\n        \n        uv.x = r * cos(phi) + 0.5;\n        uv.y = r * sin(phi) + 0.5;\n    }\n    else\n    {\n        uv = vTextureCoord.xy;\n    }\n    vec4 c = texture2D(uSampler, uv);\n\n    gl_FragColor= c;\n}";

  /**
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-fisheye}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   */

  var AmoyFishEyeFilter = /*@__PURE__*/(function (Filter) {
      function AmoyFishEyeFilter() {
          Filter.call(this, vertex$k, fragment$k);

      }

      if ( Filter ) { AmoyFishEyeFilter.__proto__ = Filter; }
      AmoyFishEyeFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyFishEyeFilter.prototype.constructor = AmoyFishEyeFilter;

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyFishEyeFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          filterManager.applyFilter(this, input, output, clear);
      };

      return AmoyFishEyeFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-barrel-distortion - v3.0.25
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-barrel-distortion is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$l = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$l = "varying vec2 vTextureCoord;//passed from vect shader\n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;// 2d texture\n\nuniform float uBarrelPower;\n\nvec2 Distort(vec2 p)\n{\n    float theta=atan(p.y,p.x);\n    float radius=length(p);\n    radius=pow(radius,uBarrelPower);\n    p.x=radius*cos(theta);\n    p.y=radius*sin(theta);\n    return .5*(p+1.);\n}\n\nvoid main()\n{\n    vec2 xy=2.*vTextureCoord.xy-1.;\n    vec2 uv;\n    float d=length(xy);\n    if(d<1.)\n    {\n        uv=Distort(xy);\n    }\n    else\n    {\n        uv=vTextureCoord.xy;\n    }\n    vec4 c=texture2D(uSampler,uv);\n    gl_FragColor=c;\n}";

  /**
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-barreldistortion}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   */

  var AmoyBarrelDistortionFilter = /*@__PURE__*/(function (Filter) {
      function AmoyBarrelDistortionFilter(barrelPower) {
          if ( barrelPower === void 0 ) { barrelPower=2.0; }

          Filter.call(this, vertex$l, fragment$l);
          this.barrelPower = barrelPower;
      }

      if ( Filter ) { AmoyBarrelDistortionFilter.__proto__ = Filter; }
      AmoyBarrelDistortionFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyBarrelDistortionFilter.prototype.constructor = AmoyBarrelDistortionFilter;

      var prototypeAccessors = { barrelPower: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyBarrelDistortionFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          this.uniforms.uBarrelPower = this.barrelPower;
          filterManager.applyFilter(this, input, output, clear);
      };

      /**
       * barrelPower , the strength of distortion
       * @member {number}
       */
      prototypeAccessors.barrelPower.get = function () {
          return this.uniforms.uBarrelPower;
      };

      prototypeAccessors.barrelPower.set = function (value) {
          this.uniforms.uBarrelPower = value;
      };

      Object.defineProperties( AmoyBarrelDistortionFilter.prototype, prototypeAccessors );

      return AmoyBarrelDistortionFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-clear-background - v3.0.28
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-clear-background is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$m = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$m = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;// 2d texture\n\nuniform vec3 uColor;\nuniform float uOffset;\n\n\nvec3 rgb2hsl(vec3 rgb)\n{\n    float h;\n    float s;\n    float l;\n\n    float maxval = max(rgb.r , max(rgb.g, rgb.b));\n    float minval = min(rgb.r, min(rgb.g, rgb.b));\n    float delta = maxval - minval;\n \n    l = (minval + maxval) / 2.0;\n    s = 0.0;\n    if (l > 0.0 && l < 1.0)\n        s = delta / (l < 0.5 ? 2.0 * l : 2.0 - 2.0 * l);\n    h = 0.0;\n    if (delta > 0.0)\n    {\n        if (rgb.r == maxval && rgb.g != maxval)\n            h += (rgb.g - rgb.b ) / delta;\n        if (rgb.g == maxval && rgb.b != maxval)\n            h += 2.0  + (rgb.b - rgb.r) / delta;\n        if (rgb.b == maxval && rgb.r != maxval)\n            h += 4.0 + (rgb.r - rgb.g) / delta;\n        h *= 60.0;\n    }\n\n    return vec3(h,s,l);\n}\n\n\nvoid main( )\n{\n    vec2 uv = vTextureCoord;\n    vec4 c = texture2D(uSampler, vTextureCoord);\n\n    vec3 hsl;\n    hsl = rgb2hsl(c.rgb);\n\n    vec3 hsl1;\n    hsl1 = rgb2hsl(uColor);\n\n    float a = 1.;\n    if(abs(hsl.x - hsl1.x) < uOffset &&(abs(hsl.y - hsl1.y) < uOffset) && (abs(hsl.z - hsl1.z) < uOffset)){\n        a = 0.0;\n    }\n\n    c *= a;\n    gl_FragColor = c;\n}";

  /**
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-clear-background}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   * @param {object} [{r:1.0, g:0, b:0}] default color for clear
   * @param {number} [offset=5.0] the color offset range [0, 20]
   */

  var AmoyClearBackgroundFilter = /*@__PURE__*/(function (Filter) {
      function AmoyClearBackgroundFilter(color, offset) {
          if ( color === void 0 ) { color={r:1.0, g:0, b:0}; }
          if ( offset === void 0 ) { offset=5.; }

          Filter.call(this, vertex$m, fragment$m);
          // sub class
          this.uniforms.uColor  = new Float32Array(3);
          this.offset = offset;
          this._color = {r:color.r, g:color.g, b:color.b};
      }

      if ( Filter ) { AmoyClearBackgroundFilter.__proto__ = Filter; }
      AmoyClearBackgroundFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyClearBackgroundFilter.prototype.constructor = AmoyClearBackgroundFilter;

      var prototypeAccessors = { color: { configurable: true },offset: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyClearBackgroundFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          this.uniforms.uColor[0] = this._color.r;
          this.uniforms.uColor[1] = this._color.g;
          this.uniforms.uColor[2] = this._color.b;
          this.uniforms.uOffset = this.offset;
          filterManager.applyFilter(this, input, output, clear);
      };

      /**
       *  the color is need to be removed
       * @member {object}
       */
      prototypeAccessors.color.get = function (){
          return this._color;
      };

      prototypeAccessors.color.set = function (value) {
          this._color = value;
          this.uniforms.uColor[0] = value.r;
          this.uniforms.uColor[1] = value.g;
          this.uniforms.uColor[2] = value.b;
      };

      prototypeAccessors.offset.get = function (){
          return this.uniforms.uOffset;
      };

      prototypeAccessors.offset.set = function (value) {
          this.uniforms.uOffset = value;
      };

      Object.defineProperties( AmoyClearBackgroundFilter.prototype, prototypeAccessors );

      return AmoyClearBackgroundFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-pencil-draw - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-pencil-draw is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$n = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$n = "varying vec2 vTextureCoord;//passed from vect shader\n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;// 2d texture\n\n#define PI2 6.28318530717959\n\n#define RANGE 16.\n#define STEP 2.\n#define ANGLENUM 4.\n\n#define MAGIC_GRAD_THRESH .01\n\n//#define MAGIC_COLOR 1.\n\n#define MAGIC_SENSITIVITY     10.\n// #define MAGIC_COLOR           0.5\nuniform float uColorThreshold;\n\n\nvec4 getCol(vec2 pos)\n{\n        vec2 uv = pos/filterArea.xy;\n        return texture2D(uSampler, uv);\n}\n\nfloat getVal(vec2 pos)\n{\n        vec4 c=getCol(pos);\n        return dot(c.xyz, vec3(0.2126, 0.7152, 0.0722));\n}\n\nvec2 getGrad(vec2 pos, float eps)\n{\n        vec2 d=vec2(eps,0);\n        return vec2(\n                getVal(pos+d.xy)-getVal(pos-d.xy),\n                getVal(pos+d.yx)-getVal(pos-d.yx)\n        )/eps/2.;\n}\n\nvec2 pR(vec2 p, float a) {\n        return cos(a)*p + sin(a)*vec2(p.y, -p.x);\n}\n\nfloat absCircular(float t)\n{\n        float a = floor(t + 0.5);\n        return mod(abs(a - t), 1.0);\n}\n\nvoid main(void)\n{\n    vec2 fragCoord=vTextureCoord.xy*filterArea.xy;\n    vec2 pos=fragCoord;\n    float weight=1.;\n    for (float j = 0.; j < ANGLENUM; j += 1.)\n    {\n            vec2 dir = vec2(1, 0);\n            dir = pR(dir, j * PI2 / (2. * ANGLENUM));\n        \n            vec2 grad = vec2(-dir.y, dir.x);\n        \n            for (float i = -RANGE; i <= RANGE; i += STEP)\n            {\n                    vec2 pos2 = pos + normalize(dir)*i;\n            \n                    \n                    if (pos2.y < 0. || pos2.x < 0. || pos2.x > filterArea.x || pos2.y > filterArea.y)\n                    continue;\n            \n                    vec2 g = getGrad(pos2, 1.);\n                    if (length(g) < MAGIC_GRAD_THRESH)\n                    continue;\n            \n                    weight -= pow(abs(dot(normalize(grad), normalize(g))), MAGIC_SENSITIVITY) / floor((2. * RANGE + 1.) / STEP) / ANGLENUM;\n            }\n    }\n    \n    #ifndef GRAYSCALE\n    vec4 col = getCol(pos);\n    #else\n    vec4 col = vec4(getVal(pos));\n    #endif\n    \n    vec4 background = mix(col, vec4(1.), uColorThreshold);\n    \n    float r=length(pos-filterArea.xy*.5)/filterArea.x;\n    float vign=1.-r*r*r;\n    \n    vec4 a=texture2D(uSampler,pos/filterArea.xy);\n    \n    gl_FragColor=vign*mix(vec4(0),background,weight)+a.xxxx/25.;\n    \n}\n";

  /**
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-pencil-draw}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   */

  var AmoyPencilDrawFilter = /*@__PURE__*/(function (Filter) {
      function AmoyPencilDrawFilter(colorThreshold) {
          if ( colorThreshold === void 0 ) { colorThreshold=0.5; }

          Filter.call(this, vertex$n, fragment$n);
          // sub class
          this.colorThreshold = colorThreshold;

      }

      if ( Filter ) { AmoyPencilDrawFilter.__proto__ = Filter; }
      AmoyPencilDrawFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyPencilDrawFilter.prototype.constructor = AmoyPencilDrawFilter;

      var prototypeAccessors = { colorThreshold: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyPencilDrawFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          filterManager.applyFilter(this, input, output, clear);
      };

      prototypeAccessors.colorThreshold.get = function (){
          return this.uniforms.uColorThreshold;
      };

      prototypeAccessors.colorThreshold.set = function (value){
          this.uniforms.uColorThreshold =value;
      };

      Object.defineProperties( AmoyPencilDrawFilter.prototype, prototypeAccessors );

      return AmoyPencilDrawFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-photo-sepia-toning - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-photo-sepia-toning is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$o = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$o = "varying vec2 vTextureCoord;//passed from vect shader\n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;// 2d texture\n\nvoid main(void)\n{\n    vec2 uv=vTextureCoord;\n    vec3 col=texture2D(uSampler,uv).bgr;\n    float y=.3*col.r+.59*col.g+.11*col.b;\n    gl_FragColor=vec4(y+.15,y+.07,y-.12,1.);\n    \n}";

  /**
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-photo-sepia-toning}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   */

  var AmoyPhotoSepiaToningFilter = /*@__PURE__*/(function (Filter) {
      function AmoyPhotoSepiaToningFilter() {
          Filter.call(this, vertex$o, fragment$o);
          // sub class
      }

      if ( Filter ) { AmoyPhotoSepiaToningFilter.__proto__ = Filter; }
      AmoyPhotoSepiaToningFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyPhotoSepiaToningFilter.prototype.constructor = AmoyPhotoSepiaToningFilter;

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyPhotoSepiaToningFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          filterManager.applyFilter(this, input, output, clear);
      };

      return AmoyPhotoSepiaToningFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-warhol - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-warhol is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$p = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$p = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;// 2d texture\n\n\nvoid main(void)\n{\n    vec3 col = texture2D(uSampler, vTextureCoord).bgr;\n    float y = 0.3 *col.r + 0.59 * col.g + 0.11 * col.b;\n    y = y < 0.3 ? 0.0 : (y < 0.6 ? 0.5 : 1.0);\n    if (y == 0.5)\n        col = vec3(0.8, 0.0, 0.0);\n    else if (y == 1.0)\n        col = vec3(0.9, 0.9, 0.0);\n    else\n        col = vec3(0.0, 0.0, 0.0);\n        \n    gl_FragColor.a = 1.0;\n    gl_FragColor.rgb = col;\n\n}";

  /**
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-Warhol}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   * @param {number} [posx=10.0] light  x position
   * @param {number} [posy=10.0] light  y position
   */

  var AmoyWarholFilter = /*@__PURE__*/(function (Filter) {
      function AmoyWarholFilter(posx, posy) {

          Filter.call(this, vertex$p, fragment$p);
          // sub class
      }

      if ( Filter ) { AmoyWarholFilter.__proto__ = Filter; }
      AmoyWarholFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyWarholFilter.prototype.constructor = AmoyWarholFilter;

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyWarholFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          filterManager.applyFilter(this, input, output, clear);
      };

      return AmoyWarholFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-vignette - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-vignette is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$q = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$q = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;// 2d texture\n\n\nvoid main(void)\n{\n    vec3 col = texture2D(uSampler, vTextureCoord).bgr;\n    vec2 p = vTextureCoord;\n    float cr = pow(0.1, 2.0);\n    float pt = pow(p.x - 0.5, 2.0) + pow(p.y - 0.5, 2.0);\n    float d = pt - cr;\n    float cf = 1.0;\n    if (d > 0.0)\n        cf = 1.0 - 2.0 * d;\n    gl_FragColor.a = 1.0;\n    gl_FragColor.rgb = cf * col;\n\n}";

  /**
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-vignette}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   */

  var AmoyVignetteFilter = /*@__PURE__*/(function (Filter) {
      function AmoyVignetteFilter(posx, posy) {

          Filter.call(this, vertex$q, fragment$q);
          // sub class
      }

      if ( Filter ) { AmoyVignetteFilter.__proto__ = Filter; }
      AmoyVignetteFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyVignetteFilter.prototype.constructor = AmoyVignetteFilter;

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyVignetteFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          filterManager.applyFilter(this, input, output, clear);
      };

      return AmoyVignetteFilter;
  }(core.Filter));

  /*!
   * @amoy/filter-colorblind - v3.0.24
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filter-colorblind is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var vertex$r = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

  var fragment$r = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;// 2d texture\n\nuniform int uBlindType;\n\nfloat Protanopia[20] = (0.567,0.433,0,0,0, 0.558,0.442,0,0,0, 0,0.242,0.758,0,0, 0,0,0,1,0, 0,0,0,0,1);\n\nfloat Protanomaly[20] = (0.817,0.183,0,0,0, 0.333,0.667,0,0,0, 0,0.125,0.875,0,0, 0,0,0,1,0, 0,0,0,0,1);\n\nfloat Deuteranopia[20] = (0.625,0.375,0,0,0, 0.7,0.3,0,0,0, 0,0.3,0.7,0,0, 0,0,0,1,0, 0,0,0,0,1);\n\nfloat Deuteranomaly[20] = (0.8,0.2,0,0,0, 0.258,0.742,0,0,0, 0,0.142,0.858,0,0, 0,0,0,1,0, 0,0,0,0,1);\n\nfloat Tritanopia[20] = (0.95,0.05,0,0,0, 0,0.433,0.567,0,0, 0,0.475,0.525,0,0, 0,0,0,1,0, 0,0,0,0,1);\n\nfloat Tritanomaly[20] = (0.967,0.033,0,0,0, 0,0.733,0.267,0,0, 0,0.183,0.817,0,0, 0,0,0,1,0, 0,0,0,0,1);\n\nfloat Achromatopsia[20] = (0.299,0.587,0.114,0,0, 0.299,0.587,0.114,0,0, 0.299,0.587,0.114,0,0, 0,0,0,1,0, 0,0,0,0,1);\n\nfloat Achromatomaly[20] = (0.618,0.320,0.062,0,0, 0.163,0.775,0.062,0,0, 0.163,0.320,0.516,0,0,0,0,0,1,0,0,0,0,0);\n\nfloat fu(n) {\n     return(n<0.?0.:(n<1.0?n:1.0)); \n}\n\nvec4 colorMatrix(vec4 o, int type) { \n    // takes: RGBA object, Matrix array\n    float m[20];\n\n    if(type<=1){\n        m = Protanopia;\n    }else if(type<=2){\n        m = Protanomaly;\n    }\n\n    var r=((o.r*m[0])+(o.g*m[1])+(o.b*m[2])+(o.a*m[3])+m[4]);\n    var g=((o.r*m[5])+(o.g*m[6])+(o.b*m[7])+(o.a*m[8])+m[9]);\n    var b=((o.r*m[10])+(o.g*m[11])+(o.b*m[12])+(o.a*m[13])+m[14]);\n    var a=((o.r*m[15])+(o.g*m[16])+(o.b*m[17])+(o.a*m[18])+m[19]);\n    \n    return vec4(fu(r),fu(g),fu(b),fu(a));\n    \n};\n\n\nvoid main(void)\n{\n    vec4 col = texture2D(uSampler, vTextureCoord);\n\n    gl_FragColor.rgb = colorMatrix(col, uBlindType);\n\n}";

  var AMOY_CLORBLINDE_TYPE_ENUM = {
      Protanopia:1,
      Protanomaly:2,
      Deuteranopia:3,
      Deuteranomaly:4,
      Tritanopia:5,
      Tritanomaly:6,
      Achromatopsia:7,
      Achromatomaly:8
  };

  /**
   * @class
   * @see {@link https://www.npmjs.com/package/@amoy/filter-Warhol}
   * @see {@link https://www.npmjs.com/package/@amoy/filters}
   * @extends PIXI.Filter
   * @memberof AMOY.filters
   */

  var AmoyColorblindFilter = /*@__PURE__*/(function (Filter) {
      function AmoyColorblindFilter() {
          Filter.call(this, vertex$r, fragment$r);
          // sub class
          this.blindType = AMOY_CLORBLINDE_TYPE_ENUM.Protanopia;
      }

      if ( Filter ) { AmoyColorblindFilter.__proto__ = Filter; }
      AmoyColorblindFilter.prototype = Object.create( Filter && Filter.prototype );
      AmoyColorblindFilter.prototype.constructor = AmoyColorblindFilter;

      var prototypeAccessors = { blindType: { configurable: true } };

      /**
       * Override existing apply method in PIXI.Filter
       * @private
       */
      AmoyColorblindFilter.prototype.apply = function apply (filterManager, input, output, clear) {
          filterManager.applyFilter(this, input, output, clear);
      };

      prototypeAccessors.blindType.set = function (value){
          this.uniforms.uBlindType = value;
      };

      prototypeAccessors.blindType.get = function (){
          return this.uniforms.uBlindType;
      };

      Object.defineProperties( AmoyColorblindFilter.prototype, prototypeAccessors );

      return AmoyColorblindFilter;
  }(core.Filter));

  /*!
   * @amoy/filters - v3.0.29
   * Compiled Tue, 03 Dec 2019 14:50:56 UTC
   *
   * @amoy/filters is licensed under the MIT License.
   * http://www.opensource.org/licenses/mit-license
   */

  var filters = /*#__PURE__*/Object.freeze({
    __proto__: null,
    AmoyWaterReflectionFilter: AmoyWaterReflectionFilter,
    AmoyRainfallFilter: AmoyRainfallFilter,
    AmoyPixelVibrationFilter: AmoyPixelVibrationFilter,
    AmoyLight2dFilter: AmoyLight2dFilter,
    AmoyLensHaloFilter: AmoyLensHaloFilter,
    AmoyBrokenCamDistortionFilter: AmoyBrokenCamDistortionFilter,
    AmoyPageCurlFilter: AmoyPageCurlFilter,
    AmoySparksDriftingFilter: AmoySparksDriftingFilter,
    AmoyWhiteBlackSketchFilter: AmoyWhiteBlackSketchFilter,
    AmoyVcrFilter: AmoyVcrFilter,
    AmoyFlameFilter: AmoyFlameFilter,
    AmoyGameboyStyleFilter: AmoyGameboyStyleFilter,
    AmoySnowFilter: AmoySnowFilter,
    AmoyLightSweepFilter: AmoyLightSweepFilter,
    AmoyReflectionFilter: AmoyReflectionFilter,
    AmoyMosaicFilter: AmoyMosaicFilter,
    AmoyWeatherRainyFilter: AmoyWeatherRainyFilter,
    AmoyWeatherCloudFilter: AmoyWeatherCloudFilter,
    AmoyInnerOutlineFilter: AmoyInnerOutlineFilter,
    AmoyFluidFilter: AmoyFluidFilter,
    AmoyBloodSplashFilter: AmoyBloodSplashFilter,
    AmoyMagnifyFilter: AmoyMagnifyFilter,
    AmoyFishEyeFilter: AmoyFishEyeFilter,
    AmoyBarrelDistortionFilter: AmoyBarrelDistortionFilter,
    AmoyClearBackgroundFilter: AmoyClearBackgroundFilter,
    AmoyPencilDrawFilter: AmoyPencilDrawFilter,
    AmoyPhotoSepiaToningFilter: AmoyPhotoSepiaToningFilter,
    AmoyWarholFilter: AmoyWarholFilter,
    AmoyVignetteFilter: AmoyVignetteFilter,
    AMOY_CLORBLINDE_TYPE_ENUM: AMOY_CLORBLINDE_TYPE_ENUM,
    AmoyColorblindFilter: AmoyColorblindFilter
  });

  var EventEmitter = pixi_js.utils.EventEmitter;

  /*global dat,ga*/
  /**
   *  Demo show a bunch of fish and a dat.gui controls
   * @class
   * @extends PIXI.Application
   */
  var DemoApplication = /*@__PURE__*/(function (Application) {
    function DemoApplication() {
      var gui = new dat.GUI();
      gui.useLocalStorage = false;

      // Get the initial dementions for the application
      var domElement = document.querySelector("#container");
      var initWidth = domElement.offsetWidth;
      var initHeight = domElement.offsetHeight;

      Application.call(this, {
        view: document.querySelector("#stage"),
        width: initWidth,
        height: initHeight,
        autoStart: false,
        backgroundColor: 0x000000
      });

      pixi_js.settings.PRECISION_FRAGMENT = "highp";

      this.domElement = domElement;

      this.initWidth = initWidth;
      this.initHeight = initHeight;
      this.animating = true;
      this.rendering = true;
      this.events = new EventEmitter();
      this.animateTimer = 0;
      this.bg = null;
      this.pond = null;
      this.fishCount = 20;
      this.fishes = [];
      this.fishFilters = [];
      this.pondFilters = [];
      this.filterArea = new pixi_js.Rectangle();
      this.padding = 100;
      this.bounds = new pixi_js.Rectangle(
        -this.padding,
        -this.padding,
        initWidth + this.padding * 2,
        initHeight + this.padding * 2
      );

      var app = this;

      this.gui = gui;
      this.gui
        .add(this, "rendering")
        .name("&bull; Rendering")
        .onChange(function (value) {
          if (!value) {
            app.stop();
          } else {
            app.start();
          }
        });
      this.gui.add(this, "animating").name("&bull; Animating");
    }

    if ( Application ) DemoApplication.__proto__ = Application;
    DemoApplication.prototype = Object.create( Application && Application.prototype );
    DemoApplication.prototype.constructor = DemoApplication;

    var prototypeAccessors = { resources: { configurable: true } };

    /**
     * Convenience for getting resources
     * @member {object}
     */
    prototypeAccessors.resources.get = function () {
      return this.loader.resources;
    };

    /**
     * Load resources
     * @param {object} manifest Collection of resources to load
     */
    DemoApplication.prototype.load = function load (manifest, callback) {
      var this$1 = this;

      this.loader.add(manifest).load(function () {
        callback();
        this$1.init();
        this$1.start();
      });
    };

    /**
     * Called when the load is completed
     */
    DemoApplication.prototype.init = function init () {
      var ref = this.loader;
      var resources = ref.resources;
      var ref$1 = this;
      var bounds = ref$1.bounds;
      var initWidth = ref$1.initWidth;
      var initHeight = ref$1.initHeight;

      // Setup the container
      this.pond = new pixi_js.Container();
      this.pond.filterArea = this.filterArea;
      this.pond.filters = this.pondFilters;
      this.stage.addChild(this.pond);

      // Setup the background image
      this.bg = new pixi_js.Sprite(resources.background.texture);
      this.pond.addChild(this.bg);

      // Create and add the fish
      for (var i = 0; i < this.fishCount; i++) {
        var id = "fish" + ((i % 4) + 1);
        var fish = new pixi_js.Sprite(resources[id].texture);
        fish.anchor.set(0.5);
        fish.filters = this.fishFilters;

        fish.direction = Math.random() * Math.PI * 2;
        fish.speed = 2 + Math.random() * 2;
        fish.turnSpeed = Math.random() - 0.8;

        fish.x = Math.random() * bounds.width;
        fish.y = Math.random() * bounds.height;

        fish.scale.set(0.8 + Math.random() * 0.3);
        this.pond.addChild(fish);
        this.fishes.push(fish);
      }

      // Setup the tiling sprite
      this.overlay = new pixi_js.TilingSprite(
        resources.overlay.texture,
        initWidth,
        initHeight
      );

      // Add the overlay
      this.pond.addChild(this.overlay);

      // Handle window resize event
      window.addEventListener("resize", this.handleResize.bind(this));
      this.handleResize();

      // Handle fish animation
      this.ticker.add(this.animate, this);
    };

    /**
     * Resize the demo when the window resizes
     */
    DemoApplication.prototype.handleResize = function handleResize () {
      var ref = this;
      var padding = ref.padding;
      var bg = ref.bg;
      var overlay = ref.overlay;
      var filterArea = ref.filterArea;
      var bounds = ref.bounds;

      var width = this.domElement.offsetWidth;
      var height = this.domElement.offsetHeight;
      var filterAreaPadding = 0;

      // Use equivalent of CSS's contain for the background
      // so that it scales proportionally
      var bgAspect = bg.texture.width / bg.texture.height;
      var winAspect = width / height;

      if (winAspect > bgAspect) {
        bg.width = width;
        bg.height = width / bgAspect;
      } else {
        bg.height = height;
        bg.width = height * bgAspect;
      }

      bg.x = (width - bg.width) / 2;
      bg.y = (height - bg.height) / 2;

      overlay.width = width;
      overlay.height = height;

      bounds.x = -padding;
      bounds.y = -padding;
      bounds.width = width + padding * 2;
      bounds.height = height + padding * 2;

      filterArea.x = filterAreaPadding;
      filterArea.y = filterAreaPadding;
      filterArea.width = width - filterAreaPadding * 2;
      filterArea.height = height - filterAreaPadding * 2;

      this.events.emit("resize", width, height);

      this.renderer.resize(width, height);

      this.render();
    };

    /**
     * Animate the fish, overlay and filters (if applicable)
     * @param {number} delta - % difference in time from last frame render
     */
    DemoApplication.prototype.animate = function animate (delta) {
      this.animateTimer += delta;

      var ref = this;
      var bounds = ref.bounds;
      var animateTimer = ref.animateTimer;
      var overlay = ref.overlay;

      this.events.emit("animate", delta, animateTimer);

      if (!this.animating) {
        return;
      }

      // Animate the overlay
      overlay.tilePosition.x = animateTimer * -1;
      overlay.tilePosition.y = animateTimer * -1;

      for (var i = 0; i < this.fishes.length; i++) {
        var fish = this.fishes[i];

        fish.direction += fish.turnSpeed * 0.01;

        fish.x += Math.sin(fish.direction) * fish.speed;
        fish.y += Math.cos(fish.direction) * fish.speed;

        fish.rotation = -fish.direction - Math.PI / 2;

        if (fish.x < bounds.x) {
          fish.x += bounds.width;
        }
        if (fish.x > bounds.x + bounds.width) {
          fish.x -= bounds.width;
        }
        if (fish.y < bounds.y) {
          fish.y += bounds.height;
        }
        if (fish.y > bounds.y + bounds.height) {
          fish.y -= bounds.height;
        }
      }
    };

    /**
     * Add a new filter
     * @param {string} id Class name
     * @param {object|function} options The class name of filter or options
     * @param {string} [options.id] The name of the PIXI.filters class
     * @param {boolean} [options.global] Filter is in pixi.js
     * @param {array} [options.args] Constructor arguments
     * @param {boolean} [options.fishOnly=false] Apply to fish only, not whole scene
     * @param {boolean} [options.enabled=false] Filter is enabled by default
     * @param {boolean} [options.opened=false] Filter Folder is opened by default
     * @param {function} [oncreate] Function takes filter and gui folder as
     *        arguments and is scoped to the Demo application.
     * @return {PIXI.Filter} Instance of new filter
     */
    DemoApplication.prototype.addFilter = function addFilter (id, options) {
      var this$1 = this;

      if (typeof options === "function") {
        options = { oncreate: options };
      }

      options = Object.assign(
        {
          name: id,
          enabled: false,
          opened: false,
          args: null,
          fishOnly: false,
          global: false,
          oncreate: null
        },
        options
      );

      if (options.global) {
        options.name += " (pixi.js)";
      }

      var app = this;
      var folder = this.gui.addFolder(options.name);
      var ClassRef = filters[id] || pixi_js.filters[id];

      if (!ClassRef) {
        throw ("Unable to find class name with \"" + id + "\"");
      }

      var filter;
      if (options.args) {
        var ClassRefArgs = function(a) {
          ClassRef.apply(this, a);
        };
        ClassRefArgs.prototype = ClassRef.prototype;
        filter = new ClassRefArgs(options.args);
      } else {
        filter = new ClassRef();
      }

      // Set enabled status
      filter.enabled = options.enabled;

      // Track enabled change with analytics
      folder.add(filter, "enabled").onChange(function (enabled) {
        // ga('send', 'event', id, enabled ? 'enabled' : 'disabled');

        app.events.emit("enable", enabled);

        this$1.render();
        if (enabled) {
          folder.domElement.className += " enabled";
        } else {
          folder.domElement.className = folder.domElement.className.replace(
            " enabled",
            ""
          );
        }
      });

      if (options.opened) {
        folder.open();
      }

      if (options.enabled) {
        folder.domElement.className += " enabled";
      }

      if (options.oncreate) {
        options.oncreate.call(filter, folder);
      }

      if (options.fishOnly) {
        this.fishFilters.push(filter);
      } else {
        this.pondFilters.push(filter);
      }

      return filter;
    };

    Object.defineProperties( DemoApplication.prototype, prototypeAccessors );

    return DemoApplication;
  }(pixi_js.Application));

  function clearBackground() {
      var app = this;
      app.addFilter('AmoyClearBackgroundFilter', {
          enabled: false,
          global: false,
          opened: false,
          fishOnly:true,
          oncreate: function oncreate(folder) {
              var filter = this;
              var palette = {
                  _color :[filter.color.r, filter.color.g, filter.color.b],
                  set color(data){
                      this._color = [ data[0], data[1], data[2] ];
                      filter.color = {r:data[0]/255., g:data[1]/255., b:data[2]/255.};
                  },
                  get color(){
                      return this._color;
                  }, // RGB array
              };
              folder.addColor(palette, 'color');

          }
      });
  }

  function rainfall() {
      var app = this;
      app.addFilter('AmoyRainfallFilter', {
          enabled: false,
          global: false,
          opened: false,
          oncreate: function oncreate(folder) {
              var filter = this;

              app.events.on('animate', function() {
                  filter.uniforms.uTime += 0.01;
              });

              folder.add(this, 'rainR', 2, 10);
          }
      });
  }

  function mosaic() {
      var app = this;
      app.addFilter('AmoyMosaicFilter', {
          enabled: false,
          global: false,
          opened: false,
          oncreate: function oncreate(folder) {
              folder.add(this, 'tileSize', 32, 64);
          }
      });
  }

  function pixelVibration() {
      var app = this;
      app.addFilter('AmoyPixelVibrationFilter', {
          enabled: false,
          global: false,
          opened: false,
          fishOnly: true,
          oncreate: function oncreate(folder) {
              folder.add(this, 'intensity', 3, 6);
              folder.add(this, 'blursize', 2, 6);
              folder.add(this, 'threshold', 0, 1);
          }
      });
  }

  function light2d() {
      var app = this;
      app.addFilter('AmoyLight2dFilter', {
          enabled: false,
          global: false,
          opened: false,
          oncreate: function oncreate(folder) {
              var domElement = document.querySelector("#container");
              var initWidth = domElement.offsetWidth;
              var initHeight = domElement.offsetHeight;
              
              folder.add(this, 'posx', 0, initWidth);
              folder.add(this, 'posy', 0, initHeight);
          }
      });
  }

  function lensHalo() {
      var app = this;
      app.addFilter('AmoyLensHaloFilter', {
          enabled: false,
          global: false,
          opened: false,
          oncreate: function oncreate(folder) {
              var filter = this;
              var domElement = document.querySelector("#container");
              var initWidth = domElement.offsetWidth;
              var initHeight = domElement.offsetHeight;
              
              folder.add(this, 'posx', 0, initWidth);
              folder.add(this, 'posy', 0, initHeight);

              app.events.on('animate', function() {
                  filter.uniforms.uTime += 0.01;
              });
          }
      });
  }

  function brokenCamDistortion() {
      var app = this;
      app.addFilter('AmoyBrokenCamDistortionFilter', {
          enabled: false,
          global: false,
          opened: false,
          oncreate: function oncreate(folder) {
              var filter = this;

              app.events.on('animate', function() {
                  filter.uniforms.uTime += 0.01;
              });
          }
      });
  }

  function pageCurl() {
      var app = this;
      var nextPageTexture = this.resources.background.texture;

      app.addFilter('AmoyPageCurlFilter', {
          enabled: false,
          global: false,
          opened: false,
          args:[0, 0, 0, 0, nextPageTexture],
          oncreate: function oncreate(folder) {
              var domElement = document.querySelector("#container");
              var initWidth = domElement.offsetWidth;
              var initHeight = domElement.offsetHeight;
              
              folder.add(this, 'posx', 0, initWidth);
              folder.add(this, 'posy', 0, initHeight);

              folder.add(this, 'startPosx', 0, initWidth);
              folder.add(this, 'startPosy', 0, initHeight);
          }
      });
  }

  function sparksDrifting() {
      var app = this;
      var domElement = document.querySelector("#container");
      var initWidth = domElement.offsetWidth;
      var initHeight = domElement.offsetHeight;

      app.addFilter('AmoySparksDriftingFilter', {
          enabled: false,
          global: false,
          opened: false,
          args:[initHeight, initWidth/3., 2.0],
          oncreate: function oncreate(folder) {
              var filter = this;
              folder.add(this, 'width', initWidth/3., initWidth);
              folder.add(this, 'strength', 2, 5);
              app.events.on('animate', function() {
                  filter.uniforms.uTime += 0.01;
              });
          }
      });
  }

  function whiteBlackSketch() {
      var app = this;
      app.addFilter('AmoyWhiteBlackSketchFilter', {
          enabled: false,
          global: false,
          opened: false,
          args:[false, 0],
          oncreate: function oncreate(folder) {
              var filter = this;
              var domElement = document.querySelector("#container");

              folder.add(this, 'invertColor');

              app.events.on('animate', function() {
                  filter.uniforms.uTime += 0.01;
              });
          }
      });
  }

  function vcr() {
      var app = this;
      app.addFilter('AmoyVcrFilter', {
          enabled: false,
          global: false,
          opened: false,
          oncreate: function oncreate(folder) {
              var filter = this;

              app.events.on('animate', function() {
                  filter.uniforms.uTime += 0.01;
              });
          }
      });
  }

  function flame() {
      var app = this;
      var domElement = document.querySelector("#container");
      var initWidth = domElement.offsetWidth;
      var initHeight = domElement.offsetHeight;

      app.addFilter('AmoyFlameFilter', {
          enabled: false,
          global: false,
          opened: false,
          args:[initWidth/2., initHeight/2., 1.0],
          oncreate: function oncreate(folder) {
              var filter = this;
              folder.add(this, 'posx', 0., initWidth);
              folder.add(this, 'posy', 0., initHeight);
              folder.add(this, 'strength', 1, 5);
              app.events.on('animate', function() {
                  filter.uniforms.uTime += 0.01;
              });
          }
      });
  }

  function gameboyStyle() {
      var app = this;
      app.addFilter('AmoyGameboyStyleFilter', {
          enabled: false,
          global: false,
          opened: false,
          oncreate: function oncreate(folder) {

          }
      });
  }

  function snow() {
      var app = this;
      app.addFilter('AmoySnowFilter', {
          enabled: false,
          global: false,
          opened: false,
          args:[false, 0],
          oncreate: function oncreate(folder) {
              var filter = this;
              var domElement = document.querySelector("#container");

              folder.add(this, 'blizard');

              app.events.on('animate', function() {
                  filter.uniforms.uTime += 0.01;
              });
          }
      });
  }

  function lightSweep() {
      var app = this;
      app.addFilter('AmoyLightSweepFilter', {
          enabled: false,
          global: false,
          opened: false,
          fishOnly: true,
          oncreate: function oncreate(folder) {
              var filter = this;
              app.events.on('animate', function() {
                  filter.uniforms.uTime += 0.01;
              });
          }
      });
  }

  function reflection() {
      var app = this;
      app.addFilter('AmoyReflectionFilter', {
          enabled: false,
          global: false,
          opened: false,
          oncreate: function oncreate(folder) {
          }
      });
  }

  function waterReflection() {
      var app = this;
      app.addFilter('AmoyWaterReflectionFilter', {
          enabled: false,
          global: false,
          opened: false,
          oncreate: function oncreate(folder) {
              var filter = this;
              app.events.on('animate', function() {
                  filter.uniforms.uTime += 0.01;
              });
          }
      });
  }

  function weatherRainy() {
      var app = this;
      app.addFilter('AmoyWeatherRainyFilter', {
          enabled: false,
          global: false,
          opened: false,
          oncreate: function oncreate(folder) {
              var filter = this;
              app.events.on('animate', function() {
                  filter.uniforms.uTime += 0.01;
              });
          }
      });
  }

  function weatherCloud() {
      var app = this;
      app.addFilter('AmoyWeatherCloudFilter', {
          enabled: false,
          global: false,
          opened: false,
          oncreate: function oncreate(folder) {
              var filter = this;
              app.events.on('animate', function() {
                  filter.uniforms.uTime += 0.01;
              });
          }
      });
  }

  function innerOutline() {
      var app = this;
      app.addFilter('AmoyInnerOutlineFilter', {
          enabled: false,
          global: false,
          opened: false,
          oncreate: function oncreate(folder) {
              var filter = this;

              var palette = {
                  _color :[filter.color.r, filter.color.g, filter.color.b],
                  set color(data){
                      this._color = [ data[0], data[1], data[2] ];
                      filter.color = {r:data[0]/255., g:data[1]/255., b:data[2]/255.};
                  },
                  get color(){
                      return this._color;
                  }, // RGB array
              };
              folder.addColor(palette, 'color');

              app.events.on('animate', function() {
                  filter.uniforms.uTime += 0.01;
              });
          }
      });
  }

  function fluid() {
      var app = this;
      var domElement = document.querySelector("#container");
      var initWidth = domElement.offsetWidth;
      var initHeight = domElement.offsetHeight;

      app.addFilter('AmoyFluidFilter', {
          enabled: false,
          global: false,
          opened: false,
          oncreate: function oncreate(folder) {

          }
      });
  }

  function bloodSplash() {
      var app = this;
      app.addFilter('AmoyBloodSplashFilter', {
          enabled: false,
          global: false,
          opened: false,
          fishOnly:true,
          oncreate: function oncreate(folder) {
              var filter = this;
              filter.posx = 50;
              filter.posy = 50;
              var palette = {
                  _color :[filter.color.r, filter.color.g, filter.color.b],
                  set color(data){
                      this._color = [ data[0], data[1], data[2] ];
                      filter.color = {r:data[0]/255., g:data[1]/255., b:data[2]/255.};
                  },
                  get color(){
                      return this._color;
                  }, // RGB array
              };
              folder.addColor(palette, 'color');

              app.events.on('animate', function() {
                  filter.uniforms.uTime += 0.01;
              });
          }
      });
  }

  function magnify() {
      var app = this;
      app.addFilter('AmoyMagnifyFilter', {
          enabled: false,
          global: false,
          opened: false,
          params:[200,100, 2., 50],
          oncreate: function oncreate(folder) {
              var domElement = document.querySelector("#container");
              var initWidth = domElement.offsetWidth;
              var initHeight = domElement.offsetHeight;
              this.uniforms.uMagnification =  1.5;
              this.uniforms.uLensRadius =  90.;
              
              folder.add(this, 'posx', 100, initWidth);
              folder.add(this, 'posy', 100, initHeight);
          }
      });
  }

  function fisheye() {
      var app = this;
      app.addFilter('AmoyFishEyeFilter', {
          enabled: false,
          global: false,
          opened: false,
          oncreate: function oncreate(folder) {
           
          }
      });
  }

  function barrelDistortion() {
      var app = this;
      app.addFilter('AmoyBarrelDistortionFilter', {
          enabled: false,
          global: false,
          opened: false,
          oncreate: function oncreate(folder) {
              folder.add(this, 'barrelPower', 0, 2.);
          }
      });
  }

  function pencilDraw() {
      var app = this;
      app.addFilter('AmoyPencilDrawFilter', {
          enabled: false,
          global: false,
          opened: false,
          oncreate: function oncreate(folder) {
              folder.add(this, 'colorThreshold', 0, .5);
          }
      });
  }

  function photoSepia() {
      var app = this;
      app.addFilter('AmoyPhotoSepiaToningFilter', {
          enabled: false,
          global: false,
          opened: false,
          oncreate: function oncreate(folder) {

          }
      });
  }

  function photoWarhol() {
      var app = this;
      app.addFilter('AmoyWarholFilter', {
          enabled: false,
          global: false,
          opened: false,
          oncreate: function oncreate(folder) {

          }
      });
  }

  function photoVignette() {
      var app = this;
      app.addFilter('AmoyVignetteFilter', {
          enabled: false,
          global: false,
          opened: false,
          oncreate: function oncreate(folder) {

          }
      });
  }

  function colorblind() {
      var app = this;
      app.addFilter('AmoyColorblindFilter', {
          enabled: false,
          global: false,
          opened: false,
          oncreate: function oncreate(folder) {
      
          }
      });
  }



  var filters$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    clear_background: clearBackground,
    rainfall: rainfall,
    mosaic: mosaic,
    pixelVibration: pixelVibration,
    light2d: light2d,
    lensHalo: lensHalo,
    broken_cam_distortion: brokenCamDistortion,
    page_curl: pageCurl,
    sparks_drifting: sparksDrifting,
    white_black_sketch: whiteBlackSketch,
    vcr: vcr,
    flame: flame,
    gameboy_style: gameboyStyle,
    snow: snow,
    light_sweep: lightSweep,
    reflection: reflection,
    water_reflection: waterReflection,
    weather_rainy: weatherRainy,
    weather_cloud: weatherCloud,
    inner_outline: innerOutline,
    fluid: fluid,
    blood_splash: bloodSplash,
    magnify: magnify,
    fisheye: fisheye,
    barrel_distortion: barrelDistortion,
    pencil_draw: pencilDraw,
    photo_sepia: photoSepia,
    photo_warhol: photoWarhol,
    photo_vignette: photoVignette,
    photo_colorblind: colorblind
  });

  var app = new DemoApplication();
  var manifest = [
      { name: 'background', url: 'images/displacement_BG.jpg' },
      { name: 'overlay', url: 'images/overlay.png' },
      { name: 'map', url: 'images/displacement_map.png' },
      { name: 'fish1', url: 'images/displacement_fish1.png' },
      { name: 'fish2', url: 'images/displacement_fish2.png' },
      { name: 'fish3', url: 'images/displacement_fish3.png' },
      { name: 'fish4', url: 'images/displacement_fish4.png' },
      { name: 'lightmap', url: 'images/lightmap.png' },
      { name: 'colormap', url: 'images/colormap.png' }
  ];

  // Load resources then add filters
  app.load(manifest, function () {
      for (var i in filters$1) {
          filters$1[i].call(app);
      }
  });

}(PIXI, PIXI));
//# sourceMappingURL=index.js.map
