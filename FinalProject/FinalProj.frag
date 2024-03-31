#version 330 compatibility
// you can set these uniform variables  dynamically or hardwire them:
uniform float uKa, uKd, uKs; // coefficients of each type of lighting
uniform float uShininess; // specular exponent

uniform float uAmp,uPeriod;

// in variables from the vertex shader:
in vec2 vST; // texture cords
in vec3 vN; // normal vector
in vec3 vL; // vector from point to light
in vec3 vE; // vector from point to eye
in vec3 vMCposition;

uniform sampler2D diffuseMap;
uniform sampler2D normalMap;
uniform sampler2D depthMap;
  

vec3 vEColor = vec3(0,.63,.42);
vec3 vSColor = vec3(0.,0.,0.);

#define SIZE 9.0
#define FIXED_SCALE_FACTOR .02
#define BORDER_THICKNESS 0.1  // Adjust this value for thicker borders
vec2 iResolution = vec2(gl_FragCoord.w, gl_FragCoord.z);
#define SF SIZE*FIXED_SCALE_FACTOR
#define SS(l, s) smoothstep(SF + BORDER_THICKNESS, -SF - BORDER_THICKNESS, l - s)

void
main( )
{
	vec3 Normal = normalize(vN);
	vec3 Light = normalize(vL);
	vec3 Eye = normalize(vE);
	vec3 myColor = vec3(0,.3,.13);		// whatever default color you'd like
	vec3 mySpecularColor = vec3( 1.,1.,1.);	// whatever default color you'd like
	vec3 sphereNormal = normalize(vMCposition);

    vec2 normalizedUV = vMCposition.xy;
    float ssf = SF * iResolution.y * 0.004;

    normalizedUV *= SIZE;
    vec2 id = floor(normalizedUV);
    normalizedUV = fract(normalizedUV) - 0.5;

    float mask = 0.0;
    float rmask = 0.0;

    for (int k = 0; k < 9; k++) {
        vec2 P = vec2(k % 3, k / 3) - 1.;
        vec2 rid = id - P;
        vec2 ruv = normalizedUV + P + vec2(0, mod(rid, 2.) * 0.5);

        float l = length(ruv);

        float d = SS(l, 0.75) * (ruv.y + 1.);

        if (d >= mask) {
            mask = d;
            rmask = SS(abs(l - 0.65), SF * iResolution.y * 0.007);
        }
    }
    
    myColor = mix(vEColor, vSColor, rmask);
    float bumpX = (-uAmp * (2.0 * (uPeriod * (-vMCposition.x) - floor(uPeriod * (-vMCposition.x))) - 1.0) + uAmp);
    float bumpY = (-uAmp * (2.0 * (uPeriod * (-vMCposition.y) - floor(uPeriod * (-vMCposition.y))) - 1.0) + uAmp);
    float bumpZ = (-uAmp * (2.0 * (uPeriod * (vMCposition.z) - floor(uPeriod * (vMCposition.z))) - 1.0) + uAmp);
    // Bump mapping
    vec3 bumpvec = vec3(vMCposition.x,uAmp*uPeriod*rmask,uAmp*uPeriod*rmask);
    Normal += bumpvec * Normal;
    Normal = normalize(Normal);
    // here is the per-fragment lighting:
    vec3 ambient = uKa * myColor;
    float dd = max(dot(Normal,Light),0);
    float ss = 0.;
        
    if( dot(Normal,Light) > 0. ) // only do specular if the light can see the point
    {
        dd = dot(Normal,Light);
        vec3 ref = normalize( reflect( -Light, Normal ) ); // reflection vector
        ss = pow( max( dot(Eye,ref),0. ), uShininess );
    }
    vec3 diffuse =  uKd * dd * myColor;
    vec3 specular = uKs * ss * mySpecularColor;

    gl_FragColor = vec4( ambient + diffuse + specular, 1. );
}