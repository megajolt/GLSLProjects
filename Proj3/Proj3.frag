#version 330 compatibility

in vec3 vL; // vector from point to light
in vec3 vE; // vector from point to eye
in vec3 vN;

in vec3 vMC;

uniform float uKa, uKd, uKs; // coefficients of each type of lighting
uniform float uShininess; // specular exponent
uniform vec4 uColor, uSpecularColor;

uniform float uNoiseAmp,uNoiseFreq;
uniform sampler3D Noise3;

vec3
RotateNormal( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;
        // n.x      =  n.x;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize( n );
}

void
main()
{
    vec3 Normal = normalize(vN);
	vec3 Light = normalize(vL);
	vec3 Eye = normalize(vE);

    vec4 nvx = texture( Noise3, uNoiseFreq*vMC );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;	// -1. to +1.
	angx *= uNoiseAmp;

    vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMC.xy,vMC.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;	// -1. to +1.
	angy *= uNoiseAmp;

    vec3 n = RotateNormal( angx, angy, Normal );
    n = normalize(  gl_NormalMatrix * n  );

    vec4 ambient = uKa * uColor;

	float d = max(dot(n,Light),0);
	float s=0;
	if( dot(n,Light) > 0. ) // only do specular if the light can see the point
	{
		vec3 ref = normalize(2. * n * dot(n,Light) - Light); // reflection vector
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec4 diffuse =  uKd * d * uColor;
	vec4 specular = uKs * s * uSpecularColor;

	gl_FragColor = vec4( ambient.rgb + diffuse.rgb + specular.rgb, 1. );

}