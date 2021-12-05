import {createRouter, createWebHistory} from 'vue-router'
import Settings from "../components/Settings";
import store from '../store/index'
import Homepage from "../components/Homepage";

const routes = [
    { path: '/', component: Homepage },
    {
        path: '/settings',
        component: Settings,
        beforeEnter(to, from, next) {
            if (store.getters.isAuthenticated) {
                next()
            } else {
                next('/')
            }
        }
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
