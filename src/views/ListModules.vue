<template lang="pug">
  .listModule
    v-layout(child-flex='')
      v-data-table.elevation-1(item-key="id", :headers='headers', sort-by="name", :items='modules', :search='search', no-results-text="Aucun résultat.", :items-per-page='-1', hide-default-footer='')
        template(v-slot:top='')
          v-toolbar(flat='', color='white')
            v-toolbar-title Modules
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
                        v-text-field(v-model='editedItem.name', label='Nom du module', required='')
                      v-col(cols='12', sm='6', md='4')
                        v-select(v-model='editedItem.ranges', :items='ranges', item-text='name', item-value='id', label='Gamme', required='', v-on:change='rangeSelected')
                      v-col(cols='12', sm='6', md='4')
                        v-text-field(v-model='editedItem.startingPrice', label='Prix de base', required='', append-outer-icon='euros', align='right')
                      v-col(cols='12', sm='6', md='4')
                        v-select(v-model='editedItem.cctp', :items='cctps', item-text='name', item-value='id', label='CCTP', required='')
                      v-col(cols='12', sm='6', md='4')
                        v-select(v-model='editedItem.family', :items='families', item-text='name', item-value='id', label='Nature / Coupe', required='', v-on:change='familySelected')
                      v-col(cols='12', sm='6', md='4')
                        v-text-field(v-model='editedItem.specs', label='Spécifications', :hint='editedItem.family && families[families.findIndex(x => x.id === editedItem.family)] ? families[families.findIndex(x => x.id === editedItem.family)].specs : ""', required='', :disabled='editedItem.family === null')
                      v-col(cols='12')
                        v-textarea(v-model='editedItem.info', label='Informations', rows='2')
                      v-col(cols='12', sm='6', md='4', v-for='(componentFamily, index) in componentsFamilies' , v-if='(editedItem.family !== null && editedItem.ranges !== null) && ((components.filter(x => x.family.id === componentFamily.id)).length !== 0)', :key='index')
                        v-select(v-model='editedItem.selectedComponents[index]', :items='components.filter(x => x.family.id === componentFamily.id)', item-text='name', item-value='id', :label='componentFamily.name', required='', v-on:change='getLog')
                v-card-actions
                  v-spacer
                  v-btn(color='blue darken-1', text='', @click='close') Annuler
                  v-btn(color='blue darken-1', text='', @click='save') Enregister
        template(v-slot:item.action='{ item }')
          v-icon.mr-2(small='', @click='editItem(item)')
            | edit
          v-icon(small='', @click='deleteItem(item)')
            | delete
        template(v-slot:no-data='')
          v-btn(color='primary', @click='initialize') Reset
    v-alert(:type='resultSaveModule.status' width="100%" class="successAddModule" :icon="resultSaveModule.icon" v-if="resultSaveModule")
      | {{resultSaveModule.msg}}
</template>


