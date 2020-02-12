<template lang="pug">
  v-app
    Header
    router-view
</template>

<script>
  import Header from './components/Header';
export default {
  name: 'App',
  components: {Header},
  data() {
    return {
    }
  },
  mounted() {
  }
}
</script>

<style lang="sass">
  #app
    font-family: 'Avenir', Helvetica, Arial, sans-serif
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    text-align: center
    color: #2c3e50

  #nav
    padding: 30px


  #nav a.router-link-exact-active
    color: #42b983
</style>
