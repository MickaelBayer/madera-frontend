
<template lang="pug">
  .modelisation Votre maison à modéliser !
   br
   p Si le panel de modelisation ne s'affiche pas appuyez sur Commencer
   br
   #begin
   v-btn(small="", color="warning" @click="modelisation" id="start") Commencer
   #create
   v-btn(small="", color="success" @click="createWall" id="Wall") Créer un mur
   #Control
    v-btn(small="", color="primary" @click="createWall" id="mouve") Bouger l'élément
    v-btn(small="", color="primary" @click="createWall" id="rotate") Faire une rotation de l'élément
    v-btn(small="", color="primary" @click="createWall" id="scale") Changer la taille de l'élément courant
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