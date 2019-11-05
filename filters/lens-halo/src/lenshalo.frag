varying vec2 vTextureCoord;//passed from vect shader
uniform sampler2D uSampler;// 2d texture
uniform vec4 filterArea;

uniform float uPosx;
uniform float uPosy;
uniform float uTime;

float noise(float t)
{
	return texture2D(uSampler,vec2(t,0.)/filterArea.xy).x;
}

float noise(vec2 t)
{
	return texture2D(uSampler,(t+vec2(uTime))/filterArea.xy).x;
}

vec3 lenshalo(vec2 uv,vec2 pos)
{
	vec2 m=uv-pos;
	vec2 uvd=uv*(length(uv));
	
	float ang=atan(m.y,m.x);
	float dist=length(m);dist=pow(dist,.1);
	float n=noise(vec2((ang-uTime/9.)*16.,dist*32.));
	
	float f0=1./(length(uv-pos)*16.+1.);
	
	f0=f0+f0*(sin((ang+uTime/18.+noise(abs(ang)+n/2.)*2.)*12.)*.1+dist*.1+.8);
	
	float f2=max(1./(1.+32.*pow(length(uvd+.8*pos),2.)),.0)*.25;
	float f22=max(1./(1.+32.*pow(length(uvd+.85*pos),2.)),.0)*.23;
	float f23=max(1./(1.+32.*pow(length(uvd+.9*pos),2.)),.0)*.21;
	
	vec2 uvx=mix(uv,uvd,-.5);
	
	float f4=max(.01-pow(length(uvx+.4*pos),2.4),.0)*6.;
	float f42=max(.01-pow(length(uvx+.45*pos),2.4),.0)*5.;
	float f43=max(.01-pow(length(uvx+.5*pos),2.4),.0)*3.;
	
	uvx=mix(uv,uvd,-.4);
	
	float f5=max(.01-pow(length(uvx+.2*pos),5.5),.0)*2.;
	float f52=max(.01-pow(length(uvx+.4*pos),5.5),.0)*2.;
	float f53=max(.01-pow(length(uvx+.6*pos),5.5),.0)*2.;
	
	uvx=mix(uv,uvd,-.5);
	
	float f6=max(.01-pow(length(uvx-.3*pos),1.6),.0)*6.;
	float f62=max(.01-pow(length(uvx-.325*pos),1.6),.0)*3.;
	float f63=max(.01-pow(length(uvx-.35*pos),1.6),.0)*5.;
	
	vec3 c=vec3(.0);
	
	c.r+=f2+f4+f5+f6;c.g+=f22+f42+f52+f62;c.b+=f23+f43+f53+f63;
	c+=vec3(f0);
	
	return c;
}

vec3 cc(vec3 color,float factor,float factor2)// color modifier
{
	float w=color.x+color.y+color.z;
	return mix(color,vec3(w)*factor,w*factor2);
}

void main(void)
{
	vec2 uv=vTextureCoord.xy-.5;
	
	uv.x*=filterArea.x/filterArea.y;//fix aspect ratio
	
	vec3 mouse=vec3(vec2(uPosx,uPosy).xy/filterArea.xy-.5,0.);
	
	mouse.x*=filterArea.x/filterArea.y;//fix aspect ratio
	
	vec3 color=vec3(1.4,1.2,1.)*lenshalo(uv,mouse.xy);
	
	color=cc(color,.5,.1);
	
	gl_FragColor=vec4(color,1.)+texture2D(uSampler,vTextureCoord);
}