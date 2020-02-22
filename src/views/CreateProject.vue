<template lang="pug">
  .createProject
    | CREER UN PROJET
    | {{$store.state.customer}}
</template>


<script>
  export default {
    name: 'createProject',
    components: {
    },
    data() {
      return{

      }
    },
    computed: {
    },
    mounted() {
    },
    methods: {
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
</style>
