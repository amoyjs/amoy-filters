varying vec2 vTextureCoord;//passed from vect shader 

uniform vec4 filterArea;
uniform sampler2D uSampler;// 2d texture

uniform vec3 uColor;

void main( )
{
    vec2 uv = vTextureCoord;
    vec4 c = texture2D(uSampler, vTextureCoord);
    float a = 0.;
    if(c.r-uSampler.r > 0.001 || c.g-uSampler.g > 0.001 || c.b-uSampler.b > 0.001){
        a = c.a;
    }

    c.a = a;
    gl_FragColor = c;
}