#version 410
uniform mat4 MVP;//recuperation de la matrice mvp
uniform mat4 MODEL;
layout(location = 0) in vec3 position; // le location permet de dire de quel flux/canal on récupère les données (doit être en accord avec le location du code opengl)
layout (location =3) in vec3 normale;//recuperation des normale
layout (location =2) in vec2 texture;//recuperation des normale
out vec4 color ;
out vec3 fragPosition;
out vec3 fragNormale;
out vec2 TexCoord;
void main(){
    color=vec4(0.,0.,0.,1.0);
    gl_Position= MVP* vec4(position,1.0);
    fragPosition =vec3(MODEL* vec4(position,1.0));
	fragNormale =normale;
    TexCoord=texture;
}