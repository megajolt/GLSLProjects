#version 330 compatibility
// you can set these uniform variables  dynamically or hardwire them:
uniform float uKa, uKd, uKs; // coefficients of each type of lighting
uniform float uShininess; // specular exponent
uniform float   uS0, uT0, uD;

// these have to be set dynamically from glman sliders or keytime animations:
uniform float uAd, uBd;
uniform float uTol;

// in variables from the vertex shader:
in vec2 vST; // texture cords
in vec3 vN; // normal vector
in vec3 vL; // vector from point to light
in vec3 vE; // vector from point to eye
in vec3 vMCposition;

vec3 vEColor = vec3(1.,0.,0.);
vec3 vSColor = vec3(1,.5,1.);

void
main( )
{
	vec3 Normal = normalize(vN);
	vec3 Light = normalize(vL);
	vec3 Eye = normalize(vE);
	vec3 myColor = vec3(1,.5,1);		// whatever default color you'd like
	vec3 mySpecularColor = vec3( 1.,1.,1.);	// whatever default color you'd like
	
	float s = vST.s;
	float t = vST.t;
	
	
	float Ar = uAd/2.;
	float Br = uBd/2.;
	
	int numins = int( vST.s / uAd );
	int numint = int( vST.t / uBd );
	
	float sc = numins * uAd + Ar;
	float tc = numint * uBd + Br;
	float d = pow(((s-sc)/Ar),2)+pow(((t-tc)/Br),2);
	float m = smoothstep( 1.-uTol, 1.+uTol, d );
	if(pow(((s-sc)/Ar),2)+pow(((t-tc)/Br),2)<=1){
		myColor=mix( vEColor, vSColor, m );
	}
	// here is the per-fragment lighting:
	vec3 ambient = uKa * myColor;
	float dd = 0.;
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
