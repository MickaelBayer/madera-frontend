
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
   h4 texture:
   select(id="wallTexture")
    option(value="https://www.parquet-terrasse-bois.fr/wp-content/uploads/2018/08/Lambris_bois_epicea_rabote.jpg")  Bois d'épicéa
    option(value="https://www.majofesa.com/wp-content/uploads/2016/06/FR-sapin-700x330.jpg")  bois de sapin
    option(value="https://www.e-wood.fr/media/catalog/product/cache/c687aa7517cf01e65c009f6943c2b1e9/p/a/packshot_bardage_bois_ivar_douglas_saturateur_authentic_5.jpg")  Bois de douglas 
    option(value="https://www.majofesa.com/wp-content/uploads/2016/06/FR-meleze-700x330.jpg")  Bois de mélèze 
   #Action
   v-btn(small="", color="success" @click="createWall" id="Wall") Créer un mur
   .label
   h3 Controles:
   #Controle
    v-btn(small="", color="primary"  id="mouve") Bouger l'élément
    v-btn(small="", color="primary"  id="rotate") Faire une rotation de l'élément
    v-btn(small="", color="primary"  id="scale") Changer la taille de l'élément courant
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

</style>