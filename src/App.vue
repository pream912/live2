<template>
    <v-app>
        <app-layout v-if="authState"></app-layout>
        <app-auth v-if="!authState"></app-auth>
    </v-app>
</template>

<script>
import Layout from './views/Layout.vue'
import Auth from './views/Auth.vue'
export default {
  name: 'App',

  data: () => ({
    
  }),
  components: {
      AppLayout: Layout,
      AppAuth: Auth
  },
  computed: {
    authState () {
      return this.$store.getters.loggedIn 
    }
  }
};
</script>
