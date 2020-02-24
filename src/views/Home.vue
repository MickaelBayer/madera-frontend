<template lang="pug">
  .home
    .zoneItem
      .homeItem
        .item(@click="redirectItem1")
          img(v-if="role===1" class="itemImg" src='../assets/add.svg')
          img(v-else-if="role===2" class="itemImg" src='../assets/sketch.svg')
          img(v-else class="itemImg" src='../assets/repair.svg')
          .itemTitle {{itemTitle1}}
      .homeItem
        .item(@click="redirectItem2")
          img(class="itemImg" src='../assets/view.svg')
          .itemTitle {{itemTitle2}}
</template>


<script>
  import router from '../router';
  import state from '../store/store'
  export default {
    name: 'home',
    components: {
    },
    data() {
      return {
        role: Number(this.$store.state.user.userRole)
      }
    },
    computed: {
      itemTitle1() {
        if(this.role === 1) return 'Ajouter un utilisateur'
        if(this.role === 2) return 'Créer un projet'
        return 'Les modules'
      },
      itemTitle2() {
        if(this.role === 1) return 'Les utilisateurs'
        return 'Les projets'
      }
    },
    mounted() {
      this.role = Number(this.$store.state.user.userRole)
    },
    methods: {
      redirectItem1(){
        if(this.role === 1) this.$router.push('/adduser')
        else if (this.role === 2) this.$router.push('/listCustomers')
        else this.$router.push('/listModules')
      },
      redirectItem2(){
        if(this.role === 1) this.$router.push('/userlist')
        else this.$router.push('/projectList')
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
