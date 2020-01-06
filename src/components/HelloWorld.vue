<template lang="pug">
  div
    v-app-bar(color='deep-purple accent-4', dark='')
      v-app-bar-nav-icon
      v-toolbar-title Page title
      v-spacer
      v-btn(icon='')
        v-icon mdi-heart
      v-btn(icon='')
        v-icon mdi-magnify
      v-menu(left='', bottom='')
        template(v-slot:activator='{ on }')
          v-btn(icon='', v-on='on')
            v-icon mdi-dots-vertical
        v-list
          v-list-item(v-for='n in 5', :key='n', @click='')
            v-list-item-title Option {{ n }}
      v-btn(small='', v-if='installBtn', @click='installer') Installer
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
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

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
