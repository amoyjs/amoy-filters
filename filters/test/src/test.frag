varying vec2 vTextureCoord;//passed from vect shader 

uniform sampler2D uSampler; // 2d texture

void main(void)
{

    vec2 uv = vTextureCoord;

    vec4 tex = texture2D(uSampler, uv)*0.5;
  
    gl_FragColor = tex;
}