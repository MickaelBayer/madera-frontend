<template lang="pug">
  .home
    .logo
      img(src="../assets/logo.png" height="100%")
    .form
      v-text-field(v-model='mail', label='E-mail', required='')
      v-text-field(v-model='password', label='Mot de passe', required='')
      .forgetPwd Mot de passe oublié
      v-layout(row='', wrap='', justify-end='', class="btnConnexion")
        v-btn(outlined='' right=true color="#409a1b") Connexion
</template>

<script>


export default {
  name: 'Connection',
  components: {
  },
  data() {
    return {
      mail: null,
      password: null
    }
  }
}
</script>

<style lang="sass">
  .home
    display: flex
    flex-direction: column
    height: 100%
    align-items: center
    width: 100%
  .logo
    height: 35vh
    margin: 7vh 0 5vh 0
    width: 100%
  .form
    width: 30vw
  .forgetPwd
    text-decoration: underline
    font-size: 0.8rem
    text-align: left
  .btnConnexion
    margin-top: 3vh
</style>
