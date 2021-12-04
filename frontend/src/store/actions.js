import Vue from 'vue'
import router from '../router/index' 

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

export const logout = async ({ commit, dispatch }) => {
    await Moralis.User.logOut()

    commit('SET_USER', null)
    dispatch('toggleLoginStatus')
    
    await router.push('/')
}

export const updateUser = async({ commit }, updatedUser) => {
    let user = Moralis.User.current();

    for(let [key, value] of Object.entries(updatedUser)){
        user.set(key, value)
    }

    let newUser = await user.save()
    commit('UPDATE_USER', newUser)
}