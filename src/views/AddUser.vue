<template lang="pug">
  .addUser
    .addUserTitle Ajouter un utilisateur
    .form
      v-text-field(v-model='lastname', label='Nom', required='')
      v-text-field(v-model='firstname', label='Prénom', required='')
      v-text-field(v-model='phone', label='N° Téléphone', required='')
      v-text-field(v-model='mail', label='E-mail', required='')
      v-select(:items='roles', v-model='role' label='Role' item-text="name" item-value="id")
      v-layout(row='', wrap='', justify-end='', class="btnCreate")
        v-btn(outlined='', class="cancelCreate" right=true, color="#d92616", @click='backHome()') Annuler
        v-btn(outlined='', right=true, color="#409a1b", @click='createUser()') Enregistrer
</template>

<script>
  import userService from '../services/user.service';
  import roleService from '../services/role.service';
  import router from '../router';
  export default {
    name: 'addUser',
    components: {
    },
    data() {
      return {
        mail: null,
        firstname: null,
        lastname: null,
        role: null,
        phone: null,
        roles: []
      }
    },
    async mounted() {
      const roles = await roleService.getAll();
      this.roles = roles.data;
    },
    computed: {
    },
    methods: {
      backHome() {
        this.$router.push('/home')
      },
      async createUser(){
        let role;
        for(const r of this.roles){
          if(r.id === this.role) role = r
        }
        const signup = await userService.signup(this.firstname, this.lastname, this.mail, "1234", this.phone, role)
        console.log(signup)
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
  .btnCreate
    margin-top: 3vh
  .cancelCreate
    margin-right: 1rem
  .addUserTitle
    margin-top: 3rem
    font-weight: bold
    margin-bottom: 4rem
    font-size: 2.4rem
</style>
