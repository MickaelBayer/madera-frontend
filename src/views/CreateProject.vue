<template lang="pug">
  .createProject
    .addUserTitle Projet pour {{$store.state.customer.firstName }} {{$store.state.customer.lastName }}
    .form
      v-text-field(v-model='name', label='Intitulé du projet', required='')
      v-select(:items='ranges', v-model='range', label='Gamme', item-text="name", item-value="id")
      v-layout(row='', wrap='', justify-end='', class="btnCreate")
        v-btn(outlined='', class="cancelCreate" right=true, color="#d92616", @click='backHome()') Annuler
        v-btn(outlined='', right=true, color="#409a1b", @click='createProject()') Créer
    v-alert(:type='resultAddProject.status' width="100%" class="alertAddProject" :icon="resultAddProject.icon" v-if="resultAddProject")
      | {{resultAddProject.msg}}
</template>


<script>
  import moduleService from '../services/module.service';
  import projectService from '../services/project.service';
  export default {
    name: 'createProject',
    components: {
    },
    data() {
      return{
        name: null,
        range: null,
        resultAddProject: null,
        ranges: [],

        //list module avec +
        //cliquer glisser ?
        //input nom
        //modale enregistrement module spécifique projet, angle position


      }
    },
    computed: {
    },
    async mounted() {
      const rangesResponse = await moduleService.getRanges();
      this.ranges = rangesResponse.data;
    },
    methods: {
      backHome() {
        this.$router.push('/home')
      },
      async createProject(){
        if(this.name && this.range){
          this.range = this.ranges[this.ranges.findIndex(x => x.id === this.range)]
          this.resultAddProject = await projectService.saveProject(this.name, this.range, this.$store.state.customer, this.$store.state.user)
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
  .alertAddProject
    position: absolute
    top: 4.7rem
</style>
