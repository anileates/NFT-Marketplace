import Vue from 'vue'

export const initAuth = async ({ commit, dispatch }) => {
    let user = Moralis.User.current();

    if (!user) {
        user = await Moralis.authenticate()
    }

    commit('SET_USER', { ...user.attributes })
    dispatch('toggleLoginStatus')
}

export const toggleLoginStatus = ({state, commit}) => {
    commit('TOGGLE_LOGIN_STATE')
}