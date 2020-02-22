<template lang="pug">
  .myAccount
    .myAccountTitle Mon compte
    .form
      v-text-field(v-model='lastname', label='Nom', required='')
      v-text-field(v-model='firstname', label='Prénom', required='')
      v-text-field(v-model='phone', label='N° Téléphone', required='')
      v-text-field(v-model='mail', label='E-mail', required='', :rules="emailRules")
      br
      v-layout(row='', wrap='', justify-end='', class="btnCreate")
        v-btn(outlined='', right=true, color="#409a1b", @click='updUser()') Enregistrer
      br
      v-text-field(v-model='newPwd1', type='password' label='Nouveau mot de passe')
      v-text-field(v-model='newPwd2', type='password' label='Confirmation nouveau mot de passe')
      br
      v-layout(row='', wrap='', justify-end='', class="btnCreate")
        v-btn(outlined='', right=true, color="#409a1b", @click='updPassword()') Enregistrer
    v-btn(color="red" @click="logout" class="logoutBtn") Déconnexion
    v-alert(:type='resultRequest.status' width="100%" class="alertMyAccount" :icon="resultRequest.icon" v-if="resultRequest")
      | {{resultRequest.msg}}
</template>

<script>
  import userService from '../services/user.service';
  import roleService from '../services/role.service';
  import router from '../router';
  export default {
    name: 'myAccount',
    components: {
    },
    data() {
      return {
        lastname: null,
        firstname: null,
        phone: null,
        mail: null,
        newPwd1: null,
        user: null,
        userId: null,
        newPwd2: null,
        resultRequest: null,
        emailRules: [
          value => (value || '').length <= 30 || 'Max 30 caractères',
          value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'E-mail invalide'
          },
        ],
      }
    },
    async mounted() {
      this.userId = this.$store.state.user.userID
      this.user = await userService.getInfoById(this.userId)
      this.firstname = this.user.data.firstName
      this.lastname = this.user.data.lastName
      this.mail = this.user.data.mail
      this.phone = this.user.data.phone
    },
    computed: {
    },
    methods: {
      logout(){
        userService.logout();
      },
      async updUser(){
        if(this.lastname && this.firstname && this.phone && this.mail){
          this.resultRequest = await userService.updInfoUser(this.userId, this.lastname, this.firstname, this.phone, this.mail)
        } else {
          this.resultRequest = {
            status: 'error',
            icon: 'error',
            msg: 'Information(s) manquante(s)'
          }
        }
        await new Promise(resolve => {
          setTimeout(() => {
            this.resultRequest = null
          }, 2000);
        })
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
  .myAccount
    display: flex
    flex-direction: column
    height: 100%
    align-items: center
    width: 100%
  .form
    width: 19rem
  .myAccountTitle
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
