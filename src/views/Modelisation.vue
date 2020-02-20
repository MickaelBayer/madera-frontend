
<template lang="pug">
  .modelisation Votre maison à modéliser !
   br
   p Si le panel de modelisation ne s'affiche pas appuyer sur Commencer
   br
   v-btn(small="", color="warning" @click="modelisation" id="start") Commencer
   v-btn(small="", color="success" @click="createWall" id="Wall") Créer un mur
   #Control
   div Pour rotationner un bloc appuyer sur E
   div Pour bouger un bloc appuyer sur W
   div restez appuyé sur shift pour coller le bloc a la grille
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