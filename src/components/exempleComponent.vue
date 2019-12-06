<template lang="pug">
  #hello
    v-btn(small="", color="error") Primary
    .test(@click="test") {{users}} {{tutu}}
</template>

<script>
import { getAllUsers } from '../misc/dataManager'

export default {
  name: 'exempleComponent',
  props: {
    // variable envoyé par le parent
  },
  components: {
    // mettre ici les composants
  },
  data() {
    return {
      users: null
    }
  },
  computed: {
    // constante modifiable
    tutu() {
      const t = 3
      return t
    }
  },
  async mounted() {
    // fonction appelé dès le lancement de la page
    this.users = await getAllUsers() // appel des données en base de données
  },
  methods: {
    // Inscrire toutes les fonctions ici
    test() {
      console.log('je suis un test')
    }
  }
}
</script>


<style scoped lang="sass">
  h3
    margin: 40px 0 0
  ul
    list-style-type: none
    padding: 0
  li
    display: inline-block
    margin: 0 10px
  a
    color: #42b983
</style>
