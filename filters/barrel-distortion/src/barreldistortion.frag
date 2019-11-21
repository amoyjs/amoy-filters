varying vec2 vTextureCoord;//passed from vect shader

uniform vec4 filterArea;
uniform sampler2D uSampler;// 2d texture

uniform float uBarrelPower;

vec2 Distort(vec2 p)
{
    float theta=atan(p.y,p.x);
    float radius=length(p);
    radius=pow(radius,uBarrelPower);
    p.x=radius*cos(theta);
    p.y=radius*sin(theta);
    return .5*(p+1.);
}

void main()
{
    vec2 xy=2.*vTextureCoord.xy-1.;
    vec2 uv;
    float d=length(xy);
    if(d<1.)
    {
        uv=Distort(xy);
    }
    else
    {
        uv=vTextureCoord.xy;
    }
    vec4 c=texture2D(uSampler,uv);
    gl_FragColor=c;
}