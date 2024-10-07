#version 410
uniform vec3 cameraPosition;
uniform mat4 MVP;//recuperation de la matrice mvp
uniform mat4 MODEL;
uniform float silhouette;
uniform float shadType;
uniform float materialShininess;
uniform vec3 materialSpecularColor;
in vec3 fragPosition;
in vec3 fragNormale;
out vec4 finalColor;
in vec4 color;
vec4 ambient;
vec4 Diffuse ;
vec4 speculaire;
uniform samplerCube ourTexture0;
uniform sampler2D ourTexture1;
in vec2 TexCoord;



vec3 CoolColor = vec3(0, 0, 0.6);
vec3 WarmColor = vec3(0.6, 0.6, 0);
uniform struct Light {vec3 position ;
                      vec3 intensities;
                      float ambientCoefficient;
                      float attenuation ;} 
                      
                      light;

void main() 
{
    ambient=vec4(light.intensities,1.0)*light.ambientCoefficient;

    vec3 LIGHT_DIRECTION= normalize(light.position-fragPosition); 
    vec3 normale = normalize(transpose(inverse(mat3(MODEL)))*fragNormale);

    // diffuse parameters
    float diffcoef = max(dot(normale, LIGHT_DIRECTION), 0.0);
    vec3 DV= normalize(cameraPosition-fragPosition);

    // for silhouette checking
    float VDCOEFF=max(dot(normale, DV), 0.0);

    // specular parameters
    vec3 reflectDir = reflect(-LIGHT_DIRECTION, normale);
    float spec_term = pow(max(dot(reflectDir, DV), 0.0), materialShininess) ;
    vec4 specular =vec4( spec_term*materialSpecularColor,1.0);

   float DiffCool = 0.0;
   float DiffWarm = 0.0;
   vec3 CoolColor = vec3(0, 0, 0.6);
   vec3 WarmColor = vec3(0.6, 0.6, 0);  

   vec3 kcool = min(CoolColor + DiffCool * light.intensities, 1.0);
   vec3 kwarm = min(WarmColor + DiffWarm * light.intensities, 1.0);
   float NdotL=(dot(LIGHT_DIRECTION,normale)+1)*0.5;
   vec3 kfinal = mix(kcool, kwarm, NdotL);
   vec4 gooch = vec4(min(kfinal + spec_term, 1.0), 1.0);
vec4 FinalCOL =  vec4(0, 0, 0,0);  ;


   if(shadType==0.0)
   { // toon shader
  if(diffcoef<0.15)
        Diffuse =vec4(0.13, 0.22, 0.22,1.0); 
        else
          if(diffcoef<0.25)
            Diffuse =vec4(0.33, 0.22, 0.22,1.0);
            else
            if(diffcoef<0.50)
                Diffuse =vec4(0.43, 0.22, 0.22,1.0);
                else
            if(diffcoef<0.70)
                Diffuse =vec4(0.68, 0.22, 0.22,1.0);
                else
                if(diffcoef<0.85)
                  Diffuse =vec4(0.73, 0.22, 0.22,1.0);
                    else
                    Diffuse =vec4(light.intensities,1.0);
     
     FinalCOL = (Diffuse+ambient+specular);
    
   }

   // gooch shader
   if(shadType==1.0)
   { 

   
    FinalCOL = gooch;
   } 

   // envirenement map
   if(shadType==2.0){ 
        
         FinalCOL = texture(ourTexture0, reflectDir);

   }
// envirenement map+ toon shader
   if(shadType==3.0){ 
       if(diffcoef<0.15)
        Diffuse =vec4(0.13, 0.22, 0.22,1.0); 
        else
          if(diffcoef<0.25)
            Diffuse =vec4(0.33, 0.22, 0.22,1.0);
            else
            if(diffcoef<0.50)
                Diffuse =vec4(0.43, 0.22, 0.22,1.0);
                else
            if(diffcoef<0.70)
                Diffuse =vec4(0.68, 0.22, 0.22,1.0);
                else
                if(diffcoef<0.85)
                  Diffuse =vec4(0.73, 0.22, 0.22,1.0);
                    else
                    Diffuse =vec4(light.intensities,1.0);

        
         FinalCOL = (Diffuse+ambient+specular)*mix(texture(ourTexture0,reflectDir),texture(ourTexture1,TexCoord),silhouette);

   }
      // envirenement map+ gooch shader
      if(shadType==4.0){ 
        
      

         Diffuse = gooch;
         FinalCOL = (Diffuse+ambient)*mix(texture(ourTexture0,reflectDir),texture(ourTexture1,TexCoord),silhouette);

   }
    

 


    if (gl_FrontFacing) {
    if(silhouette==1.0 && VDCOEFF < 0.3)


                         finalColor=vec4(0, 0, 0, 1);

    else                  
                         finalColor=FinalCOL;

                         
                         
}else{

    finalColor=vec4(0, 0, 0, 1);

}

}