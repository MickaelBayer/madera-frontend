<template lang="pug">
  .firstConnection
    .firstConnectionTitle Changement de mot de passe
    .form
      v-text-field(v-model='newPwd1', type='password' label='Nouveau mot de passe')
      v-text-field(v-model='newPwd2', type='password' label='Confirmation nouveau mot de passe')
      br
      v-layout(row='', wrap='', justify-end='', class="btnCreate")
        v-btn(outlined='', right=true, color="#409a1b", @click='updPassword()') Enregistrer
    v-alert(:type='resultRequest.status' width="100%" class="alertMyAccount" :icon="resultRequest.icon" v-if="resultRequest")
      | {{resultRequest.msg}}
</template>

<script>
  import userService from '../services/user.service';
  export default {
    name: 'myAccount',
    components: {
    },
    data() {
      return {
        newPwd1: null,
        user: null,
        userId: null,
        newPwd2: null,
        resultRequest: null,
      }
    },
    async mounted() {
      this.userId = this.$store.state.user.userID
    },
    methods: {
      logout(){
        userService.logout();
      },
      async updPassword(){
        const checkPWD =  this.checkPWD()
        if(!checkPWD) {
          await new Promise(resolve => {
            setTimeout(() => {
              this.resultRequest = null
              this.newPwd1 = null
              this.newPwd2 = null
            }, 2000);
          })
        } else {
          this.resultRequest = await userService.updPassword(this.newPwd1, this.userId)
          await new Promise(resolve => {
            setTimeout(() => {
              this.resultRequest = null
              userService.logout()
            }, 5000);
          })
        }
      },
      checkPWD() {
        if(this.newPwd1 && this.newPwd1 === this.newPwd2) {
          if(this.newPwd1.length < 6) {
            this.resultRequest = {
              status: 'error',
              icon: 'error',
              msg: 'Le mot de passe doit au moins contenir 6 caractères.'
            }
            return false;
          }
          if(this.newPwd1 === this.firstname || this.newPwd1 === this.lastname) {
            this.resultRequest = {
              status: 'error',
              icon: 'error',
              msg: 'Le mot de passe doit être différent de votre identité.'
            }
            return false;
          }
          const patternNumber = /[0-9]/;
          if(!patternNumber.test(this.newPwd1)) {
            this.resultRequest = {
              status: 'error',
              icon: 'error',
              msg: 'Le mot de passe doit contenir au moins un chiffre.'
            }
            return false;
          }
          const patternLetter = /[a-z]/;
          if(!patternLetter.test(this.newPwd1)) {
            this.resultRequest = {
              status: 'error',
              icon: 'error',
              msg: 'Le mot de passe doit contenir au moins une lettre minuscule.'
            }
            return false;
          }
          const patternMaj = /[A-Z]/;
          if(!patternMaj.test(this.newPwd1)) {
            this.resultRequest = {
              status: 'error',
              icon: 'error',
              msg: 'Le mot de passe doit contenir au moins une lettre majuscule.'
            }
            return false;
          }
        } else {
          this.resultRequest = {
            status: 'error',
            icon: 'error',
            msg: 'Les mots de passe doivent être identique.'
          }
          return false;
        }
        return true;
      }
    }
  }
</script>

<style lang="sass" scoped>
  .firstConnection
    display: flex
    flex-direction: column
    height: 100%
    align-items: center
    width: 100%
    .form
      width: 19rem
    .firstConnectionTitle
      margin-top: 3rem
      font-weight: bold
      margin-bottom: 4rem
      font-size: 2.4rem
    .logoutBtn
      margin-top: 3rem
    .alertMyAccount
      position: absolute
      top: 4.7rem
</style>
