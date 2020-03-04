
<template lang="pug">
  .modelisation Votre maison à modéliser !
   br
   p Si le panel de modelisation ne s'affiche pas appuyez sur Commencer
   br
   #begin
   v-btn(small="", color="warning" @click="modelisation" id="start") Commencer
    .label
   h3 Action création mur:
   #create
   h4 taille:
   select(id="wallSize")
    option(value=100)  1X1
    option(value=200)  1X2
    option(value=300)  1X3 
    option(value=400)  1X4
    option(value=500)  1X5 
    option(value=600)  1X6 
    option(value=700)  1X7
    option(value=800)  1X8 
   h4 texture:
   select(id="wallTexture")
    option(value="https://www.parquet-terrasse-bois.fr/wp-content/uploads/2018/08/Lambris_bois_epicea_rabote.jpg")  Bois d'épicéa
    option(value="https://www.parquet-terrasse-bois.fr/wp-content/uploads/2019/09/douglas_naturel_elegie_brun_buisson_.jpg")  bois de sapin
    option(value="https://www.parquet-terrasse-bois.fr/wp-content/uploads/2019/01/THERMO-210-600x600.jpg")  Bois de douglas 
    option(value="https://www.parquet-terrasse-bois.fr/wp-content/uploads/2018/09/Brun-buisson-LC75_0017_6004_Classic_LC75_Frontal-300x300.jpg")  Bois de mélèze 
   #Action
   v-btn(small="", color="success" @click="createWall" id="Wall") Créer un mur
     .label
   h3 Action création porte:
   #create
   h4 type:
    br 
    select(id="doorTexture")
       option(value="1") Porte d'entrée
       option(value="2") Porte de garage
       option(value="3") porte coulissante
       option(value="4") porte interieur simple
   #Action
   v-btn(small="", color="success" @click="createDoor" id="Door") Créer une porte
   br 
   v-btn(small="", color="success" @click="createDoor" id="Window") Créer une fénêtre

   .label
   h3 Controles:
   #Controle
    v-btn(small="", color="primary"  id="mouve") Bouger l'élément
    v-btn(small="", color="primary"  id="rotate") Faire une rotation de l'élément
    v-btn(small="", color="primary"  id="scale") Changer la taille de l'élément courant
    v-btn(small="", color="primary"  id="freeMouve") Bouger librement l'élément courant
    v-btn(small="", color="primary"  id="supress") Supprimer dernier élément
   #container
</template>

<script>
import threeModelisation from '../js/ThreeModelisationMaison.js'

export default {
  name: 'ThreeTest',
  methods: {
    modelisation: function(){
      this.$router.go(0);
    }
  }
}
</script>

<style scoped>
select{
  border:solid;
  border-color: darkgray;
  background-color: white;
  border-radius: 50px;

}
button{
  margin:10px;
  }

  body{
     background-image: url("../img/Madera.png");
  }
.modelisation{
  background-color: darkgray;
}
</style>