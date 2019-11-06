varying vec2 vTextureCoord;//passed from vect shader

uniform sampler2D uSampler;// 2d texture
uniform vec4 filterArea;

uniform float uTime;

void main()
{
	
	vec2 uv=vTextureCoord;
	uv.x *=2.;
	float col=sin(uv.y+uv.x*3.-uTime*6.)*.9;
	col*=col*col*.6;

	col= clamp(col,0.,1.);
	
	vec4 tex=texture2D(uSampler,vTextureCoord);
	if(tex.a < .05){
		discard;
	}
	gl_FragColor=tex+vec4(col,col,col,tex.a);
}