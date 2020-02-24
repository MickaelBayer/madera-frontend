<template>
  <div class="listCustomer">
    <v-layout child-flex>
      <v-card>
        <v-card-title>
          Sélection d'un client
          <v-divider class="mx-4" inset="" vertical=""></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Rechercher"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-divider class="mx-4" inset="" vertical=""></v-divider>
          <v-dialog v-model="dialog" max-width="1000px">
            <template v-slot:activator="{ on }">
              <v-btn class="mb-2" color="primary" dark="" v-on="on">Ajouter</v-btn>
            </template>
            <v-card>
              <v-card-title><span class="headline">{{ formTitle }}</span></v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.lastName" label="Nom" required=""></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.firstName" label="Prénom" required=""></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.address" label="Adresse" required=""></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.mail" label="Mail" required=""></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.phone" label="Telephone"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text="" @click="close">Annuler</v-btn>
                <v-btn color="blue darken-1" text="" @click="save">Enregister</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="customers"
          :search="search"
          hide-default-footer=''
          :items-per-page='-1'
          item-key="mail"
          sort-by='lastName'
        >
          <template v-slot:body="{ items }">
            <tbody>
              <tr :class="item === selectedRow ? 'custom-highlight-row' : ''" @click="handleClick(item)" v-for="item in items" :key="item.mail">
                <td>{{ item.lastName }}</td>
                <td>{{ item.firstName }}</td>
                <td>{{ item.mail }}</td>
                <td>
                  <v-icon class="mr-2" small="" @click="editItem(item)">edit</v-icon>
                  <v-icon small="" @click="deleteItem(item)">delete</v-icon>
                </td>
              </tr>
            </tbody>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon class="mr-2" small="" @click="editItem(item)">edit</v-icon>
            <v-icon small="" @click="deleteItem(item)">delete</v-icon>
          </template>
        </v-data-table>
        <v-btn outlined='' class="cancelCreate" right='' color="#d92616" @click='backHome()'> Annuler </v-btn>
        <v-btn outlined=''  right='' color="#409a1b" @click='validateCustomer()'> Valider </v-btn>
      </v-card>
    </v-layout>
    <v-alert type='error' width="100%" class="alertSelection" icon="error" v-if="isAlertShowned">
      Pas de client sélectionné.
    </v-alert>
  </div>
</template>


<script>
  import router from '../router';
  import customerService from '../services/customer.service'
  export default {
    name: 'listCustomers',
    components: {
    },
    data() {
      return {
        isAlertShowned: false,
        search: '',
        dialog: false,
        selectedRow: null,
        resultSaveCustomer: null,
        headers: [
          { text: 'Nom', align: 'left', value: 'lastName' },
          { text: 'Prénom', align: 'left', value: 'firstName' },
          { text: 'Mail', align: 'left', value: 'mail' },
          { text: 'Actions', value: 'action', sortable: false },
        ],
        customers: [],
        editedIndex: -1,
        editedItem: {
          firstName: null,
          lastName: null,
          address: null,
          mail: null,
          phone: null,
        },
        defaultItem: {
          firstName: null,
          lastName: null,
          address: null,
          mail: null,
          phone: null,
        },
      }
    },
    created () {
      this.initialize()
    },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nouveau client' : 'Edition d\'un client'
      },
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    async mounted() {
      const response = await customerService.getAll();
      this.customers = response.data;
    },
    methods: {
      async initialize () {
        const response = await customerService.getAll();
        this.customers = response.data;
      },
      editItem (item) {
        this.editedIndex = this.customers.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      async save () {
        if(this.editedItem.firstName && this.editedItem.lastName && this.editedItem.mail && this.editedItem.address){
          // Edit
          console.log(this.editedItem)
          if (this.editedIndex > -1) {
            this.resultSaveCustomer = await customerService.updateCustomer(this.editedItem)
          } 
          // New
          else {
            this.resultSaveCustomer = await customerService.saveCustomer(this.editedItem)
          }
          this.initialize()
          this.close()
        }
        else {
        this.resultSaveCustomer = {
                                    status: 'error',
                                    icon: 'error',
                                    msg: 'Information(s) manquante(s)'
                                  }
        }
        await new Promise(resolve => {
          setTimeout(() => {
            this.resultSaveCustomer = null
          }, 2000);
        })
      },
      async deleteItem (item) {
        if (confirm('Etes vous sûr de vouloir supprimer ce client ?')) {
          this.resultSaveComponent = await customerService.deleteCustomer(item)
          this.initialize()
          await new Promise(resolve => {
            setTimeout(() => {
              this.resultSaveCustomer = null
            }, 2000);
          })
        }
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
  .listCustomer
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
