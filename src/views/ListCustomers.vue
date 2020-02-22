<template lang="pug">
    .zoneItem
      .homeItem
        .item(@click="redirectItem1")
          img(class="itemImg" src='../assets/add.svg')
          .itemTitle Nouveau client
      .homeItem
        .item(@click="redirectItem2")
          img(class="itemImg" src='../assets/view.svg')
          .itemTitle Client existant
      div {{ customers }}
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
        customers: []
      }
    },
    async mounted() {
      const response = await customerService.getAll();
      this.customers = response.data;
    },
    methods: {
      redirectItem1(){
        //fomulaire creation client
        this.$router.push('/addModule')
      },
      redirectItem2(){
        //recherche clients existants
        this.$router.push('/projectList')
      }
    }
  }
</script>

<style lang="sass" scoped>
  .home
    height: 100%
    width: 100%
    display: flex
    flex-direction: row
    justify-content: center
  .zoneItem
    display: flex
    width: 80%
  .homeItem
    width: 100%
    height: 100%
    display: flex
    justify-content: center
    align-items: center
  .item
    background: #409a1b
    height: 40vh
    cursor: pointer
    width: 40vh
    border-radius: 0.8rem
    display: flex
    flex-direction: column
    box-shadow: 7px 7px 20px 0 rgba(166,166,166,1)
  .itemTitle
    height: 8rem
    color: white
    display: flex
    justify-content: center
    align-items: center
    font-size: 1.7rem
    font-weight: bold
  .itemImg
    height: 80%
    margin: 1rem 0
  @media(max-width: 850px)
    .zoneItem
      flex-direction: column
</style>
