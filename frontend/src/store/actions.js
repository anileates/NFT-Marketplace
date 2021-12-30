import Vue from 'vue'
import router from '../router/index'

export const initAuth = async ({ commit, dispatch }) => {
    let user = Moralis.User.current();

    if (!user) {
        user = await Moralis.authenticate()

        /**
         * By default a user data can be read by only itself.
         * This code piece changes access control list to 'public read' so that everyone can see user information
         */
        const userACL = new Moralis.ACL(Moralis.User.current());
        userACL.setPublicReadAccess(true);
        user.setACL(userACL);
        await user.save();
    }

    commit('SET_USER', { ...user.attributes })
    dispatch('toggleLoginStatus')
}

export const toggleLoginStatus = ({ state, commit }) => {
    commit('TOGGLE_LOGIN_STATE')
}

export const logout = async ({ commit, dispatch }) => {
    await Moralis.User.logOut()

    commit('SET_USER', null)
    dispatch('toggleLoginStatus')

    await router.push('/')
}

export const updateUser = async ({ commit }, updatedUser) => {
    let user = Moralis.User.current();

    for (let [key, value] of Object.entries(updatedUser)) {
        user.set(key, value)
    }

    let newUser = await user.save()
    commit('UPDATE_USER', newUser)
}

export const fetchUser = async ({ commit }, username) => {
    const query = new Moralis.Query('User')
    query.equalTo('username', username)

    const results = await query.find()
    console.log(results[0])
    commit('SET_FOUND_USER', results[0])
}