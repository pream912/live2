import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import firebase from 'firebase/app'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    vuetify,
    firebase,
    render: h => h(App),

    created() {
        firebase.initializeApp({
            apiKey: "AIzaSyCz3nFN_E3CXCSUigKy5qtBbnGc4GiGSI8",
            authDomain: "live2-3af8b.firebaseapp.com",
            projectId: "live2-3af8b",
            storageBucket: "live2-3af8b.appspot.com",
            messagingSenderId: "310056093070",
            appId: "1:310056093070:web:0da53597c0f863587110df"
        })
    }
}).$mount('#app')
