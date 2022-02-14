import router from '../../router/index';

export default {
    state: {
        user: null,
        isLoggedIn: false
    },
    mutations: {
        SET_USER (state, user){
            state.user = user
        },
        TOGGLE_LOGIN_STATE (state){
            state.isLoggedIn = !state.isLoggedIn
        },
        UPDATE_USER (state, user){
            state.user = {...user.attributes}
        }
    },
    actions: {
        async initAuth ({ commit, dispatch }){
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
            commit('TOGGLE_LOGIN_STATE')
        },
        async toggleLoginStatus ({ state, commit }){
            commit('TOGGLE_LOGIN_STATE')
        },
        async logout ({commit, dispatch}){
            await Moralis.User.logOut()
        
            commit('SET_USER', null)
            dispatch('toggleLoginStatus')
        
            await router.push('/')
        },
        async updateUser ({commit}, updatedUser) {
            // TODO Alert 'mail already exists' if it returns error
            let user = Moralis.User.current();
        
            for (let [key, value] of Object.entries(updatedUser)) {
                user.set(key, value)
            }
        
            let newUser = await user.save()
            commit('UPDATE_USER', newUser)
        }
    },
    getters: {
        isAuthenticated (state){
            return state.isLoggedIn
        },
        getCurrentUser (state){
            return state.user
        }
    }
}
