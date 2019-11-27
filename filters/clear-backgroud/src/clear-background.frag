varying vec2 vTextureCoord;//passed from vect shader 

uniform vec4 filterArea;
uniform sampler2D uSampler;// 2d texture

uniform vec3 uColor;
float vec3 uOffset;

void main( )
{
    vec2 uv = vTextureCoord;
    vec4 c = texture2D(uSampler, vTextureCoord);
    float a = 0.;
    if(abs(c.r-uColor.r) > uOffset || abs(c.g-uColor.g) > uOffset || abs(c.b-uColor.b) > uOffset){
        a = 1.0;
    }

    c.a = a;
    gl_FragColor = c;
}