<script>
  import router from '../router';
  import moduleService from '../services/module.service'
  export default {
    name: 'listModules',
    modules: {
    },
    data() {
      return {
        search: '',
        dialog: false,
        resultSaveModule: null,
        headers: [
          {
            text: 'Nom / Identifiant',
            align: 'left',
            value: 'name',
          },
          { text: 'Nature', value: 'family.name' },
          { text: 'Spécifications', value: 'specs', align: 'right' },
          { text: 'Unités', value: 'family.specs',sortable: false },
          { text: 'Gamme', value: 'ranges.name'},
          { text: 'Actions', value: 'action', sortable: false },
        ],
        modules: [],
        families: [],
        ranges: [],
        cctps: [],
        components: [],
        componentsFamilies: [],
        editedIndex: -1,
        editedItem: {
          name: null,
          ranges: null,
          startingPrice: null,
          family: null,
          specs: null,
          info: null,
          cctp: null,
          selectedComponents: [],
        },
        defaultItem: {
          name: null,
          ranges: null,
          startingPrice: null,
          family: null,
          specs: null,
          info: null,
          cctp: null,
          selectedComponents: [],
        },
      }
    },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nouveau module' : 'Edition d\'un module'
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
      const modulesResponse = await moduleService.getModules();
      this.modules = modulesResponse.data
      this.modules.forEach(module => {
        module.selectedComponents = []
      });
      const familiesResponse = await moduleService.getModulesFamilies();
      this.families = familiesResponse.data
      const rangesResponse = await moduleService.getRanges();
      this.ranges = rangesResponse.data
      const compoFamResponse = await moduleService.getComponentsFamilies();
      this.componentsFamilies = compoFamResponse.data
      const cctpsResponse = await moduleService.getCctps();
      this.cctps = cctpsResponse.data
    },
    beforeDestroy(){
      this.$store.commit('hideTabsBE')
    },
    methods: {
      async initialize () {
        this.$store.commit('displayTabsBE')
        const modulesResponse = await moduleService.getModules();
        this.modules = modulesResponse.data;
        const familiesResponse = await moduleService.getModulesFamilies();
        this.families = familiesResponse.data
        const rangesResponse = await moduleService.getRanges();
        this.ranges = rangesResponse.data
        const compoFamResponse = await moduleService.getComponentsFamilies();
        this.componentsFamilies = compoFamResponse.data
        const cctpsResponse = await moduleService.getCctps();
        this.cctps = cctpsResponse.data
      },

      async rangeSelected() {
        //check pour maj compo
        this.editedItem.selectedComponents = []
        if (this.editedItem.family !== null && this.editedItem.ranges !== null){
          const response = await moduleService.getComponentsWithFamiliesAndRange(this.editedItem.family,
                                                                                  this.editedItem.ranges)
          this.components = response.data
        }
      },

      async familySelected() {
        //check pour maj compo
        this.editedItem.selectedComponents = []
        if (this.editedItem.family !== null && this.editedItem.ranges !== null){
          const response = await moduleService.getComponentsWithFamiliesAndRange(this.editedItem.family,
                                                                                  this.editedItem.ranges)
          this.components = response.data
        }
      },

      getLog(){
        console.log(this.editedItem.selectedComponents)
      },

      isRangesAndFamilySelected(){
        return this.editedItem.ranges !== null && this.editedItem.family !== null 
      },

      async editItem (item) {
        this.editedIndex = this.modules.indexOf(item)
        this.editedItem = Object.assign({}, item)
        console.log(this.editedItem)
        this.editedItem.cctp = this.editedItem.cctp.id
        this.editedItem.ranges = this.editedItem.ranges.id
        this.editedItem.family = this.editedItem.family.id
        moduleService.getComponentByModule(this.editedItem)
        .then(
          response => {
            this.editedItem.selectedComponents = response.data
            const newSelectedTab = []
            for(let index = 0; index < this.componentsFamilies.length ; index++ ){
              this.editedItem.selectedComponents.forEach(compo => {
                console.log(compo.family.id)
                if (this.componentsFamilies[index].id === compo.family.id) {
                  console.log(compo.id)
                  newSelectedTab[index] = compo.id
                }
              })
            }
            this.editedItem.selectedComponents = newSelectedTab
            console.log(this.editedItem)
            this.dialog = true
          }
        )
      },

      async deleteItem (item) {
        if (confirm('Etes vous sûr de vouloir supprimer ce module ?')) {
          this.resultSaveModule = await moduleService.deleteModule(item)
          this.initialize()
          await new Promise(resolve => {
            setTimeout(() => {
              this.resultSaveModule = null
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
        if(this.editedItem.name
           && this.editedItem.ranges
           && this.editedItem.startingPrice
           && this.editedItem.family
           && this.editedItem.specs
           && this.editedItem.cctp
           && this.editedItem.selectedComponents.length !== 0
           ){
          // Replace the id of the family by the object family
          if (!isNaN(this.editedItem.family)) {
            const editedItemFamily = this.editedItem.family
            this.editedItem.family = this.families[this.families.findIndex(x => x.id === editedItemFamily)]
          }
          // Replace the id of the ranges by the object ranges
          if (!isNaN(this.editedItem.ranges)) {
            const editedItemRanges = this.editedItem.ranges
            this.editedItem.ranges = this.ranges[this.ranges.findIndex(x => x.id === editedItemRanges)]
          }
          // Replace the id of the cctp by the object cctp
          if (!isNaN(this.editedItem.cctp)) {
            const editedItemCctp = this.editedItem.cctp
            this.editedItem.cctp = this.cctps[this.cctps.findIndex(x => x.id === editedItemCctp)]
          }
          // Replace the ids of the componenent in selectedComponents
          const selectedComponentsModif = []
          this.editedItem.selectedComponents.forEach(component => {
            if (component !== null) {
              selectedComponentsModif.push(this.components[this.components.findIndex(x => x.id === component)])
            }
          });
          this.editedItem.selectedComponents = selectedComponentsModif
          // Edit
          if (this.editedIndex > -1) {
            this.resultSaveModule = await moduleService.updateModule(this.editedItem)
          } 
          // New
          else {
            this.resultSaveModule = await moduleService.saveModule(this.editedItem)
          }
          this.initialize()
          this.close()
        }
        else {
        this.resultSaveModule = {
                                      status: 'error',
                                      icon: 'error',
                                      msg: 'Information(s) manquante(s)'
                                    }
        }
        await new Promise(resolve => {
          setTimeout(() => {
            this.resultSaveModule = null
          }, 2000);
        })
      },

    }
  }
</script>

<style lang="sass" scoped>
  .listModule
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
  .addModule
    display: flex
    flex-direction: column
    height: 100%
    align-items: center
    width: 100%
  .successAddModule
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
