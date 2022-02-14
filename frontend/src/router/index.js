import { createRouter, createWebHistory } from 'vue-router'
import Settings from "../views/Settings";
import store from '../store/index'
import Homepage from "../views/Homepage";
import User from "../views/User";
import NotFound from "../views/NotFound";
import NFTPage from "../views/NFTPage";
import CreateItemPage from "../views/CreateItemPage";
import InternalErrorPage from "../views/InternalErrorPage";

const routes = [
    { path: '/', component: Homepage, meta: { title: 'Home' } },
    {
        path: '/settings',
        component: Settings,
        beforeEnter(to, from, next) {
            if (store.getters.isAuthenticated) {
                next()
            } else {
                next('/')
            }
        },
        meta: {
            title: 'Settings'
        }
    },
    {
        path: '/users/:username',
        component: User,
        async beforeEnter(to, from, next) {
            await store.dispatch('fetchUser', to.params.username)
            if (store.getters.getFoundUser) {
                to.params.pageTitle = to.params.username + ' - Profile'
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
                to.params.pageTitle = JSON.parse(to.params.nftMetadata.metadata).name

                return next()
            } else {
                await router.push('/sth-went-wrong')
            }
        }
    },
    {
        path: '/testnet-tokens/:tokenAddress/:tokenId',
        component: NFTPage,
        async beforeEnter(to, from, next) {
            if (to.params.tokenAddress && to.params.tokenId) {
                const nft = await store.dispatch('fetchNFT', {
                    token_address: to.params.tokenAddress,
                    token_id: to.params.tokenId,
                    chain: 'rinkeby'
                })
                if (!nft) return await router.push('/not-found')

                to.params.nftMetadata = nft
                to.params.pageTitle = JSON.parse(to.params.nftMetadata.metadata).name

                return next()
            } else {
                await router.push('/sth-went-wrong')
            }
        }
    },
    {
        path: '/create-new-item',
        component: CreateItemPage,
        meta: {
            title: `Create Asset`
        }
    },
    {
        path: '/not-found', component: NotFound,
        meta: {
            title: `404 Not Found`
        }
    },
    {
        path: '/sth-went-wrong', component: InternalErrorPage,
        meta: { title: 'Ooopppss.' }
    },
    {
        path: '/:pathMatch(.*)*', component: NotFound,
        meta: { title: `404 Not Found` }
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.afterEach((to, from, next) => {
    document.title = `${to.meta.title || to.params.pageTitle} | MyMarketPlace`
})

export default router
