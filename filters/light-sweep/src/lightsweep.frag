varying vec2 vTextureCoord;//passed from vect shader

uniform sampler2D uSampler;// 2d texture
uniform vec4 filterArea;

uniform float uTime;

void main()
{
	
	vec2 r=vTextureCoord;
	
	float col=sin(r.y+r.x*3.-uTime*9.)*.9;
	col*=col*col*.6;
	
	col=clamp(col,0.,1.);
	
	vec4 tex=texture2D(uSampler,r);
	
	gl_FragColor=tex+vec4(col);
}