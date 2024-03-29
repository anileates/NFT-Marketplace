import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueSweetalert2 from 'vue-sweetalert2';
import { ethers } from "ethers";
import Web3Modal from "web3modal";

/* Moralis init code */
const serverUrl = process.env.VUE_APP_SERVER_URL
const appId = process.env.VUE_APP_APP_ID
Moralis.start({ serverUrl, appId });

const app = createApp(App)

// Vue 3 does not support global filters anymore. We can use this way to make global filters.
app.config.globalProperties.$filters = {
    minimizeEthAddress(address_) {
        // This methods converts an address to this format => 0x12Ab...34Cd
        const address = address_.toString()
        if (!address.startsWith('0x')) return null

        const beginning = address.slice(0, 6)
        const ending = address.slice(address.length - 4, address.length)

        const filteredAddress = beginning + '...' + ending;
        return filteredAddress
    },
    getPriceInEth(price) {
        if (price) {
            return ethers.utils.formatUnits(
                price.toString(),
                "ether"
            );
        } else {
            return null;
        }
    },
    async blockNumberToDate(blockNumber) {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);

        const timestamp = (await provider.getBlock(blockNumber)).timestamp
        const date = new Date(timestamp)
        const month = date.toLocaleString('en', { month: 'short' })
        const day = date.getDate()

        return month + " " + day
    }
}

app.use(router).use(store).use(VueSweetalert2)
app.mount('#app')
