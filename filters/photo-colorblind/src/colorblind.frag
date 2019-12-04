varying vec2 vTextureCoord;//passed from vect shader

uniform vec4 filterArea;
uniform sampler2D uSampler;// 2d texture
uniform float m[20];

float fu(float n){
    return(n<0.?0.:(n<1.?n:1.));
}

vec4 colorMatrix(vec4 o){
    float r=((o.r*m[0])+(o.g*m[1])+(o.b*m[2])+(o.a*m[3])+m[4]);
    float g=((o.r*m[5])+(o.g*m[6])+(o.b*m[7])+(o.a*m[8])+m[9]);
    float b=((o.r*m[10])+(o.g*m[11])+(o.b*m[12])+(o.a*m[13])+m[14]);
    float a=((o.r*m[15])+(o.g*m[16])+(o.b*m[17])+(o.a*m[18])+m[19]);
    
    return vec4(fu(r),fu(g),fu(b),fu(a));
    
}

void main(void)
{
    vec4 col=texture2D(uSampler,vTextureCoord);
    
    gl_FragColor=colorMatrix(col);
    
}