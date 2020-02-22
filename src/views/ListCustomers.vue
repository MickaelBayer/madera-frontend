<template>
  <div class="listCustomer">
    <v-layout child-flex>
      <v-card>
        <v-card-title>
          Sélection d'un client
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Rechercher"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="customers"
          :search="search"
          hide-default-footer=''
          item-key="mail"
        >
          <template v-slot:body="{ items }">
            <tbody>
              <tr :class="item === selectedRow ? 'custom-highlight-row' : ''" @click="handleClick(item)" v-for="item in items" :key="item.mail">
                <td>{{ item.lastName }}</td>
                <td>{{ item.firstName }}</td>
                <td>{{ item.mail }}</td>
              </tr>
            </tbody>
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
        selectedRow: null,
        headers: [
          { text: 'Nom', align: 'left', value: 'lastName' },
          { text: 'Prénom', align: 'left', value: 'firstName' },
          { text: 'Mail', align: 'left', value: 'mail' }
        ],
        customers: []
      }
    },
    async mounted() {
      const response = await customerService.getAll();
      this.customers = response.data;
    },
    methods: {
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
