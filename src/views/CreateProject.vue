<template lang="pug">
  .createProject
    v-layout(child-flex='' v-if="!createHousePlan")
      v-card
        v-data-table(item-key="id", :headers='headers', sort-by='position' :items='projectModules', no-results-text="Aucun résultat.", :items-per-page='-1', hide-default-footer='')
          template(v-slot:top='')
            v-toolbar(flat='', color='white')
              v-toolbar-title Nouveau projet
              v-divider.mx-4(inset='', vertical='')
              v-spacer
              v-text-field(v-model='name', label='Intitulé du projet', single-line='', required='', hide-details='', v-on:change='updateProjectName')
              v-spacer
              v-divider.mx-4(inset='', vertical='')
              v-spacer
              v-select(:items='ranges', v-model='range', label='Gamme', item-text="name", item-value="id", single-line='', required='', hide-details='', v-on:change='updateRange')
              v-spacer
              v-divider.mx-4(inset='', vertical='')
              v-dialog(v-model='dialog', max-width='1000px')
                template(v-slot:activator='{ on }')
                  v-icon.mr-2(x-large='', v-on='on', :disabled='name === null || name === "" || range === null', color="#409a1b")
                    | add_circle_outline
                v-card
                  v-card-title
                    span.headline {{ formTitle }}
                  v-card-text
                    v-container
                      v-row
                        v-col(cols='12', sm='6', md='6')
                          v-text-field(v-model='editedItem.name', label='Nom du module', required='')
                        v-col(cols='12', sm='6', md='6')
                          v-select(v-model='editedItem.family', :items='families', item-text='name', item-value='id', label='Nature', required='')
                        v-col(cols='12', sm='6', md='6')
                          v-text-field(v-model='editedItem.quantity', label='Taille / Quantité', :hint='editedItem.family && families[families.findIndex(x => x.id === editedItem.family)] ? families[families.findIndex(x => x.id === editedItem.family)].units : ""', required='', :disabled='editedItem.family === null')
                        v-col(cols='12', sm='6', md='6', v-if='(editedItem.family !== null) && ((modules.filter(x => (x.ranges.id === range) && (x.family.id === editedItem.family))).length !== 0)')
                          v-select(v-model='editedItem.module', :items='modules.filter(x => (x.ranges.id === range) && (x.family.id === editedItem.family))', item-text='name', item-value='id', label='Module', required='', :disabled='editedIndex !== -1')
                  v-card-actions
                    v-spacer
                    v-btn(color='blue darken-1', text='', @click='close') Annuler
                    v-btn(color='blue darken-1', text='', @click='save') Ajouter
          template(v-slot:item.action='{ item }')
            v-icon.mr-2(@click='editItem(item)', x-large='')
              | edit
            v-icon(@click='deleteItem(item)', x-large='')
              | delete
        v-btn.cancelCreate(outlined='', right='', color='#916834', @click='createPlanWindow')  Créer le plan
        v-btn.cancelCreate(outlined='', right='', color='#d92616', @click='backHome()')  Annuler
        v-btn(outlined='', right='', color='#409a1b', @click='createProject()')  Valider
    v-alert(:type='resultAddProject.status' width="100%" class="successAddProject" :icon="resultAddProject.icon" v-if="resultAddProject")
      | {{resultAddProject.msg}}
</template>


