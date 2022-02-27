import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    events: []
  },
  mutations: {
    ADD_EVENT (state, payload) {
      state.events.push(payload)
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
  }
})
