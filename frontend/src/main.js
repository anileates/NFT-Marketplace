import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

/* Moralis init code */
const serverUrl = "YOUR_SERVER_URL";
const appId = "YOUR_APP_ID";
Moralis.start({ serverUrl, appId });


createApp(App).use(store).use(router).mount('#app')
