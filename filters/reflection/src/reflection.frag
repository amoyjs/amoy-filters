varying vec2 vTextureCoord;//passed from vect shader

uniform sampler2D uSampler;// 2d texture
uniform vec4 filterArea;

void main(void)
{
	vec2 uv;
	uv.x=vTextureCoord.x;
	uv.y=1.-vTextureCoord.y;
	
	gl_FragColor=texture2D(uSampler,uv)*uv.y;
}