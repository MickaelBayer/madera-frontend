<template lang="pug">
  .createProject CREER UN PROJET {{$store.state.customer}} {{$store.state.customer.mail}}
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
</style>
