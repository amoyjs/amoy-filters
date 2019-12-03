varying vec2 vTextureCoord;//passed from vect shader 

uniform vec4 filterArea;
uniform sampler2D uSampler;// 2d texture

uniform int uBlindType;

float Protanopia[20] = (0.567,0.433,0,0,0, 0.558,0.442,0,0,0, 0,0.242,0.758,0,0, 0,0,0,1,0, 0,0,0,0,1);

float Protanomaly[20] = (0.817,0.183,0,0,0, 0.333,0.667,0,0,0, 0,0.125,0.875,0,0, 0,0,0,1,0, 0,0,0,0,1);

float Deuteranopia[20] = (0.625,0.375,0,0,0, 0.7,0.3,0,0,0, 0,0.3,0.7,0,0, 0,0,0,1,0, 0,0,0,0,1);

float Deuteranomaly[20] = (0.8,0.2,0,0,0, 0.258,0.742,0,0,0, 0,0.142,0.858,0,0, 0,0,0,1,0, 0,0,0,0,1);

float Tritanopia[20] = (0.95,0.05,0,0,0, 0,0.433,0.567,0,0, 0,0.475,0.525,0,0, 0,0,0,1,0, 0,0,0,0,1);

float Tritanomaly[20] = (0.967,0.033,0,0,0, 0,0.733,0.267,0,0, 0,0.183,0.817,0,0, 0,0,0,1,0, 0,0,0,0,1);

float Achromatopsia[20] = (0.299,0.587,0.114,0,0, 0.299,0.587,0.114,0,0, 0.299,0.587,0.114,0,0, 0,0,0,1,0, 0,0,0,0,1);

float Achromatomaly[20] = (0.618,0.320,0.062,0,0, 0.163,0.775,0.062,0,0, 0.163,0.320,0.516,0,0,0,0,0,1,0,0,0,0,0);

float fu(n) {
     return(n<0.?0.:(n<1.0?n:1.0)); 
}

vec4 colorMatrix(vec4 o, int type) { 
    // takes: RGBA object, Matrix array
    float m[20];

    if(type<=1){
        m = Protanopia;
    }else if(type<=2){
        m = Protanomaly;
    }

    var r=((o.r*m[0])+(o.g*m[1])+(o.b*m[2])+(o.a*m[3])+m[4]);
    var g=((o.r*m[5])+(o.g*m[6])+(o.b*m[7])+(o.a*m[8])+m[9]);
    var b=((o.r*m[10])+(o.g*m[11])+(o.b*m[12])+(o.a*m[13])+m[14]);
    var a=((o.r*m[15])+(o.g*m[16])+(o.b*m[17])+(o.a*m[18])+m[19]);
    
    return vec4(fu(r),fu(g),fu(b),fu(a));
    
};


void main(void)
{
    vec4 col = texture2D(uSampler, vTextureCoord);

    gl_FragColor.rgb = colorMatrix(col, uBlindType);

}