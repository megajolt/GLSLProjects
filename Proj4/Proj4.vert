#version 330 compatibility

uniform float uA, uB, uD;

out vec3	vNs;
out vec3	vEs;
out vec3	vMC;


void
main( )
{    
	vMC = gl_Vertex.xyz;
	vec4 newVertex = gl_Vertex;
	float r = sqrt(pow(gl_Vertex.x,2)+pow(gl_Vertex.y,2));
	newVertex.z = uA*cos(2.*3.14*uB*r+0)*exp(-uD*r);

	vec4 ECposition = gl_ModelViewMatrix * newVertex;

	float drdx=gl_Vertex.x/r;
    float drdy=gl_Vertex.y/r;
    float dzdr=uA*(-sin(2*3.14*uB*r+0)*2*3.14*uB*exp(-uD*r)+cos(2.*3.14*uB*r+0)*-uD*exp(-uD*r));
	float dzdx = dzdr*drdy;
	float dzdy = dzdr*drdy;
	vec3 xtangent = vec3 (1,0,dzdx);
	vec3 ytangent = vec3(0,1,dzdy);

	vec3 newNormal = normalize(cross(xtangent,ytangent));
	vNs = newNormal;
	vEs = ECposition.xyz - vec3( 0., 0., 0. ); // vector from the eye position to the point

	gl_Position = gl_ModelViewProjectionMatrix * newVertex;
}