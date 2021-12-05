import {createRouter, createWebHistory} from 'vue-router'
import Settings from "../components/Settings";
import store from '../store/index'
import Homepage from "../components/Homepage";
import User from "../components/User";
import NotFound from "../components/NotFound";

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
    },
    {
        path: '/user/:username',
        component: User,
        async beforeEnter(to, from, next){
            await store.dispatch('fetchUser', to.params.username)
            if(store.getters.getFoundUser){
                next()
            }else {
                await router.push('/not-found')
            }
        }
    },
    { path: '/not-found', component: NotFound },
    { path: '/:pathMatch(.*)*', component: NotFound },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
