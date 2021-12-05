export const SET_USER = (state, user) => {
    state.user = user
}

export const TOGGLE_LOGIN_STATE = (state, user) => {
    state.isLoggedIn = !state.isLoggedIn
}

export const UPDATE_USER = (state, user) => {
    state.user = {...user.attributes}
}

export const SET_FOUND_USER = (state, user) => {
    if (user) {
        state.foundUser = {...user.attributes}
    }
}
