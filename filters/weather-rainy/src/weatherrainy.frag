varying vec2 vTextureCoord;//passed from vect shader

uniform sampler2D uSampler;// 2d texture
uniform vec4 filterArea;

uniform float uTime;

float rand(vec2 p){
	p+=.2127+p.x+.3713*p.y;
	vec2 r=4.789*sin(789.123*(p));
	return fract(r.x*r.y);
}
//sample noise
float sn(vec2 p){
	vec2 i=floor(p-.5);
	vec2 f=fract(p-.5);
	f=f*f*f*(f*(f*6.-15.)+10.);
	float rt=mix(rand(i),rand(i+vec2(1.,0.)),f.x);
	float rb=mix(rand(i+vec2(0.,1.)),rand(i+vec2(1.,1.)),f.x);
	return mix(rt,rb,f.y);
}

void main(void)
{
	vec2 uv=vTextureCoord;
	uv.y = 1.0 - uv.y;
	vec2 newUV=uv;
	newUV.x-=uTime*.3;
	newUV.y+=uTime*3.;
	float strength=sin(uTime*.5+sn(newUV))*.1+.2;
	float rain=sn(vec2(newUV.x*20.1,newUV.y*40.1+newUV.x*400.1-20.*strength));
	float rain2=sn(vec2(newUV.x*45.+uTime*.5,newUV.y*30.1+newUV.x*100.1));
	rain=strength-rain;
	rain+=rain2*(sin(strength)-.4)*2.;
	rain=clamp(rain,0.,.5)*.8;
	
	gl_FragColor=vec4(vec3(rain),1.)+texture2D(uSampler,vTextureCoord);
}