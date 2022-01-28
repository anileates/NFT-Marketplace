import {createRouter, createWebHistory} from 'vue-router'
import Settings from "../components/Settings";
import store from '../store/index'
import Homepage from "../components/Homepage";
import User from "../components/User";
import NotFound from "../components/NotFound";
import NFTPage from "../components/NFTPage";
import InternalErrorPage from "../components/InternalErrorPage";

const routes = [
    {path: '/', component: Homepage},
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
        path: '/users/:username',
        component: User,
        async beforeEnter(to, from, next) {
            await store.dispatch('fetchUser', to.params.username)
            if (store.getters.getFoundUser) {
                next()
            } else {
                await router.push('/not-found')
            }
        }
    },
    {
        path: '/tokens/:tokenAddress/:tokenId',
        component: NFTPage,
        async beforeEnter(to, from, next) {
            if (to.params.tokenAddress && to.params.tokenId) {
                const nft = await store.dispatch('fetchNFT', {
                    token_address: to.params.tokenAddress,
                    token_id: to.params.tokenId
                })
                if (!nft) return await router.push('/not-found')

                to.params.nftMetadata = nft
                return next()
            } else {
                await router.push('/sth-went-wrong')
            }
        }
    },
    {path: '/not-found', component: NotFound},
    {path: '/sth-went-wrong', component: InternalErrorPage},
    {path: '/:pathMatch(.*)*', component: NotFound},
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
