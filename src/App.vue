<template lang="pug">
  v-app
    Header(ref="foo")
    router-view
    v-btn(small='', v-if='installBtn', @click='installer') Installer l'application Madera
</template>

<script>
  import Header from './components/Header';
export default {
  name: 'App',
  components: {Header},
  data() {
    return {
      installBtn: false,
      installPrompt: null
    }
  },
  created() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      this.installPrompt = e
      this.installBtn = true
    })
  },
  methods: {
    installer() {
      this.installBtn = false
      this.installPrompt.prompt()
      this.installPrompt.userChoice.then((result) => {
        if (result.outcome === 'accepted') {
          console.log('User accepted')
        } else {
          console.log('User denied')
        }
        this.installPrompt = null
      })
    }
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
