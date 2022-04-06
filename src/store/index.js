import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    alert: {alert: false},
    events: [],
    loggedin: false,
    userProfile: {},
  },
  mutations: {
    setAlert (state, payload) {
      state.alert = payload
    },
    ADD_EVENT (state, payload) {
      state.events.push(payload)
    },
    SET_EVENT (state, payload) {
      state.events = payload
    },
    SET_LOGGED_IN(state, payload) {
      state.loggedin = payload;
    },
    SET_PROFILE (state, payload) {
      state.userProfile = payload
    },
  },
  actions: {
    createAlert ({commit}, payload) {
      const data = {
          alert: true,
          type: payload.type,
          message: payload.message
      }
      commit('setAlert', data)
      setTimeout(() => {
        commit('setAlert', {alert: false})
      }, 3000);
    },
    getProfile ({commit}, payload) {
      firebase.database().ref('users/'+payload).get('once')
      .then((data) => {
        commit('SET_PROFILE', data.val())
      })
    },
    getEvents ({commit}, payload) {
      firebase.database().ref(`events/${payload}`).get('once').then((data) => {
        var dat = data.val()
        let events = []
        for(let i in dat) {
            events.push({
                eid: i,
                ename: dat[i].ename,
                edescription: dat[i].edescription,
                eto: dat[i].eto,
                efrom: dat[i].efrom,
                sduration: dat[i].sduration,
                recording: dat[i].recording,
                sdomain: dat[i].sdomain,
                streamkey: dat[i].streamkey
            })
        }
        commit('SET_EVENT', events)
      })
    }
  },
  modules: {
  },
  getters: {
    loadedEVENTS (state) {
      return state.events
    },
    loggedIn (state) {
      return state.loggedin
    },
    userProfile (state) {
      return state.userProfile
    },
    loadedAlert (state) {
      return state.alert
    },
  }
})
