const state = {

}

const getters = {
    getFoundUser (state) {
        return state.foundUser
    }
}

const mutations = {
    SET_FOUND_USER (state, user) {
        if (user) {
            state.foundUser = {...user.attributes}
        }
    }
}

const actions = {
    async searchUser ({}, text)  {
        const query = new Moralis.Query('User')
        query.fullText('username', text)
    
        return await query.find()
    },
    async fetchUser ({commit}, username) {
        const query = new Moralis.Query('User')
        query.equalTo('username', username)
    
        const results = await query.find()
        console.log(results[0])
        commit('SET_FOUND_USER', results[0])
    }
}

export default {
    state, actions, mutations, getters
}
