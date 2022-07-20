import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import {supabase} from './supabase'
// import firebase from 'firebase/app'
// import { createClient } from '@supabase/supabase-js'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),

    created() {
        supabase.auth.onAuthStateChange((event) => {
            if (event == 'SIGNED_IN') {
                store.commit('SET_LOGGED_IN', true)
            }
            if (event == 'SIGNED_OUT') {
                store.commit('SET_LOGGED_IN', false)
            }
        })
        // const options = {
        //     schema: 'public',
        //     headers: { 'x-my-custom-header': 'you2live' },
        //     autoRefreshToken: true,
        //     persistSession: true,
        //     detectSessionInUrl: true
        // }
        // const supabase = createClient("https://xqcrijhmvpiqqgjltumo.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxY3JpamhtdnBpcXFnamx0dW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTc5NTU4NDcsImV4cCI6MTk3MzUzMTg0N30.ti2zfjv70j5WP8e8XrnvqBO9IWmqN7F0eGNJly34A_o", options)
        // console.log(supabase);


        // firebase.initializeApp({
        //     apiKey: "AIzaSyCz3nFN_E3CXCSUigKy5qtBbnGc4GiGSI8",
        //     authDomain: "live2-3af8b.firebaseapp.com",
        //     projectId: "live2-3af8b",
        //     storageBucket: "live2-3af8b.appspot.com",
        //     messagingSenderId: "310056093070",
        //     appId: "1:310056093070:web:0da53597c0f863587110df",
        //     databaseURL: "https://live2-3af8b-default-rtdb.asia-southeast1.firebasedatabase.app"
        // })
        // firebase.auth().onAuthStateChanged(user => {
        //     if(user) {
        //         store.commit('SET_LOGGED_IN', true)
        //         store.dispatch('getProfile', user.uid)
        //         store.dispatch('getEvents', user.uid)
        //     }
        //     else {
        //       store.commit('SET_LOGGED_IN', false) 
        //     }
        // })
    }
}).$mount('#app')
