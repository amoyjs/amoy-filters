varying vec2 vTextureCoord;//passed from vect shader 

uniform sampler2D uSampler;// 2d texture
uniform vec4 filterArea;

uniform int uBlizard;
uniform float uTime;

const mat3 p=mat3(13.323122,23.5112,21.71123,21.1212,28.7312,11.9312,21.8112,14.7212,61.3934);
	
vec3 createSnow(int i,float depth,float width,float speed,float dof,vec2 uv){
	float fi=float(i);
	vec2 q=uv*(1.+fi*depth);
	q+=vec2(q.y*(width*mod(fi*7.238917,1.)-width*.5),speed*uTime/(1.+fi*depth*.03));
	vec3 n=vec3(floor(q),31.189+fi);
	vec3 m=floor(n)*.00001+fract(n);
	vec3 mp=(31415.9+m)/fract(p*m);
	vec3 r=fract(mp);
	vec2 s=abs(mod(q,1.)-.5+.9*r.xy-.45);
	s+=.01*abs(2.*fract(10.*q.yx)-1.);
	float d=.6*max(s.x-s.y,s.x+s.y)+max(s.x,s.y)-.01;
	float edge=.005+.05*min(.5*abs(fi-5.-dof),1.);
	return vec3(smoothstep(edge,-edge,d)*(r.x/(1.+.02*fi*depth)));
}

void main()
{
	vec2 fragCoord=vTextureCoord*filterArea.xy;
	vec2 uv=vec2(1.,filterArea.y/filterArea.x)*fragCoord.xy/filterArea.xy;
	vec3 acc=vec3(0.);
	float dof=5.*sin(uTime*.1);
	if(uBlizard==1){
		for(int i=0;i<100;i++){
			acc+=createSnow(i,.1,.8,-1.5,dof,uv);
		}
	}else{
		for(int i=0;i<50;i++){
			acc+=createSnow(i,.5,.3,-.6,dof,uv);
		}
	}
	gl_FragColor=vec4(vec3(acc),1.) + texture2D(uSampler, vTextureCoord);
}