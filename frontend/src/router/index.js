import {createRouter, createWebHistory} from 'vue-router'
import Settings from "../components/Settings";

const routes = [
    // { path: '/', component: Homepage },
    { path: '/settings', component: Settings }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
