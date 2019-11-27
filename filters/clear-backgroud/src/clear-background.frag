varying vec2 vTextureCoord;//passed from vect shader 

uniform vec4 filterArea;
uniform sampler2D uSampler;// 2d texture

uniform vec3 uColor;
uniform float uOffset;


vec3 rgb2hsl(vec3 rgb)
{
    float h;
    float s;
    float l;

    float maxval = max(rgb.r , max(rgb.g, rgb.b));
    float minval = min(rgb.r, min(rgb.g, rgb.b));
    float delta = maxval - minval;
 
    l = (minval + maxval) / 2.0;
    s = 0.0;
    if (l > 0.0 && l < 1.0)
        s = delta / (l < 0.5 ? 2.0 * l : 2.0 - 2.0 * l);
    h = 0.0;
    if (delta > 0.0)
    {
        if (rgb.r == maxval && rgb.g != maxval)
            h += (rgb.g - rgb.b ) / delta;
        if (rgb.g == maxval && rgb.b != maxval)
            h += 2.0  + (rgb.b - rgb.r) / delta;
        if (rgb.b == maxval && rgb.r != maxval)
            h += 4.0 + (rgb.r - rgb.g) / delta;
        h *= 60.0;
    }

    return vec3(h,s,l);
}


void main( )
{
    vec2 uv = vTextureCoord;
    vec4 c = texture2D(uSampler, vTextureCoord);

    vec3 hsl;
    hsl = rgb2hsl(c.rgb);

    vec3 hsl1;
    hsl1 = rgb2hsl(uColor);

    float a = 1.;
    if(abs(hsl.x - hsl1.x) < uOffset &&(abs(hsl.y - hsl1.y) < uOffset) && (abs(hsl.z - hsl1.z) < uOffset)){
        a = 0.0;
    }

    c *= a;
    gl_FragColor = c;
}