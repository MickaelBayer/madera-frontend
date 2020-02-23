<template lang="pug">
  .listComponent
    v-layout(child-flex='')
      v-data-table.elevation-1(:headers='headers', :items='components', :search='search', sort-by='calories', no-results-text="fefe", :items-per-page='-1', hide-default-footer='')
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
                v-btn.mb-2(color='primary', dark='', v-on='on') Ajouter
              v-card
                v-card-title
                  span.headline {{ formTitle }}
                v-card-text
                  v-container
                    v-row
                      v-col(cols='12', sm='6', md='4')
                        v-text-field(v-model='editedItem.name', label='Nom du composant')
                      v-col(cols='12', sm='6', md='4')
                        v-text-field(v-model='editedItem.calories', label='Calories')
                      v-col(cols='12', sm='6', md='4')
                        v-text-field(v-model='editedItem.fat', label='Fat (g)')
                      v-col(cols='12', sm='6', md='4')
                        v-text-field(v-model='editedItem.carbs', label='Carbs (g)')
                      v-col(cols='12', sm='6', md='4')
                        v-text-field(v-model='editedItem.protein', label='Protein (g)')
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
        headers: [
          {
            text: 'Nom / Identifiant',
            align: 'left',
            value: 'name',
          },
          { text: 'Famille / Nature', value: 'family.name' },
          { text: 'Spécifications', value: 'specs'},
          { text: 'Actions', value: 'action', sortable: false },
        ],
        components: [],
        editedIndex: -1,
        editedItem: {
          name: '',
          family: 0,
          specs: 0,
        },
        defaultItem: {
          name: '',
          family: 0,
          specs: 0,
        },
      }
    },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
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
      const response = await moduleService.getComponents();
      this.components = response.data;
    },
    beforeDestroy(){
      this.$store.commit('hideTabsBE')
    },
    methods: {
      async initialize () {
        this.$store.commit('displayTabsBE')
        const response = await moduleService.getComponents();
        this.components = response.data;
        console.log(this.components)
      },

      editItem (item) {
        this.editedIndex = this.components.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.components.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.components.splice(index, 1)
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.components[this.editedIndex], this.editedItem)
        } else {
          this.components.push(this.editedItem)
        }
        this.close()
      },
      backHome() {
        this.$router.push('/home')
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
  td
    vertical-align: left
    text-align: left
    cursor: pointer
  @media(max-width: 850px)
    .zoneItem
      flex-direction: column
</style>
