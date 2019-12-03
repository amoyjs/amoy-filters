varying vec2 vTextureCoord;//passed from vect shader 

uniform vec4 filterArea;
uniform sampler2D uSampler;// 2d texture


void main(void)
{
    vec3 col = texture2D(uSampler, vTextureCoord).bgr;
    vec2 p = vTextureCoord;
    float cr = pow(0.1, 2.0);
    float pt = pow(p.x - 0.5, 2.0) + pow(p.y - 0.5, 2.0);
    float d = pt - cr;
    float cf = 1.0;
    if (d > 0.0)
        cf = 1.0 - 2.0 * d;
    gl_FragColor.a = 1.0;
    gl_FragColor.rgb = cf * col;

}