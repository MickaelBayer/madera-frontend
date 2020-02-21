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
        newPwd2: null,
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
      const id = this.$store.state.user.userID
      this.user = await userService.getInfoById(id)
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
      updUser(){
        // todo modifier les infos utilisateur
      },
      updPassword(){
        // todo modifier le mot de passe
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
</style>
