<template lang="pug">
  .myAccount
    .myAccountTitle Mon compte
    .form
    v-btn(color="red" @click="logout") Déconnexion
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
      }
    },
    computed: {
    },
    methods: {
      logout(){
        userService.logout();
      }
    }
  }
</script>

<style lang="sass" scoped>
  .addUser
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
</style>
