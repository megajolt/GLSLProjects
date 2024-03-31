#version 330 compatibility

uniform float uPower;
uniform float uRtheta;
uniform float uMosaic;
uniform float uBlend;
uniform sampler2D TexUnitA;
uniform sampler2D TexUnitB;

in vec2 vST;
const float PI = 3.14159;
const vec4 BLACK = vec4( 0., 0., 0., 1. );

float
atan2( float y, float x )
{
        if( x == 0. )
        {
                if( y >= 0. )
                        return  PI/2.;
                else
                        return -PI/2.;
        }
        return atan(y,x);
}

void main(){
	vec2 st = vST - vec2(0.5,0.5);  // put (0,0) in the middle so that the range is -0.5 to +0.5
	float r = length(st);
	float rp = pow((2*r),uPower);

	float theta  = atan2( st.t, st.s );
	float thetap = theta - uRtheta * r;


	st = rp * vec2( cos(thetap),sin(thetap) );
	st +=1;
	st *= .5;
	// if s or t end up outside the range [0.,1.], paint the pixel black:

	int numins = int( st.s / uMosaic );
	int numint = int( st.t / uMosaic );
	
	float mosR=uMosaic/2;

	float sc = numins * uMosaic + mosR;
	float tc = numint * uMosaic + mosR;

	st.s=sc;
	st.t=tc;
	if( any( lessThan(st, vec2(0.,0.)) ) )
	{
		gl_FragColor = BLACK;
	}
	else
	{
		if( any( greaterThan(st, vec2(1.,1.)) ) )
		{
			gl_FragColor = BLACK;
		}
		else
		{
			// sample both textures at (s,t) giving back two rgb vec3's:
			vec3 rgbTexA = texture(TexUnitA,st).rgb;
			vec3 rgbTexB = texture(TexUnitB,st).rgb;
			// mix the two rgb's using uBlend
			vec3 rgb=mix(rgbTexA,rgbTexB,uBlend);
			gl_FragColor = vec4( rgb, 1. );
		}
	}
}