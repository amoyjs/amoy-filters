varying vec2 vTextureCoord;//passed from vect shader 

uniform sampler2D uSampler; // 2d texture
uniform float uTileSize;

void main(void)
{

    vec2 uv = vTextureCoord;

    uv = uv * uTileSize;
   
    uv = floor(uv);
   
    uv = uv / uTileSize;
   
    vec4 tex = texture2D(uSampler, uv);
  
    gl_FragColor = tex;
}
