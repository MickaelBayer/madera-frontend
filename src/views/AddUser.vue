<template lang="pug">
  .addUser
    .addUserTitle Ajouter un utilisateur
    .form
      v-text-field(v-model='lastname', label='Nom', required='')
      v-text-field(v-model='firstname', label='Prénom', required='')
      v-text-field(v-model='phone', label='N° Téléphone', required='')
      v-text-field(v-model='mail', label='E-mail', required='')
      v-select(:items='roles', v-model='role' label='Role' item-text="label" item-value="id")
      v-layout(row='', wrap='', justify-end='', class="btnCreate")
        v-btn(outlined='', class="cancelCreate" right=true, color="#d92616", @click='backHome()') Annuler
        v-btn(outlined='', right=true, color="#409a1b", @click='createUser()') Enregistrer
</template>

<script>
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
      }
    },
    computed: {
      roles(){
        // todo récupérer les valeurs en base de donnée
        return [{
          label: 'Admin',
          id: 1
        },{
          label: 'Commercial',
          id: 2
        },{
          label: 'Bureau d\'étude',
          id: 3
        }
        ]
      }
    },
    methods: {
      backHome() {
        this.$router.push('/home')
      },
      createUser(){
        // todo appeler la fonction pour créer un utilisateur
        console.log(this.role)
        console.log(this.firstname)
        console.log(this.lastname)
        console.log(this.mail)
        console.log(this.phone)
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
