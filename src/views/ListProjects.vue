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
            v-divider.mx-4(inset='', vertical='' v-if="role !== 3")
            v-icon.mr-2(x-large='', @click="$router.push('/listCustomers')" , color="#409a1b", v-if="role !== 3")
             | add_circle_outline
        template(v-slot:item.createdAt='{ item }')
          | {{formatDate(item.createdAt)}}
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
  import moment from 'moment';
  import projectService from '../services/project.service'
  export default {
    name: 'listProjects',
    projects: {
    },
    data() {
      return {
        search: '',
        role: Number(this.$store.state.user.userRole),
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
      formatDate(d){
        moment.locale('fr')
        var date = new moment(d);
        return moment(date).utcOffset('+0000').format('L H:mm')
      },
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
