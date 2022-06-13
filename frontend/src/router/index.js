import { createRouter, createWebHistory } from 'vue-router'
import Settings from "../views/Settings";
import store from '../store/index'
import Homepage from "../views/Homepage";
import User from "../views/User";
import NotFound from "../views/NotFound";
import NFTPage from "../views/NFTPage";
import CreateItemPage from "../views/CreateItemPage";
import CreateCollectionPage from "../views/CreateCollectionPage";
import InternalErrorPage from "../views/InternalErrorPage";
import CollectionPage from "../views/CollectionPage";

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
            const tokenAddress = to.params.tokenAddress;
            const tokenId = to.params.tokenId
            if (!tokenAddress || !tokenId) return await router.push('/sth-went-wrong');

            try {
                const nft = await store.dispatch('fetchNFT', {
                    token_address: tokenAddress,
                    token_id: tokenId,
                    chain: 'eth'
                });

                to.params.nft = nft;
                to.params.pageTitle = JSON.parse(to.params.nft.metadata).name;

                return next();
            } catch (error) {
                console.log(error)
                await router.push('/sth-went-wrong')
            }
        }
    },
    {
        path: '/testnet-tokens/:tokenAddress/:tokenId',
        component: NFTPage,
    },
    {
        path: '/create-new-item',
        component: CreateItemPage,
        meta: {
            title: `Create Asset`
        }
    },
    {
        path: '/create-collection',
        component: CreateCollectionPage,
        meta: {
            title: 'Create Collection'
        }
    },
    {
        path: '/collections/:tokenAddress',
        component: CollectionPage,
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
