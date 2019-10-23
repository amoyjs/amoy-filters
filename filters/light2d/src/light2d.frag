varying vec2 vTextureCoord;//passed from vect shader 

uniform vec4 filterArea;
uniform sampler2D uSampler;// 2d texture

uniform float uPosx;
uniform float uPosy;

void main(void)
{
vec2 uv=vTextureCoord;

vec3 col=texture2D(uSampler,uv).xyz;

vec2 fragCoord=vTextureCoord*filterArea.xy;

float lightY=0.1*filterArea.y;

vec3 lightPos=vec3(uPosx,lightY,uPosy);

vec3 lightDir=lightPos-vec3(fragCoord.x,0.,fragCoord.y);

float diffuse=max(dot(normalize(lightDir),vec3(0.,1.,0.)),0.);

gl_FragColor=vec4(col,1.)*diffuse;

}