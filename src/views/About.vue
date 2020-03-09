<template lang="pug">
  .about
    | Vous êtes sur la section modélisation d'une maison modulaire.
    | Afin d'avoir une expérience au meilleur veuillez suivre les indication des boutons de controle
    .img <a href="#"><img v-bind:src="img" alt="" class="logo"></a>


    v-btn(small="", color="primary") Mouvement
    .explication
    p permet de déplacer l'élément courant celons un paterne spécifique.
    v-btn(small="", color="primary") Rotation
    .explication
    p permet de faire une rotation de l'élément courant, la rotation peut se faire dans n'importe quel sens.
    v-btn(small="", color="primary") Taille
    .explication
    p permet de changer la taille de l'élément, en largeur, hauteur.
    v-btn(small="", color="primary") Mouvement libre
      .explication
    p permet de faire bouger l'élément courant sans avoir de paterne prédéfini.
    v-btn(small="", color="primary") Supprimer
     .explication
    p Supprime le dernier objet créer, suprime le suivant si recliqué.

</template>
<script>
const imgLink = require('../img/Madera.png')
export default {
    name: 'onepage',
    data(){
        return{
            img: imgLink,
        }
    }
}

</script>