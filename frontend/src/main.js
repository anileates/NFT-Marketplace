import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueSweetalert2 from 'vue-sweetalert2';

/* Moralis init code */
const serverUrl = process.env.VUE_APP_SERVER_URL
const appId = process.env.VUE_APP_APP_ID
Moralis.start({ serverUrl, appId });


createApp(App).use(store).use(router).use(VueSweetalert2).mount("#app")