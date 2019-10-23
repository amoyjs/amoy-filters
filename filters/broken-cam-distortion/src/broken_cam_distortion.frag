varying vec2 vTextureCoord;//passed from vect shader 

uniform sampler2D uSampler; // 2d texture
uniform float uTime;

float rand(float co) {
    return fract(sin(dot(co,12.9898+78.233)) * 43758.5453);
}

void main(void) {
	vec2 uv = vTextureCoord;
	vec2 uv1 = uv;
    // Y方向偏移采样颜色
    uv1.y-=rand(uv.x*uTime)/60.;
    vec4 e = texture2D(uSampler,uv1);
    vec4 bn = vec4(vec3(e.r+e.g+e.b)/3.,1.0);
	
	vec2 offset = vec2(0.01*rand(uTime),sin(uTime)/30.);
	e.r = texture2D(uSampler, uv+offset.xy).r;
	e.g = texture2D(uSampler, uv).g;
	e.b = texture2D(uSampler, uv+offset.yx).b;

    if(sin(uTime*rand(uTime))<0.99) {
        // 抖动偏移像素
        gl_FragColor=mix(e,bn,0.6);
    } else {
        // 偶尔显示费抖动像素
        uv.y+=rand(uTime)/(sin(uTime)*10.);
        uv.x-=rand(uTime+2.)/(sin(uTime)*10.)/30.;
        gl_FragColor=texture2D(uSampler,uv);
    }
}