varying vec2 vTextureCoord;//passed from vect shader 

uniform sampler2D uSampler;// 2d texture
uniform sampler2D nextPageTexture;// 2d texture

uniform vec4 filterArea;

uniform float uPosx;
uniform float uPosy;
uniform float uStartPosx;
uniform float uStartPosy;
uniform float uRadius;


#define pi 3.14159265359
//#define uRadius .04

#define iResolution filterArea
#define iTime uTime
#define fragColor gl_FragColor
#define texture texture2D

void main(void)
{
	float aspect=iResolution.x/iResolution.y;
	
	vec2 uv=vTextureCoord*filterArea.xy*vec2(aspect,1.)/iResolution.xy;
	
	vec4 virtualMouse=vec4(uPosx,uPosy,uStartPosx,uStartPosy);
	float radius = uRadius;
	vec2 mouse=virtualMouse.xy*vec2(aspect,1.)/iResolution.xy;
	vec2 mouseDir=normalize(abs(virtualMouse.zw)-virtualMouse.xy);
	vec2 origin=clamp(mouse-mouseDir*mouse.x/mouseDir.x,0.,1.);
	
	float mouseDist=clamp(length(mouse-origin)+(aspect-(abs(virtualMouse.z)/iResolution.x)*aspect)/mouseDir.x,0.,aspect/mouseDir.x);
	
	if(mouseDir.x<0.)
	{
		mouseDist=distance(mouse,origin);
	}
	
	float proj=dot(uv-origin,mouseDir);
	float dist=proj-mouseDist;
	
	vec2 linePoint=uv-dist*mouseDir;
	
	if(dist>radius)
	{
		//下一页面
		fragColor=texture(nextPageTexture,uv*vec2(1./aspect,1.));
		fragColor.rgb*= clamp(min(1.0, .5 + 1. - uRadius/.04), 1.0, pow(clamp((dist-radius)*4.0,0.,1.),.2));
	}
	else if(dist>=0.)
	{
		// 圆柱面点映射
		float theta=asin(dist/radius);
		vec2 p2=linePoint+mouseDir*(pi-theta)*radius;
		vec2 p1=linePoint+mouseDir*theta*radius;
		if(p2.x<=aspect&&p2.y<=1.&&p2.x>0.&&p2.y>0.){
			uv = p2;
			//背面页 圆柱面
			uv = (1.0 - uv*vec2(1./aspect,1.));
			uv.y = 1.0 - uv.y;
			fragColor = texture(nextPageTexture, uv);
			fragColor.rgb*=clamp(min(1.0, .6 + 1. - uRadius/.04), 1.0, pow(clamp((radius-dist)/radius,0.,1.), .5));
			fragColor.a = 1.;
		}else{
			//corer 圆角
			uv = p1;
			fragColor = texture(uSampler, uv * vec2(1. / aspect, 1.));
			fragColor.rgb*=clamp(.95, 1.0, pow(clamp((radius-dist)/radius,0.,1.),1.));
		}
	}
	else
	{
		vec2 p=linePoint+mouseDir*(abs(dist)+pi*radius);
		if(p.x<=aspect&&p.y<=1.&&p.x>0.&&p.y>0.&&length(mouseDir)>0.){
			uv = p ;
			// 背面页平面区域
			uv = (1.0 - uv*vec2(1./aspect,1.));
			uv.y = 1.0 - uv.y;
			fragColor=texture(nextPageTexture,uv);
			fragColor.a = 1.;
		}else{
			// 正面页面
			fragColor=texture(uSampler,uv*vec2(1./aspect,1.));
		}
		
	}
}