<script>
  import moduleService from '../services/module.service';
  import projectService from '../services/project.service';
  export default {
    name: 'createProject',
    data() {
      return{
        name: null,
        range: null,
        createHousePlan: false,
        resultAddProject: null,
        dialog: false,
        ranges: [],
        families: [],
        projectModules: [],
        modules: [],
        headers: [
          {
            text: 'Nom / Identifiant',
            align: 'left',
            sortable: false,
            value: 'name',
          },
          { text: 'Famille / Nature', value: 'module.family.name', sortable: false  },
          { text: 'Taille / Quantité', value: 'quantity', align: 'right', ortable: false  },
          { text: 'Unités', value: 'module.family.units',sortable: false },
          { text: 'Actions', value: 'action', sortable: false },
        ],
        editedIndex: -1,
        editedItem: {
          name: '',
          family: null,
          quantity: null,
          module: null,
        },
        defaultItem: {
          name: '',
          family: null,
          quantity: null,
          module: null,
        },

        //list module avec +
        //cliquer glisser ?
        //input nom
        //modale enregistrement module spécifique projet, angle position


      }
    },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Ajout d\'un module' : 'Edition d\'un module'
      },
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    async mounted() {
      if(this.$store.state.project === {}){
        this.$store.commit('resetPositionModule')
      } else {
        if(this.$store.state.project.name){
          this.name = this.$store.state.project.name
        }
        if(this.$store.state.project.range){
          this.range = this.$store.state.project.ranges.id
        }
      }
      const rangesResponse = await moduleService.getRanges()
      this.ranges = rangesResponse.data;
      const familiesResponse = await moduleService.getModulesFamilies()
      this.families = familiesResponse.data
      const modulesResponse = await moduleService.getModules()
      this.modules = modulesResponse.data;
      if (this.$store.state.project.id){
        this.projectModules = await projectService.getProjectModule()
        this.$store.commit('setProjectModules', this.projectModules)
      }
    },
    methods: {
      createPlanWindow(){
        const win = window.open('http://localhost:8081/ressources/index.html', '_blank');
        win.focus();
      },
      async initialize(){
        const rangesResponse = await moduleService.getRanges();
        this.ranges = rangesResponse.data;
        const familiesResponse = await moduleService.getModulesFamilies();
        this.families = familiesResponse.data
        const modulesResponse = await moduleService.getModules();
        this.modules = modulesResponse.data;
        this.name = this.$store.state.project.name
        this.range = this.$store.state.project.ranges.id
        if (this.$store.state.projectModules){
          this.projectModules = this.$store.state.projectModules
        }
      },
      backHome() {
        this.$router.push('/home')
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      async save () {
        if(this.editedItem.name && this.editedItem.family && this.editedItem.quantity && this.editedItem.module){
          let projectModule = {}
          projectModule.position = this.$store.state.positionModule;
          this.$store.commit('incrementPositionModule')
          projectModule.name = this.editedItem.name;
          projectModule.module = this.modules[this.modules.findIndex(x => x.id === this.editedItem.module)]
          projectModule.quantity = this.editedItem.quantity
          // Edit
          if (this.editedIndex > -1) {
            //this.resultSaveComponent = await moduleService.updateComponent(this.editedItem)
          }
          // New
          else {
            //this.resultSaveComponent = await moduleService.saveComponent(this.editedItem)
            this.$store.commit('addModuleToProject', projectModule)
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

      updateRange(){
        this.$store.commit('setProjectRange', this.ranges[this.ranges.findIndex(x => x.id === this.range)])
      },

      updateProjectName(){
        this.$store.commit('setProjectName', this.name)
      },

      async createProject(){
        if(this.$store.state.project.name && this.$store.state.project.ranges){
          this.resultAddProject = await projectService.saveProject()
          await new Promise(resolve => {
            setTimeout(() => {
              this.resultAddProject = null
              this.firstname = null
              this.lastname = null
              this.mail = null
              this.phone = null
              this.role = null
            }, 2000);
            this.$router.push('/listCustomers')
          })
        } else {
          this.resultAddProject = {
            status: 'error',
            icon: 'error',
            msg: 'Information(s) manquante(s)'
          }
          await new Promise(resolve => {
            setTimeout(() => {
              this.resultAddProject = null
            }, 2000);
          })
        }
       }
    }
  }
</script>

<style lang="sass" scoped>
  .createProject
    height: 100%
    width: 100%
    display: flex
    flex-direction: row
    justify-content: center
    padding: 0.8rem
  .form
    width: 19rem
  .btnCreate
    margin-top: 3vh
  .cancelCreate
    margin-right: 1rem
  .addProjectTitle
    margin-top: 3rem
    font-weight: bold
    margin-bottom: 4rem
    font-size: 2.4rem
  .alertAddProject
    position: absolute
    top: 4.7rem
  .successAddProject
    position: absolute
    top: 4.7rem
</style>
