varying vec2 vTextureCoord;//passed from vect shader

uniform vec4 filterArea;
uniform sampler2D uSampler;// 2d texture

void main(void)
{
    vec2 uv=vTextureCoord;
    vec3 col=texture2D(uSampler,uv).bgr;
    float y=.3*col.r+.59*col.g+.11*col.b;
    gl_FragColor=vec4(y+.15,y+.07,y-.12,1.);
    
}