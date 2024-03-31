#version 330 compatibility
// you can set these uniform variables  dynamically or hardwire them:
uniform float uKa, uKd, uKs; // coefficients of each type of lighting
uniform float uShininess; // specular exponent

// in variables from the vertex shader:
in vec2 vST; // texture cords
in vec3 gN; // normal vector
in vec3 gL; // vector from point to light
in vec3 gE; // vector from point to eye
in vec3 vMCposition;

vec3 myColor = vec3(0,.63,.42);
vec3 vSColor = vec3(0.,0.,0.);

void
main( )
{
	vec3 Normal = normalize(gN);
	vec3 Light = normalize(gL);
	vec3 Eye = normalize(gE);
	vec3 mySpecularColor = vec3( 1.,1.,1.);	// whatever default color you'd like
	
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