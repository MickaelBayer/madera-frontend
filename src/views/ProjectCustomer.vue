<template lang="pug">
  .home
    .zoneItem
      .homeItem
        .item(@click="redirectItem1")
          img(class="itemImg" src='../assets/add.svg')
          .itemTitle Nouveau client
      .homeItem
        .item(@click="redirectItem2")
          img(class="itemImg" src='../assets/view.svg')
          .itemTitle Client existant
</template>


<script>
  import router from '../router';
  export default {
    name: 'projectCustomer',
    components: {
    },
    data() {
      return {
        role: Number(this.$store.state.user.userRole)
      }
    },
    mounted() {
      this.role = Number(this.$store.state.user.userRole)
    },
    methods: {
      redirectItem1(){
        //fomulaire creation client
        this.$router.push('/addCustomer')
      },
      redirectItem2(){
        //recherche clients existants
        this.$router.push('/listCustomers')
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
