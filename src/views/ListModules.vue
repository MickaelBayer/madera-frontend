<template lang="pug">
  .listModule
    v-layout(child-flex='')
      v-data-table.elevation-1(:headers='headers', :items='desserts', :search='search', sort-by='calories', no-results-text="fefe", :items-per-page='-1', hide-default-footer='')
        template(v-slot:top='')
          v-toolbar(flat='', color='white')
            v-toolbar-title My CRUD
            v-divider.mx-4(inset='', vertical='')
            v-spacer
            v-text-field(v-model='search', append-icon='search', label='Search', single-line='', hide-details='')
            v-spacer
            v-divider.mx-4(inset='', vertical='')
            v-dialog(v-model='dialog', max-width='1000px')
              template(v-slot:activator='{ on }')
                v-btn.mb-2(color='primary', dark='', v-on='on') New Item
              v-card
                v-card-title
                  span.headline {{ formTitle }}
                v-card-text
                  v-container
                    v-row
                      v-col(cols='12', sm='6', md='4')
                        v-text-field(v-model='editedItem.name', label='Dessert name')
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
                  v-btn(color='blue darken-1', text='', @click='close') Cancel
                  v-btn(color='blue darken-1', text='', @click='save') Save
        template(v-slot:item.glutenfree='{ item }')
          label.container
          input(type='checkbox', checked='checked', v-model='item.glutenfree')
          span.checkmark

</template>


<script>
  import router from '../router';
  import moduleService from '../services/module.service'
  export default {
    name: 'listModules',
    components: {
    },
    data() {
      return {
        search: '',
        dialog: false,
        headers: [
          {
            text: 'Dessert (100g serving)',
            align: 'left',
            sortable: false,
            value: 'name',
          },
          { text: 'Calories', value: 'calories' },
          { text: 'Fat (g)', value: 'fat' },
          { text: 'Carbs (g)', value: 'carbs' },
          { text: 'Protein (g)', value: 'protein' },
          { text: 'Iron (%)', value: 'iron' },
          { text: 'Gluten-Free', value: 'glutenfree' },
        ],
        modules: [],
        desserts: [],
        editedIndex: -1,
        editedItem: {
          name: '',
          calories: 0,
          fat: 0,
          carbs: 0,
          protein: 0,
        },
        defaultItem: {
          name: '',
          calories: 0,
          fat: 0,
          carbs: 0,
          protein: 0,
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
      const response = await moduleService.getAll();
      this.modules = response.data;
      console.log(this.modules)
    },
    beforeDestroy(){
      this.$store.commit('hideTabsBE')
    },
    methods: {
      initialize () {
        this.desserts = [
          {
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
            iron: '1%',
            glutenfree: true,
          },
          {
            name: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            carbs: 37,
            protein: 4.3,
            iron: '1%',
            glutenfree: false,
          },
          {
            name: 'Eclair',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
            iron: '7%',
            glutenfree: false,
          },
          {
            name: 'Jelly bean',
            calories: 375,
            fat: 0.0,
            carbs: 94,
            protein: 0.0,
            iron: '0%',
            glutenfree: true,
          },
          {
            name: 'Lollipop',
            calories: 392,
            fat: 0.2,
            carbs: 98,
            protein: 0,
            iron: '2%',
            glutenfree: true,
          },
          {
            name: 'KitKat',
            calories: 518,
            fat: 26.0,
            carbs: 65,
            protein: 7,
            iron: '6%',
            glutenfree: false,
          },
        ]
      },

      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.desserts.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
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
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem)
        }
        this.close()
      },
      backHome() {
        this.$router.push('/home')
      },
      handleClick(value){
        this.selectedRow = value
      },
      validateCustomer(){
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
  td
    vertical-align: left
    text-align: left
    cursor: pointer
  @media(max-width: 850px)
    .zoneItem
      flex-direction: column
  input
    width: 3rem
    height: 3rem
</style>
