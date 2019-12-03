varying vec2 vTextureCoord;//passed from vect shader

uniform vec4 filterArea;
uniform sampler2D uSampler;// 2d texture

#define PI2 6.28318530717959

#define RANGE 16.
#define STEP 2.
#define ANGLENUM 4.

#define MAGIC_GRAD_THRESH .01

//#define MAGIC_COLOR 1.

#define MAGIC_SENSITIVITY     10.
// #define MAGIC_COLOR           0.5
uniform float uColorThreshold;


vec4 getCol(vec2 pos)
{
        vec2 uv = pos/filterArea.xy;
        return texture2D(uSampler, uv);
}

float getVal(vec2 pos)
{
        vec4 c=getCol(pos);
        return dot(c.xyz, vec3(0.2126, 0.7152, 0.0722));
}

vec2 getGrad(vec2 pos, float eps)
{
        vec2 d=vec2(eps,0);
        return vec2(
                getVal(pos+d.xy)-getVal(pos-d.xy),
                getVal(pos+d.yx)-getVal(pos-d.yx)
        )/eps/2.;
}

vec2 pR(vec2 p, float a) {
        return cos(a)*p + sin(a)*vec2(p.y, -p.x);
}

float absCircular(float t)
{
        float a = floor(t + 0.5);
        return mod(abs(a - t), 1.0);
}

void main(void)
{
    vec2 fragCoord=vTextureCoord.xy*filterArea.xy;
    vec2 pos=fragCoord;
    float weight=1.;
    for (float j = 0.; j < ANGLENUM; j += 1.)
    {
            vec2 dir = vec2(1, 0);
            dir = pR(dir, j * PI2 / (2. * ANGLENUM));
        
            vec2 grad = vec2(-dir.y, dir.x);
        
            for (float i = -RANGE; i <= RANGE; i += STEP)
            {
                    vec2 pos2 = pos + normalize(dir)*i;
            
                    
                    if (pos2.y < 0. || pos2.x < 0. || pos2.x > filterArea.x || pos2.y > filterArea.y)
                    continue;
            
                    vec2 g = getGrad(pos2, 1.);
                    if (length(g) < MAGIC_GRAD_THRESH)
                    continue;
            
                    weight -= pow(abs(dot(normalize(grad), normalize(g))), MAGIC_SENSITIVITY) / floor((2. * RANGE + 1.) / STEP) / ANGLENUM;
            }
    }
    
    #ifndef GRAYSCALE
    vec4 col = getCol(pos);
    #else
    vec4 col = vec4(getVal(pos));
    #endif
    
    vec4 background = mix(col, vec4(1.), uColorThreshold);
    
    float r=length(pos-filterArea.xy*.5)/filterArea.x;
    float vign=1.-r*r*r;
    
    vec4 a=texture2D(uSampler,pos/filterArea.xy);
    
    gl_FragColor=vign*mix(vec4(0),background,weight)+a.xxxx/25.;
    
}
