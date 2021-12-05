export const getCurrentUser = (state) => {
    return state.user
}

export const isAuthenticated = (state) => {
    return state.isLoggedIn
}

export const getFoundUser = (state) => {
    return state.foundUser
}