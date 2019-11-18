varying vec2 vTextureCoord;//passed from vect shader 

uniform vec4 filterArea;
uniform sampler2D uSampler;// 2d texture

uniform float uPosx;
uniform float uPosy;

uniform float uMagnification;
uniform float uLensRadius;


const float border_thickness = 0.01;

void main( )
{   
    //Convert to UV coordinates, accounting for aspect ratio
    vec2 uv = vTextureCoord;
    float aspect = filterArea.x / filterArea.y;
    uv.x = uv.x * aspect;

    float lens_radius = uLensRadius / filterArea.y;
    float magnification = uMagnification;
    
    //at the beginning of the sketch, center the magnifying glass.
    //Thanks to FabriceNeyret2 for the suggestion
    vec2 mouse = vec2(uPosx, uPosy);
    if (mouse == vec2(0.0)) {
        mouse = filterArea.xy / 2.0;
    }
    
    //UV coordinates of mouse
    vec2 mouse_uv = mouse / filterArea.y;
    
    //Distance to mouse
    float mouse_dist = distance(uv, mouse_uv);
    
    //Draw the texture
	gl_FragColor = texture2D(uSampler, vTextureCoord);
    
    //Draw the outline of the glass
    if (mouse_dist < lens_radius + border_thickness) {
        gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0);
    }
    
    //Draw a zoomed-in version of the texture
    if (mouse_dist < lens_radius) {
        uv.x = uv.x / aspect;
        mouse_uv.x = mouse_uv.x / aspect;
        
        gl_FragColor = texture2D(uSampler, mouse_uv + (uv - mouse_uv) / magnification);
    }    
}