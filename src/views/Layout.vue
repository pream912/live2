<template>
    <div>
        <v-navigation-drawer app clipped v-model="drawer">
            <v-list-item>
                <v-list-item-content>
                    <!-- <v-list-item-title class="text-h4">
                        You-2-Live
                    </v-list-item-title> -->
                    <v-img v-if="$vuetify.theme.dark" max-width="300" :src="require('../assets/y2l_logo_dark.png')"></v-img>
                    <v-img v-else max-width="300" :src="require('../assets/y2l_logo.png')"></v-img>
                </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list dense nav>
                <v-list-item link to="/events">
                    <v-list-item-icon>
                        <v-icon> mdi-calendar </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Events</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link to="/profile">
                    <v-list-item-icon>
                        <v-icon> mdi-account </v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Profile</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <template v-slot:append>
                <div class="pa-2">
                    <v-switch label="Dark mode" v-model="$vuetify.theme.dark"></v-switch>
                </div>
                <div class="pa-2">
                    <v-btn color="orange" @click="logout">Logout</v-btn>
                </div>
            </template>
        </v-navigation-drawer>
        <v-app-bar app clipped-left>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>You<span class="red--text">2</span>Live.com</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-avatar>
                <v-icon>
                    mdi-account-circle
                </v-icon>
            </v-avatar>
            <v-toolbar-title>{{user.name}}</v-toolbar-title>
        </v-app-bar>
        <v-main>
            <v-alert :value="alert.alert" :type="alert.type">{{alert.message}}</v-alert>
            <router-view/>
        </v-main>
    </div>
</template>

<script>
import {supabase} from '../supabase'
export default {
  data: () => ({
    drawer: true,
  }),
  methods: {
    logout () {
        supabase.auth.signOut()
    }
  },
  computed: {
    user () {
        return this.$store.getters.userProfile
    },

    alert () {
        return this.$store.getters.loadedAlert
    },
  }
};
</script>
