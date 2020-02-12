<template lang="pug">
  .home
    .titleConnection Connexion
    .form(v-if="!forgetPwd")
      v-text-field(v-model='mail', label='E-mail', required='')
      v-text-field(v-model='password', label='Mot de passe', required='')
      .forgetPwd(@click="forgetPwd=true") Mot de passe oublié
      v-layout(row='', wrap='', justify-end='', class="btnConnexion")
        v-btn(outlined='', right=true, color="#409a1b", @click='clickLogin') Connexion
    .form(v-if="forgetPwd")
      .titleForget Mot de passe oublié ?
      v-text-field(v-model='mailForgetPwd', label='E-mail', required='')
      v-layout(row='', wrap='', justify-end='', class="btnConnexion")
        v-btn(outlined='', class="cancelForget" right=true, color="#409a1b", @click='forgetPwd = false') Annuler
        v-btn(outlined='', right=true, color="#409a1b", @click='clickForgetPwd') Valider
</template>

<script>
// eslint-disable-next-line import/no-cycle
import userService from '../services/user.service'

export default {
  name: 'connection',
  components: {
  },
  data() {
    return {
      mail: null,
      password: null,
      mailForgetPwd: null,
      forgetPwd: false
    }
  },
  methods: {
    clickLogin() {
      userService.login(this.mail, this.password)
    },
    clickForgetPwd() {
      console.log('mot de passe oublié')
      // todo appeler la fonction pour changer le mot de passe via email
      this.forgetPwd = false
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
    width: 19rem
  .forgetPwd
    text-decoration: underline
    font-size: 1rem
    text-align: left
    cursor: pointer
  .btnConnexion
    margin-top: 3vh
  .cancelForget
    margin-right: 1rem
  .titleConnection
    margin-top: 7rem
    font-weight: bold
    margin-bottom: 4rem
    font-size: 2.4rem
</style>
