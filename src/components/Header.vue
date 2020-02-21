<template lang="pug">
  .topBar(ref="header")
    .logoMadera
      img(src="../assets/logo.png" @click="goHome")
    .btnMyAccount(v-if="$store.state.displayBtnAccount")
      v-btn(large=true color="#409a1b" style="color: white" @click="goToMyAccount") Mon compte
</template>

<script>
  import router from '../router';

  export default {
    name: 'Header',
    data() {
      return {
        displayBtn: false
      }
    },
    mounted() {
      if(this.$store.state.user) this.displayBtn = true
    },
    methods: {
      goToMyAccount(){
        this.$router.push('/account')
      },
      goHome(){
        this.$router.push('/home')
      }
    }
  }
</script>

<style lang="sass" scoped>
  .topBar
    width: 100%
    background: #e5dcd0
    height: 5rem
    position: relative
    display: flex
    box-shadow: 0 2px 10px 0 rgba(166,166,166,1)

  .logoMadera
    position: absolute
    top: 0
    left: 0
    display: flex
    justify-content: center
    align-items: center
    height: 100%

  .logoMadera img
    height: 100%
    margin-top: 0.5rem

  .btnMyAccount
    position: absolute
    right: 1rem
    display: flex
    justify-content: center
    align-items: center
    height: 100%
</style>
