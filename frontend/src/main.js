import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

/* Moralis init code */
const serverUrl = "https://kmevmlphg8rq.usemoralis.com:2053/server";
const appId = "lOhK4PrszxppOZxHOZwu1gKfb22o4kI9gssLUftO";
Moralis.start({ serverUrl, appId });


createApp(App).use(store).use(router).mount('#app')
