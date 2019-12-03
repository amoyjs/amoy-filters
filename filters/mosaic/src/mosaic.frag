varying vec2 vTextureCoord;//passed from vect shader
uniform vec4 filterArea;
uniform sampler2D uSampler;// 2d texture
uniform float uTileSize;

void main(void)
{
    
    vec2 uv=vTextureCoord;
    if(filterArea.y<filterArea.x){
        uv.y*=filterArea.y/filterArea.x;
    }else{
        uv.x*=filterArea.x/filterArea.y;
    }
    
    uv=uv*uTileSize;
    
    uv=floor(uv);
    
    uv=uv/uTileSize;
    
    vec4 tex=texture2D(uSampler,uv);
    
    gl_FragColor=tex;
}
