import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    events: [],
    loggedin: false
  },
  mutations: {
    ADD_EVENT (state, payload) {
      state.events.push(payload)
    },
    SET_LOGGED_IN(state, payload) {
      state.loggedin = payload;
    },
  },
  actions: {
  },
  modules: {
  },
  getters: {
    loadedEVENTS (state) {
      return state.events
    },
    loggedIn (state) {
      return state.loggedin
    }
  }
})
