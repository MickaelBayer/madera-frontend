<template lang="pug">
  .home
    HelloWorld(:msg="msg")
    exemple-component
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue'
import exempleComponent from '@/components/exempleComponent.vue'

export default {
  name: 'home',
  components: {
    HelloWorld,
    exempleComponent
  },
  data() {
    return {
      msg: 'Welcome to Madera Front'
    }
  }
}
</script>
