import { createStore } from 'vuex'
import * as actions from './actions'
import * as mutations from './mutations'
import * as getters from './getters'
import accounts from './modules/accounts';
import nfts from './modules/nfts';
import users from './modules/users';

export default createStore({
  state: {
  },
  mutations,
  actions,
  getters,
  modules: {
    accounts,
    nfts,
    users
  }
})
