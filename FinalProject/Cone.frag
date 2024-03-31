#version 330 compatibility
// you can set these uniform variables  dynamically or hardwire them:
uniform float uKa, uKd, uKs; // coefficients of each type of lighting
uniform float uShininess; // specular exponent
uniform float   uS0, uT0, uD;

// these have to be set dynamically from glman sliders or keytime animations:
uniform float uAd, uBd;
uniform float uTol;
uniform float Timer;
uniform sampler2D uTexUnit;

// in variables from the vertex shader:
in vec2 vST; // texture cords
in vec3 vN; // normal vector
in vec3 vL; // vector from point to light
in vec3 vE; // vector from point to eye
in vec3 vMCposition;
void
main( )
{
	vec3 Normal = normalize(vN);
	vec3 Light = normalize(vL);
	vec3 Eye = normalize(vE);

	vec2 uv = vST;

	vec2 n0uvX = vec2(uv.x*1.4+0.01,uv.y+Timer*69);
	vec2 n1uvX = vec2(uv.x*.5-.033,uv.y*2.+Timer*12);
	vec2 n2uvX = vec2(uv.x*.94+.02,uv.y*3.+Timer*61);
	float n0X = (texture(uTexUnit,n0uvX).w-.5)*2;
	float n1X = (texture(uTexUnit,n1uvX).w-.5)*2;
	float n2X = (texture(uTexUnit,n2uvX).w-.5)*2;
	float noiseX = clamp(n0X+n1X+n2X,-1.,1.);

	

	vec2 n0uvY = vec2(uv.x * 0.7 - 0.01, uv.y + Timer * 27);
	vec2 n1uvY = vec2(uv.x * 0.45 + 0.033, uv.y * 1.9 + Timer * 61);
	vec2 n2uvY = vec2(uv.x * 0.8 - 0.02, uv.y * 2.5 + Timer * 51);
	float n0Y = (texture(uTexUnit,n0uvY).w-.5)*2;
	float n1Y = (texture(uTexUnit,n1uvY).w-.5)*2;
	float n2Y = (texture(uTexUnit,n2uvY).w-.5)*2;
	float noiseY = clamp(n0Y+n1Y+n2Y,-1.,1.);

	vec2 finalNoise = vec2(noiseX,noiseY);
	float perturb = (1.-uv.y)*.35+.02;
	finalNoise = (finalNoise*perturb)+uv -.02;
	vec4 noiseColor = vec4(n0Y,n1Y,n2Y,1.);
	vec4 color = texture(uTexUnit,finalNoise);

	color = vec4(color.x * 2.0, color.y * 0.9, (color.y / color.x) * 0.2, 1.0);
	finalNoise = clamp(finalNoise, 0.05, 1.0);
    color.w = texture(uTexUnit, finalNoise).z * 2.0;
    color.w *= texture(uTexUnit, uv).z;

	vec4 myColor = color;
    
	vec4 mySpecularColor = vec4( 1.,1.,1.,1.);	// whatever default color you'd like
	vec4 ambient = uKa * myColor;
	float dd = 0.;
	float ss = 0.;
	if( dot(Normal,Light) > 0. ) // only do specular if the light can see the point
	{
		dd = dot(Normal,Light);
		vec3 ref = normalize( reflect( -Light, Normal ) ); // reflection vector
		ss = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec4 diffuse =  uKd * dd * myColor;
	vec4 specular = uKs * ss * mySpecularColor;
	gl_FragColor = vec4( ambient + diffuse + specular);

}
