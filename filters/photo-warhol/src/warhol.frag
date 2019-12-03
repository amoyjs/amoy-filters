varying vec2 vTextureCoord;//passed from vect shader 

uniform vec4 filterArea;
uniform sampler2D uSampler;// 2d texture


void main(void)
{
    vec3 col = texture2D(uSampler, vTextureCoord).bgr;
    float y = 0.3 *col.r + 0.59 * col.g + 0.11 * col.b;
    y = y < 0.3 ? 0.0 : (y < 0.6 ? 0.5 : 1.0);
    if (y == 0.5)
        col = vec3(0.8, 0.0, 0.0);
    else if (y == 1.0)
        col = vec3(0.9, 0.9, 0.0);
    else
        col = vec3(0.0, 0.0, 0.0);
        
    gl_FragColor.a = 1.0;
    gl_FragColor.rgb = col;

}