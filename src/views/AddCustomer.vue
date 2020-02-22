<template lang="pug">
  .addUser
    .addUserTitle Ajouter un client
    .form
      v-text-field(v-model='lastname', label='Nom', required='')
      v-text-field(v-model='firstname', label='Prénom', required='')
      v-text-field(v-model='phone', label='N° Téléphone', required='')
      v-text-field(v-model='address', label='Adresse', required='')
      v-text-field(v-model='mail', label='E-mail', required='', :rules="emailRules")
      v-layout(row='', wrap='', justify-end='', class="btnCreate")
        v-btn(outlined='', class="cancelCreate" right=true, color="#d92616", @click='backHome()') Annuler
        v-btn(outlined='', right=true, color="#409a1b", @click='createCustomer()') Enregistrer
    v-alert(:type='resultAddCustomer.status' width="100%" class="successAddCustomer" :icon="resultAddCustomer.icon" v-if="resultAddCustomer")
      | {{resultAddCustomer.msg}}
</template>

<script>
  import customerService from '../services/customer.service';
  import userService from '../services/user.service'
  import router from '../router';
  export default {
    name: 'addCustomer',
    components: {
    },
    data() {
      return {
        mail: null,
        firstname: null,
        lastname: null,
        phone: null,
        address: null,
        resultAddCustomer: null,
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
    },
    computed: {
    },
    methods: {
      backHome() {
        this.$router.push('/projectCustomer')
      },
      async createCustomer(){
        if(this.firstname && this.lastname && this.mail && this.phone && this.address){
          this.resultAddCustomer = await customerService.create(this.firstname, this.lastname, this.phone, this.address, this.mail)
          if (this.resultAddCustomer.status === 'success'){
            await new Promise(resolve => {
              setTimeout(() => {
                this.resultAddCustomer = null
                this.firstname = null
                this.lastname = null
                this.mail = null
                this.phone = null
                this.address = null
                this.$router.push('/createProject')
              }, 2000);
            })
          }
        } else {
          this.resultAddCustomer = {
            status: 'error',
            icon: 'error',
            msg: 'Information(s) manquante(s)'
          }
          await new Promise(resolve => {
            setTimeout(() => {
              this.resultAddCustomer = null
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
