varying vec2 vTextureCoord;//passed from vect shader 

uniform sampler2D uSampler;// 2d texture
uniform vec4 filterArea;

uniform float uPosx;
uniform float uPosy;
uniform float uStrength;
uniform float uTime;
//////////////////////
// Fire Flame shader

// procedural noise from IQ
vec2 hash(vec2 p)
{
	p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));
	return-1.+2.*fract(sin(p)*43758.5453123);
}

float noise(in vec2 p)
{
	const float K1=.366025404;// (sqrt(3)-1)/2;
	const float K2=.211324865;// (3-sqrt(3))/6;
	
	vec2 i=floor(p+(p.x+p.y)*K1);
	
	vec2 a=p-i+(i.x+i.y)*K2;
	vec2 o=(a.x>a.y)?vec2(1.,0.):vec2(0.,1.);
	vec2 b=a-o+K2;
	vec2 c=a-1.+2.*K2;
	
	vec3 h=max(.5-vec3(dot(a,a),dot(b,b),dot(c,c)),0.);
	
	vec3 n=h*h*h*h*vec3(dot(a,hash(i+0.)),dot(b,hash(i+o)),dot(c,hash(i+1.)));
	
	return dot(n,vec3(70.));
}

float fbm(vec2 uv)
{
	float f;
	mat2 m=mat2(1.6,1.2,-1.2,1.6);
	f=.5000*noise(uv);uv=m*uv;
	f+=.2500*noise(uv);uv=m*uv;
	f+=.1250*noise(uv);uv=m*uv;
	f+=.0625*noise(uv);uv=m*uv;
	f=.5+.5*f;
	return f;
}

void main()
{
	vec2 fragCoord=vTextureCoord*filterArea.xy;
	vec2 uv=fragCoord.xy/filterArea.xy;
	vec2 q=uv;
	q.y = 1.0 - q.y;
	float strength=uStrength;
	float T3=max(3.,1.25*strength)*uTime;
	q.x-=uPosx/filterArea.x;
	q.y-=uPosy/filterArea.y;
	float n=fbm(strength*q-vec2(0,T3));
	float c=1.-26.*pow(max(0.,length(q*vec2(1.8+q.y*1.5,.75))-n*max(0.,q.y+.25)),1.2);
	float c1=n*c*(1.5-pow(1.50*(1.0 - uv.y),1.2));
	c1=clamp(c1,0.,1.);
	
	vec3 col=vec3(1.5*c1,1.5*c1*c1*c1,c1*c1*c1*c1*c1*c1);
	
	float a=c*(1.-pow(uv.y,3.));
	gl_FragColor=vec4(mix(vec3(0.),col,a),1.)+texture2D(uSampler,vTextureCoord);
}