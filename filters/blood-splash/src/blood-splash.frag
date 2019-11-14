varying vec2 vTextureCoord;//passed from vect shader 

uniform vec4 filterArea;
uniform sampler2D uSampler;// 2d texture

uniform float uPosx;
uniform float uPosy;
uniform float uTime;
uniform vec3 uColor;

#define SEED 0.12345679
#define GRAV vec2(0.,-.26)
#define SIZE 0.024
#define DIE_TIME 0.9
#define PARTICLE_COUNT 120.0
#define PI 3.14159265359

float rand (vec2 p) {
    return fract(sin(dot(p.xy,vec2(6.8245,7.1248)))*9.1283);
}

float particle(vec2 uv, float identifier, vec2 anchor, vec2 velocity, float creationTime) {
    float particleTime = max(0., uTime - creationTime);

    float size = max(0., DIE_TIME - particleTime) * SIZE;

    vec2 velocityOffset = velocity * particleTime;
    vec2 gravityOffset = GRAV * pow(particleTime, 1.798);
    
    vec2 point = anchor + velocityOffset + gravityOffset;
    
    float dist = distance(uv, point);
    float hit = smoothstep(size, 0., dist);
    
    return hit;
}

vec3 currentColor() {
    float c = uTime * 0.2;
    float r = sin(c * PI) / 2. + .5;
    float g = sin((c + .6) * PI) / 2. + .5;
    float b = sin((c + 1.2) * PI) / 2. + .5;
    return vec3(r, g, b);
}

void main( )
{
    vec2 uv = vTextureCoord;
    vec3 col = vec3(0.);

    
    for (float i = 0.0; i < PARTICLE_COUNT; i++) {
        float seed = SEED + floor(i / PARTICLE_COUNT + uTime);

        vec2 anchor = vec2(uPosx/filterArea.x, uPosy/filterArea.y);

        vec2 velocity = vec2(mix(-.5, .5, rand(vec2(seed, i))), mix(-.5, .5, rand(vec2(i, seed) / 3.)));

        float creationTime = uTime - fract(i / PARTICLE_COUNT + uTime);

      col += particle(uv, 0., anchor, velocity, creationTime) * uColor;
    }

    col = smoothstep(.6, .9, col);

    vec4 tc = texture2D(uSampler, vTextureCoord);
    gl_FragColor = vec4(col, col.r)*col.r + tc*(1.0 -col.r);
}