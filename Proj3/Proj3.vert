#version 330 compatibility

out vec3 vL; // vector from point to light
out vec3 vE; // vector from point to eye
out vec3 vN;

out vec3 vMC;

uniform float uA,uB,uC,uD;
uniform float uLightX, uLightY, uLightZ;

vec3 lightPosition = vec3(uLightX, uLightY, uLightZ);


void
main( )
{
    float r=sqrt(pow(gl_Vertex.x,2)+pow(gl_Vertex.y,2));
    vec4 dummyCoords=gl_Vertex;
    dummyCoords.z += uA*cos(2.*3.14*uB*r+uC)*exp(-uD*r);
	float drdx=gl_Vertex.x/r;
    float drdy=gl_Vertex.y/r;
    float dzdr=uA*(-sin(2*3.14*uB*r+uC)*2*3.14*uB*exp(-uD*r)+cos(2.*3.14*uB*r+uC)*-uD*exp(-uD*r));

    float dzdx=dzdr*drdy
    float dzdy=dzdr*drdy;

    vec3 Tx= vec3 (1,0,dzdx);
    vec3 Ty= vec3(0,1,dzdy);

    vN=normalize(cross(Tx,Ty));

    vMC = dummyCoords.xyz;
    vec3 ECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
    vL = lightPosition - ECposition.xyz; // vector from the point to the light position
	vE = vec3( 0., 0., 0. ) - ECposition.xyz; // vector from the point to the eye position
    gl_Position = gl_ModelViewProjectionMatrix * dummyCoords;
    
}
