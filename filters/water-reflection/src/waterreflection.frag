varying vec2 vTextureCoord;//passed from vect shader

uniform sampler2D uSampler;// 2d texture
uniform vec4 filterArea;

uniform float uTime;

void main()
{
    vec2 uv=vTextureCoord;
    uv.y = 1.- vTextureCoord.y;
    vec4 waterColor=vec4(1.);
    float reflactionY=.3;
    if(uv.y<=reflactionY)
    {
        float oy=uv.y;
        uv.y=2.*reflactionY-uv.y;
        uv.y=uv.y+sin(1./(oy-reflactionY)+uTime*10.)*.003;
        waterColor=vec4(.5882,.7529,.9216,1.);
    }
    
    gl_FragColor=texture2D(uSampler,uv)*waterColor;
}
