varying vec2 vTextureCoord;//passed from vect shader 

uniform sampler2D uSampler;// 2d texture
uniform vec4 filterArea;

uniform float uPosx;
uniform float uPosy;
uniform float uTime;

void main(){
	vec2 fragCoord=vTextureCoord*filterArea.xy;
	vec2 uv=fragCoord.xy/filterArea.xy;
	const float resolution=160.;//步长
	uv=floor(uv*resolution)/resolution;// 0 or 1
	
	vec3 color=texture2D(uSampler,uv).rgb;
	
	float intensity=(color.r+color.g+color.b)/3.;
	int index=int(intensity*4.);

	if(index == 0){
		gl_FragColor=vec4(vec3(15./255., 56./255., 15./255.),1.);
	}else if(index == 1){
		gl_FragColor=vec4(vec3(48./255., 98./255., 48./255.),1.);
	}else if(index == 2){
		gl_FragColor=vec4(vec3(139./255., 172./255., 15./255.),1.);
	}else{
		gl_FragColor=vec4(vec3(155./255., 188./255., 15./255.),1.);
	}
}