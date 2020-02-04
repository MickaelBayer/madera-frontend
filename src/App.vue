<template lang="pug">
  v-app
    router-view
</template>

<script>
export default {
  name: 'App',
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
