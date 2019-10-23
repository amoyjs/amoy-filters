varying vec2 vTextureCoord;//passed from vect shader 

uniform sampler2D uSampler;// 2d texture2D
uniform vec4 filterArea;

uniform int uInvertColor;
uniform float uTime;

float rand(float x)
{
    return fract(sin(x)*43758.5453);
}

float triangle(float x)
{
    return abs(1.-mod(abs(x),2.))*2.-1.;
}

void main()
{
    float time=floor(uTime*16.)/16.;
    
    vec2 uv=vTextureCoord;
    
    // pixel position
    vec2 p=uv;
    p+=vec2(triangle(p.y*rand(time)*4.)*rand(time*1.9)*.015,
    triangle(p.x*rand(time*3.4)*4.)*rand(time*2.1)*.015);
    p+=vec2(rand(p.x*3.1+p.y*8.7)*.01,
    rand(p.x*1.1+p.y*6.7)*.01);
    
    // vec2 blurredUV = vec2(p.x+0.003,p.y+0.003);
    // vec4 baseColor = vec4(texture(iChannel0, blurredUV).rgb,1.);

    vec4 baseColor=vec4(texture2D(uSampler,uv).rgb,1.);
    vec4 edges=1.-(baseColor/vec4(texture2D(uSampler,p).rgb,1.));
    
    if(uInvertColor>0){
        baseColor.rgb=vec3(baseColor.r);
        gl_FragColor=baseColor/vec4(length(edges));
    }else{
        gl_FragColor=vec4(length(edges));
    }
}