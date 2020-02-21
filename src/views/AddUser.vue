<template lang="pug">
  .addUser
    .addUserTitle Ajouter un utilisateur
    .form
      v-text-field(v-model='lastname', label='Nom', required='')
      v-text-field(v-model='firstname', label='Prénom', required='')
      v-text-field(v-model='phone', label='N° Téléphone', required='')
      v-text-field(v-model='mail', label='E-mail', required='', :rules="emailRules")
      v-select(:items='roles', v-model='role' label='Role' item-text="name" item-value="id")
      v-layout(row='', wrap='', justify-end='', class="btnCreate")
        v-btn(outlined='', class="cancelCreate" right=true, color="#d92616", @click='backHome()') Annuler
        v-btn(outlined='', right=true, color="#409a1b", @click='createUser()') Enregistrer
    v-alert(:type='resultAddUser.status' width="100%" class="successAddUser" :icon="resultAddUser.icon" v-if="resultAddUser")
      | {{resultAddUser.msg}}
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
        roles: [],
        resultAddUser: null,
        emailRules: [
          value => (value || '').length <= 30 || 'Max 30 caractères',
          value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          },
        ],
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
        if(this.firstname && this.lastname && this.mail && this.phone && role){
          this.resultAddUser = await userService.signup(this.firstname, this.lastname, this.mail, "Madera123", this.phone, role)
          await new Promise(resolve => {
            setTimeout(() => {
              this.resultAddUser = null
              this.firstname = null
              this.lastname = null
              this.mail = null
              this.phone = null
              this.role = null
            }, 2000);
          })
        } else {
          this.resultAddUser = {
            status: 'error',
            icon: 'error',
            msg: 'Information(s) manquante(s)'
          }
          await new Promise(resolve => {
            setTimeout(() => {
              this.resultAddUser = null
            }, 2000);
          })
        }

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
  .successAddUser
    position: absolute
    top: 4.7rem
</style>
