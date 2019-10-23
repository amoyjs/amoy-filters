varying vec2 vTextureCoord;//passed from vect shader 

uniform vec4 filterArea;

uniform sampler2D uSampler; // 2d texture

uniform float uIntensity;
uniform float uBlursize;
uniform float uThreshold;

#define T(t, c, u, v, m) texture2D(t, c + vec2(u, v), m)

vec4 B(in vec2 C, in sampler2D X, in float m)
{
	vec2 d = m / filterArea.xy;
    
    vec4  c = texture2D(X, C, m);
    c += T(X, C,  d.x, 0.0, m);    	
    c += T(X, C, -d.x, 0.0, m);    	
    c += T(X, C, 0.0,  d.y, m);    	
    c += T(X, C, 0.0, -d.y, m);    	
    c += T(X, C,  d.x, d.y, m);    	
    c += T(X, C, -d.x, d.y, m);    	
    c += T(X, C,  d.x,-d.y, m);    	
    c += T(X, C, -d.x,-d.y, m);    
    return c / 9.0;
}

int modi(int x, int y) {
    return x - y * (x / y);
}

int and(int a, int b) {
    int result = 0;
    int n = 1;
	const int BIT_COUNT = 32;

    for(int i = 0; i < BIT_COUNT; i++) {
        if ((modi(a, 2) == 1) && (modi(b, 2) == 1)) {
            result += n;
        }

        a = a / 2;
        b = b / 2;
        n = n * 2;

        if (!(a > 0 && b > 0))
            break;
    }
    return result;
}

vec4 vibrance(vec4 inCol, float vibrance) //r,g,b 0.0 to 1.0,  vibrance 1.0 no change, 0.0 image B&W.
{
    vec4 outCol;
    if (vibrance <= 1.0)
    {
        float avg = dot(inCol.rgb, vec3(0.3, 0.6, 0.1));
        outCol.rgb = mix(vec3(avg), inCol.rgb, vibrance); 
    }
    else // vibrance > 1.0
    {
        float hue_a, a, f, p1, p2, p3, i, h, s, v, amt, _max, _min, dlt;
        float br1, br2, br3, br4, br5, br2_or_br1, br3_or_br1, br4_or_br1, br5_or_br1;
        int use;

        _min = min(min(inCol.r, inCol.g), inCol.b);
        _max = max(max(inCol.r, inCol.g), inCol.b);
        dlt = _max - _min + 0.00001 /*Hack to fix divide zero infinities*/;
        h = 0.0;
        v = _max;

		br1 = step(_max, 0.0);
        s = (dlt / _max) * (1.0 - br1);
        h = -1.0 * br1;

		br2 = 1.0 - step(_max - inCol.r, 0.0); 
        br2_or_br1 = max(br2, br1);
        h = ((inCol.g - inCol.b) / dlt) * (1.0 - br2_or_br1) + (h*br2_or_br1);

		br3 = 1.0 - step(_max - inCol.g, 0.0); 
        
        br3_or_br1 = max(br3, br1);
        h = (2.0 + (inCol.b - inCol.r) / dlt) * (1.0 - br3_or_br1) + (h*br3_or_br1);

        br4 = 1.0 - br2*br3;
        br4_or_br1 = max(br4, br1);
        h = (4.0 + (inCol.r - inCol.g) / dlt) * (1.0 - br4_or_br1) + (h*br4_or_br1);

        h = h*(1.0 - br1);

        hue_a = abs(h); // between h of -1 and 1 are skin tones
        a = dlt;      // Reducing enhancements on small rgb differences

        // Reduce the enhancements on skin tones.    
        a = step(1.0, hue_a) * a * (hue_a * 0.67 + 0.33) + step(hue_a, 1.0) * a;                                    
        a *= (vibrance - 1.0);
        s = (1.0 - a) * s + a * pow(s, 0.25);

        i = floor(h);
        f = h - i;

        p1 = v * (1.0 - s);
        p2 = v * (1.0 - (s * f));
        p3 = v * (1.0 - (s * (1.0 - f)));

        inCol.rgb = vec3(0.0); 
        i += 6.0;
        //use = 1 << ((int)i % 6);
        use = int(pow(2.0,mod(i,6.0)));
        a = float(and(use , 1)); // i == 0;
        use = use / 2;
        inCol.rgb += a * vec3(v, p3, p1);

        a = float(and(use , 1)); // i == 1;
        use = use / 2;
        inCol.rgb += a * vec3(p2, v, p1); 

        a = float( and(use,1)); // i == 2;
        use = use / 2;
        inCol.rgb += a * vec3(p1, v, p3);

        a = float(and(use, 1)); // i == 3;
        use = use / 2;
        inCol.rgb += a * vec3(p1, p2, v);

        a = float(and(use, 1)); // i == 4;
        use = use / 2;
        inCol.rgb += a * vec3(p3, p1, v);

        a = float(and(use, 1)); // i == 5;
        use = use / 2;
        inCol.rgb += a * vec3(v, p1, p2);

        outCol = inCol;
    }
    return outCol;
}

vec4 mainImage()
{
    float t = uThreshold, // threshold
	 	  I = uIntensity, // intensity
          b = uBlursize; // blursize

    vec4 c = texture2D(uSampler, vTextureCoord);//采样
    vec4 H = clamp(B(vTextureCoord, uSampler, b) - t, 0.0, 1.0) * 1.0 / (1.0 - t); // highlight
    vec4 imgC = 1.0 - (1.0 - c) * (1.0 - H * I); //Screen Blend Mode
    
    imgC = vibrance(imgC, 2.0);
    return imgC;
}

void main(void)
{ 
    gl_FragColor = mainImage();
}