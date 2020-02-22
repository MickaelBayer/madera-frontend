<template lang="pug">
  .userList
    .titleUserList Gestion des utilisateurs
    .userListTable
      template
        v-data-table.elevation-1(:headers='headers', :items='users', sort-by='calories')
          template(v-slot:top='')
            v-toolbar(flat='', color='white')
              v-dialog(v-model='dialog', max-width='500px')
                v-card
                  v-card-title
                    span.headline Modifier un utilisateur
                  v-card-text
                    v-container
                      v-row
                        v-col(cols='12', sm='6', md='4')
                          v-text-field(v-model='editedItem.lastName', label='Nom')
                        v-col(cols='12', sm='6', md='4')
                          v-text-field(v-model='editedItem.firstName', label='Prénom')
                        v-col(cols='12', sm='6', md='4')
                          v-text-field(v-model='editedItem.mail', label='E-mail')
                        v-col(cols='12', sm='6', md='4')
                          v-text-field(v-model='editedItem.phone', label='N° Téléphone')
                  v-card-actions
                    v-spacer
                    v-btn(color='blue darken-1', text='', @click='close') Cancel
                    v-btn(color='blue darken-1', text='', @click='save') Save
          template(v-slot:item.action='{ item }')
            v-btn(@click='editItem(item)' color='#a17e54' class="btnUpd")
              | Modifier
            v-btn(@click='changeState(item, false)' v-if="item.isActiv" color="red")
              | Désactiver
            v-btn(@click='changeState(item, true)' v-if="!item.isActiv" color="green")
              | Activer
          template(v-slot:no-data='')
            v-btn(color='primary', @click='initialize') Reset
    v-alert(:type='resultRequest.status' width="100%" class="alertUserList" :icon="resultRequest.icon" v-if="resultRequest")
      | {{resultRequest.msg}}
</template>


<script>
  import userService from '../services/user.service';

  export default {
    data: () => ({
      dialog: false,
      headers: [
        {
          text: 'E-mail',
          align: 'left',
          value: 'mail',
        },
        { text: 'Nom', value: 'lastName' },
        { text: 'Prénom', value: 'firstName' },
        { text: 'N° Téléphone', value: 'phone' },
        { text: 'Rôle', value: 'role.name' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      users: [],
      resultRequest: null,
      editedIndex: -1,
      editedItem: {
        firstName: '',
        lastName: '',
        phone: '',
        mail: '',
        role: '',
        activ: ''
      },
      defaultItem: {
        firstName: '',
        lastName: '',
        phone: '',
        mail: '',
        role: '',
      },
    }),

    computed: {
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      async initialize () {
        const t = await userService.getAll()
        this.users = t.data
      },

      editItem (item) {
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },


      async changeState (item, activ) {
        this.resultRequest = await userService.changeStateUser(item.id, activ)
        location.reload()
        Object.assign(this.users[this.editedIndex], this.editedItem)
        await new Promise(resolve => {
          setTimeout(() => {
            this.resultRequest = null
          }, 2000);
        })
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      async save () {
        if(this.editedItem.lastName && this.editedItem.firstName && this.editedItem.phone && this.editedItem.mail){
          this.resultRequest = await userService.updInfoUser(this.editedItem.id, this.editedItem.lastName, this.editedItem.firstName, this.editedItem.phone, this.editedItem.mail)
          Object.assign(this.users[this.editedIndex], this.editedItem)
          this.close()
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
    },
  }
</script>
<style lang="sass" scoped>
  .userList
    display: flex
    flex-direction: column
    height: 100%
    align-items: center
    width: 100%
  .titleUserList
    margin-top: 3rem
    font-weight: bold
    margin-bottom: 4rem
    font-size: 2.4rem
  .userListTable
    width: 100%
  thead
    width: 100%
    display: flex
  .alertUserList
    position: absolute
    top: 4.7rem
  .btnUpd
    margin-right: 1rem
</style>
