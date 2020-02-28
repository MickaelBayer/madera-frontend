<template lang="pug">
  .about
    | Vous êtes sur la section modélisation d'une maison modulaire.
    | Afin d'avoir une expérience au meilleur veuillez suivre les indication des boutons de controle
    .img <a href="#"><img v-bind:src="img" alt="" class="logo"></a>

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