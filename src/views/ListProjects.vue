<template lang="pug">
  .listProjects
    v-layout(child-flex='')
      v-data-table.elevation-1(item-key="id", :headers='headers', sort-by="createdAt", :items='projects', :search='search', no-results-text="Aucun résultat.", :items-per-page='-1', hide-default-footer='')
        template(v-slot:top='')
          v-toolbar(flat='', color='white')
            v-toolbar-title Les projets
            v-divider.mx-4(inset='', vertical='')
            v-spacer
            v-text-field(v-model='search', append-icon='search', label='Rechercher', single-line='', hide-details='')
            v-spacer
            v-divider.mx-4(inset='', vertical='')
            v-icon.mr-2(x-large='', @click="$router.push('/listCustomers')" , color="#409a1b")
             | add_circle_outline
            //- v-dialog(v-model='dialog', max-width='1000px')
            //-   template(v-slot:activator='{ on }')
            //-     v-icon.mr-2(x-large='', v-on='on', color="#409a1b")
            //-       | add_circle_outline
            //-   v-card
            //-     v-card-title
            //-       span.headline {{ formTitle }}
            //-     v-card-text
            //-       v-container
            //-         v-row
            //-           v-col(cols='12', sm='6', md='4')
            //-             v-text-field(v-model='editedItem.name', label='Nom du composant', required='')
            //-           v-col(cols='12', sm='6', md='4')
            //-             v-select(v-model='editedItem.provider', :items='providers', item-text='name', item-value='id', label='Fournisseur', required='')
            //-           v-col(cols='12', sm='6', md='4')
            //-             v-select(v-model='editedItem.ranges', :items='ranges', item-text='name', item-value='id', label='Gamme', required='')
            //-           v-col(cols='12', sm='6', md='6')
            //-             v-select(v-model='editedItem.family', :items='families', item-text='name', item-value='id', label='Famille / Nature', required='')
            //-           v-col(cols='12', sm='6', md='6')
            //-             v-text-field(v-model='editedItem.specs', label='Spécifications', :hint='editedItem.family && families[families.findIndex(x => x.id === editedItem.family)] ? families[families.findIndex(x => x.id === editedItem.family)].specs : ""', required='', :disabled='editedItem.family === null')
            //-     v-card-actions
            //-       v-spacer
            //-       v-btn(color='blue darken-1', text='', @click='close') Annuler
            //-       v-btn(color='blue darken-1', text='', @click='save') Enregister
        template(v-slot:item.action='{ item }')
          v-icon.mr-2(@click='showDetails(item)', x-large='')
            | description
          v-icon.mr-2(@click='editItem(item)', x-large='')
            | edit
          v-icon(@click='deleteItem(item)', x-large='')
            | delete
        template(v-slot:no-data='')
          v-btn(color='primary', @click='initialize') Reset
    v-alert(:type='resultSaveProjects.status' width="100%" class="successAddProjects" :icon="resultSaveProjects.icon" v-if="resultSaveProjects")
      | {{resultSaveProjects.msg}}
</template>

<script>
  import router from '../router';
  import projectService from '../services/project.service'
  export default {
    name: 'listProjects',
    projects: {
    },
    data() {
      return {
        search: '',
        dialog: false,
        resultSaveProjects: null,
        selectedRow: null,
        headers: [
          {
            text: 'Nom',
            align: 'left',
            value: 'name',
          },
          { text: 'Nom client', value: 'customer.lastName' },
          { text: 'Prénom client', value: 'customer.firstName'},
          { text: 'Gamme', value: 'ranges.name'},
          { text: 'Date', value: 'createdAt'},
          { text: 'Actions', value: 'action', sortable: false },
        ],
        projects: [],
        editedIndex: -1,
        editedItem: {
          name: '',
        },
        defaultItem: {
          name: '',
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
      // const projectsResponse = await projectService.getProjects()
      // this.projects = projectsResponse.data
      // console.log(this.projects)
    },
    beforeDestroy(){
    },
    methods: {
      async initialize () {
        const projectsResponse = await projectService.getProjects()
        this.projects = projectsResponse.data
      },

      editItem (item) {
        this.editedIndex = this.projects.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      handleClick(value){
        this.selectedRow = value
      },

      formatDate(date){
        const itemDate = new Date(date)
        return itemDate.getDate() + "/" + (itemDate.getMonth() + 1) + "/" + itemDate.getFullYear();
      },

      backHome() {
        this.$router.push('/home')
      },

      async deleteItem (item) {
        if (confirm('Etes vous sûr de vouloir supprimer ce fournisseur ?')) {
          this.resultSaveProject = await projectService.deleteProject(item)
          this.initialize()
          await new Promise(resolve => {
            setTimeout(() => {
              this.resultSaveProject = null
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
            this.resultSaveProject = await moduleService.updateProject(this.editedItem)
          } 
          // new
          else {
            this.resultSaveProject = await moduleService.saveProject(this.editedItem)
          }
          this.initialize()
          this.close()
        }
        else {
        this.resultSaveProject = {
                                      status: 'error',
                                      icon: 'error',
                                      msg: 'Information(s) manquante(s)'
                                    }
        }
        await new Promise(resolve => {
          setTimeout(() => {
            this.resultSaveProject = null
          }, 2000);
        })
      },

      validateProject(){
        if(!this.selectedRow){
          this.isAlertShowned = true
          setTimeout(() => {
              this.isAlertShowned = false
          }, 2000)
          return
        }
        else {
          this.$store.commit('setCustomer', this.selectedRow)
          this.$router.push('/createProject')
        }
      },

    }
  }
</script>

<style lang="sass" scoped>
  .listProjects
    height: 100%
    width: 100%
    display: flex
    flex-direction: row
    justify-content: center
    padding: 0.8rem
  .custom-highlight-row
    background-color: #409a1b !important
  .btnCreate
    margin-top: 3vh
  .cancelCreate
    margin-right: 1rem
  .alertSelection
    position: absolute
    top: 4.7rem
  .addproject
    display: flex
    flex-direction: column
    height: 100%
    align-items: center
    width: 100%
  .successAddproject
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
