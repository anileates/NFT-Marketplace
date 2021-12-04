export const SET_USER = (state, user) => {
    state.user = user
}

export const TOGGLE_LOGIN_STATE = (state, user) => {
    state.isLoggedIn = !state.isLoggedIn
}