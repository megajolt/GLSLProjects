#version 330 compatibility
out vec2 vST; // texture coords
out vec3 vN; // normal vector
out vec3 vL; // vector from point to light
out vec3 vE; // vector from point to eye
out vec3 vMCposition;

const vec3 LIGHTPOSITION = vec3( 5., 5., 0. );

uniform float uNoiseScale;
uniform float Timer;
uniform sampler3D Noise3;

void
main( )
{
	//vST = gl_MultiTexCoord0.st;
	vST=vec2(gl_MultiTexCoord0.s+sin(2.*Timer),gl_MultiTexCoord0.t+sin(2.*Timer));
	vec3 vertexPosition = gl_Vertex.xyz;

    // Calculate texture coordinates based on vertex position
    vec3 textureCoords = vertexPosition * uNoiseScale*sin(2.*Timer); // Scale vertex position

    // Sample displacement value from the 3D texture
    vec3 displacement = texture(Noise3, textureCoords).rgb;

    // Adjust vertex position using displacement
    vertexPosition += displacement; // Displace vertex

	vMCposition = gl_Vertex.xyz;
	vec4 ECposition = gl_ModelViewMatrix * gl_Vertex; // eye coordinate position
	vN = normalize( gl_NormalMatrix * gl_Normal ); // normal vector
	vL = LIGHTPOSITION - ECposition.xyz; // vector from the point to the light position
	vE = vec3( 0., 0., 0. ) - ECposition.xyz; // vector from the point to the eye position
	gl_Position = gl_ModelViewProjectionMatrix * vec4(vertexPosition, 1.0);
}
