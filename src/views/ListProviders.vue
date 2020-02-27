<template lang="pug">
  .listprovider
    v-layout(child-flex='')
      v-data-table.elevation-1(item-key="id", :headers='headers', sort-by="name", :items='providers', :search='search', no-results-text="Aucun résultat.", :items-per-page='-1', hide-default-footer='')
        template(v-slot:top='')
          v-toolbar(flat='', color='white')
            v-toolbar-title Fournisseurs
            v-divider.mx-4(inset='', vertical='')
            v-spacer
            v-text-field(v-model='search', append-icon='search', label='Rechercher', single-line='', hide-details='')
            v-spacer
            v-divider.mx-4(inset='', vertical='')
            v-dialog(v-model='dialog', max-width='1000px')
              template(v-slot:activator='{ on }')
                v-btn.mb-2(color='primary', dark='', v-on='on') Ajouter
              v-card
                v-card-title
                  span.headline {{ formTitle }}
                v-card-text
                  v-container
                    v-row
                      v-col(cols='12', sm='6', md='4')
                        v-text-field(v-model='editedItem.name', label='Nom du fournisseur', required='')
                      v-col(cols='12', sm='6', md='4')
                        v-text-field(v-model='editedItem.address', label='Adresse', required='')
                      v-col(cols='12', sm='6', md='4')
                        v-text-field(v-model='editedItem.mail', label='Mail', required='', :rules="emailRules")
                v-card-actions
                  v-spacer
                  v-btn(color='blue darken-1', text='', @click='close') Annuler
                  v-btn(color='blue darken-1', text='', @click='save') Enregister
        template(v-slot:item.action='{ item }')
          v-icon.mr-2(@click='editItem(item)')
            | edit
          v-icon(@click='deleteItem(item)')
            | delete
        template(v-slot:no-data='')
          v-btn(color='primary', @click='initialize') Reset
    v-alert(:type='resultSaveProvider.status' width="100%" class="successAddprovider" :icon="resultSaveProvider.icon" v-if="resultSaveProvider")
      | {{resultSaveProvider.msg}}
</template>

<script>
  import router from '../router';
  import moduleService from '../services/module.service'
  export default {
    name: 'listProviders',
    providers: {
    },
    data() {
      return {
        search: '',
        dialog: false,
        resultSaveProvider: null,
        headers: [
          {
            text: 'Nom',
            align: 'left',
            value: 'name',
          },
          { text: 'Adresse', value: 'address' },
          { text: 'Mail', value: 'mail'},
          { text: 'Actions', value: 'action', sortable: false },
        ],
        providers: [],
        editedIndex: -1,
        editedItem: {
          name: '',
          address: null,
          mail: null,
        },
        defaultItem: {
          name: '',
          address: null,
          mail: null,
        },
        emailRules: [
          value => (value || '').length <= 30 || 'Max 30 caractères',
          value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'E-mail invalide'
          },
        ],
      }
    },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nouveau fournisseur' : 'Edition d\'un fournisseur'
      },
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    created () {
      this.initialize()
    },
    async mounted() {
      this.$store.commit('displayTabsBE')
      const providersResponse = await moduleService.getProviders();
      this.providers = providersResponse.data
    },
    beforeDestroy(){
      this.$store.commit('hideTabsBE')
    },
    methods: {
      async initialize () {
        this.$store.commit('displayTabsBE')
        const response = await moduleService.getProviders();
        this.providers = response.data;
      },

      editItem (item) {
        this.editedIndex = this.providers.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      async deleteItem (item) {
        if (confirm('Etes vous sûr de vouloir supprimer ce fournisseur ?')) {
          this.resultSaveProvider = await moduleService.deleteProvider(item)
          this.initialize()
          await new Promise(resolve => {
            setTimeout(() => {
              this.resultSaveProvider = null
            }, 2000);
          })
        }
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      async save () {
        if(this.editedItem.name && this.editedItem.address && this.editedItem.mail){
          // edit
          if (this.editedIndex > -1) {
            this.resultSaveProvider = await moduleService.updateProvider(this.editedItem)
          } 
          // new
          else {
            this.resultSaveProvider = await moduleService.saveProvider(this.editedItem)
          }
          this.initialize()
          this.close()
        }
        else {
        this.resultSaveProvider = {
                                      status: 'error',
                                      icon: 'error',
                                      msg: 'Information(s) manquante(s)'
                                    }
        }
        await new Promise(resolve => {
          setTimeout(() => {
            this.resultSaveProvider = null
          }, 2000);
        })
      },

    }
  }
</script>

<style lang="sass" scoped>
  .listprovider
    height: 100%
    width: 100%
    display: flex
    flex-direction: row
    justify-content: center
    padding: 0.8rem
  .custom-highlight-row
    background-color: #409a1b
  .btnCreate
    margin-top: 3vh
  .cancelCreate
    margin-right: 1rem
  .alertSelection
    position: absolute
    top: 4.7rem
  .addprovider
    display: flex
    flex-direction: column
    height: 100%
    align-items: center
    width: 100%
  .successAddprovider
    position: absolute
    top: 4.7rem
  td
    vertical-align: left
    text-align: left
    cursor: pointer
  @media(max-width: 850px)
    .zoneItem
      flex-direction: column
</style>
