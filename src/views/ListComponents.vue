<template lang="pug">
  .listComponent
    v-layout(child-flex='')
      v-data-table.elevation-1(item-key="id", :headers='headers', sort-by="name", :items='components', :search='search', no-results-text="Aucun résultat.", :items-per-page='-1', hide-default-footer='')
        template(v-slot:top='')
          v-toolbar(flat='', color='white')
            v-toolbar-title Composants
            v-divider.mx-4(inset='', vertical='')
            v-spacer
            v-text-field(v-model='search', append-icon='search', label='Rechercher', single-line='', hide-details='')
            v-spacer
            v-divider.mx-4(inset='', vertical='')
            v-dialog(v-model='dialog', max-width='1000px')
              template(v-slot:activator='{ on }')
                v-icon.mr-2(x-large='', v-on='on', color="#409a1b")
                  | add_circle_outline
              v-card
                v-card-title
                  span.headline {{ formTitle }}
                v-card-text
                  v-container
                    v-row
                      v-col(cols='12', sm='6', md='4')
                        v-text-field(v-model='editedItem.name', label='Nom du composant', required='')
                      v-col(cols='12', sm='6', md='4')
                        v-select(v-model='editedItem.provider', :items='providers', item-text='name', item-value='id', label='Fournisseur', required='')
                      v-col(cols='12', sm='6', md='4')
                        v-select(v-model='editedItem.ranges', :items='ranges', item-text='name', item-value='id', label='Gamme', required='')
                      v-col(cols='12', sm='6', md='6')
                        v-select(v-model='editedItem.family', :items='families', item-text='name', item-value='id', label='Famille / Nature', required='')
                      v-col(cols='12', sm='6', md='6')
                        v-text-field(v-model='editedItem.specs', label='Spécifications', :hint='editedItem.family && families[families.findIndex(x => x.id === editedItem.family)] ? families[families.findIndex(x => x.id === editedItem.family)].specs : ""', required='', :disabled='editedItem.family === null')
                v-card-actions
                  v-spacer
                  v-btn(color='blue darken-1', text='', @click='close') Annuler
                  v-btn(color='blue darken-1', text='', @click='save') Enregister
        template(v-slot:item.action='{ item }')
          v-icon.mr-2(@click='editItem(item)', x-large='')
            | edit
          v-icon(@click='deleteItem(item)', x-large='')
            | delete
        template(v-slot:no-data='')
          v-btn(color='primary', @click='initialize') Reset
    v-alert(:type='resultSaveComponent.status' width="100%" class="successAddComponent" :icon="resultSaveComponent.icon" v-if="resultSaveComponent")
      | {{resultSaveComponent.msg}}
</template>


<script>
  import router from '../router';
  import moduleService from '../services/module.service'
  export default {
    name: 'listComponents',
    components: {
    },
    data() {
      return {
        search: '',
        dialog: false,
        resultSaveComponent: null,
        headers: [
          {
            text: 'Nom / Identifiant',
            align: 'left',
            value: 'name',
          },
          { text: 'Famille / Nature', value: 'family.name' },
          { text: 'Spécifications', value: 'specs', align: 'right' },
          { text: 'Unités', value: 'family.specs',sortable: false },
          { text: 'Gamme', value: 'ranges.name'},
          { text: 'Fournisseur', value: 'provider.name' },
          { text: 'Actions', value: 'action', sortable: false },
        ],
        components: [],
        families: [],
        providers: [],
        ranges: [],
        editedIndex: -1,
        editedItem: {
          name: '',
          family: null,
          specs: null,
          provider: null,
          ranges: null,
        },
        defaultItem: {
          name: '',
          family: null,
          specs: null,
          provider: null,
          ranges: null,
        },
      }
    },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nouveau composant' : 'Edition d\'un composant'
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
      const componentsResponse = await moduleService.getComponents();
      this.components = componentsResponse.data
      const familiesResponse = await moduleService.getComponentsFamilies();
      this.families = familiesResponse.data
      const providersResponse = await moduleService.getProviders();
      this.providers = providersResponse.data
      const rangesResponse = await moduleService.getRanges();
      this.ranges = rangesResponse.data
    },
    beforeDestroy(){
      this.$store.commit('hideTabsBE')
    },
    methods: {
      async initialize () {
        this.$store.commit('displayTabsBE')
        const response = await moduleService.getComponents();
        this.components = response.data;
        const familiesResponse = await moduleService.getComponentsFamilies();
        this.families = familiesResponse.data
        const providersResponse = await moduleService.getProviders();
        this.providers = providersResponse.data
        const rangesResponse = await moduleService.getRanges();
        this.ranges = rangesResponse.data
      },

      editItem (item) {
        this.editedIndex = this.components.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      async deleteItem (item) {
        if (confirm('Etes vous sûr de vouloir supprimer ce composant ?')) {
          this.resultSaveComponent = await moduleService.deleteComponent(item)
          this.initialize()
          await new Promise(resolve => {
            setTimeout(() => {
              this.resultSaveComponent = null
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
        if(this.editedItem.name && this.editedItem.family && this.editedItem.specs && this.editedItem.provider){
          // Replace the id of the family by the object family
          if (!isNaN(this.editedItem.family)) {
            const editedItemFamily = this.editedItem.family
            this.editedItem.family = this.families[this.families.findIndex(x => x.id === editedItemFamily)]
          }
          // Replace the id of the provider by the object provider
          if (!isNaN(this.editedItem.provider)) {
            const editedItemProvider = this.editedItem.provider
            this.editedItem.provider = this.providers[this.providers.findIndex(x => x.id === editedItemProvider)]
          }
          // Replace the id of the ranges by the object ranges
          if (!isNaN(this.editedItem.ranges)) {
            const editedItemRanges = this.editedItem.ranges
            this.editedItem.ranges = this.ranges[this.ranges.findIndex(x => x.id === editedItemRanges)]
          }
          // Edit
          if (this.editedIndex > -1) {
            this.resultSaveComponent = await moduleService.updateComponent(this.editedItem)
          } 
          // New
          else {
            this.resultSaveComponent = await moduleService.saveComponent(this.editedItem)
          }
          this.initialize()
          this.close()
        }
        else {
        this.resultSaveComponent = {
                                      status: 'error',
                                      icon: 'error',
                                      msg: 'Information(s) manquante(s)'
                                    }
        }
        await new Promise(resolve => {
          setTimeout(() => {
            this.resultSaveComponent = null
          }, 2000);
        })
      },

    }
  }
</script>

<style lang="sass" scoped>
  .listComponent
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
  .addComponent
    display: flex
    flex-direction: column
    height: 100%
    align-items: center
    width: 100%
  .successAddComponent
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
