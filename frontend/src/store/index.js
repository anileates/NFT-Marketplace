import { createStore } from 'vuex'
import * as actions from './actions'
import * as mutations from './mutations'
import * as getters from './getters'

export default createStore({
  state: {
    isLoggedIn: false,
    user: null,
    foundUser: null
  },
  mutations,
  actions,
  getters,
  modules: {
  }
})
