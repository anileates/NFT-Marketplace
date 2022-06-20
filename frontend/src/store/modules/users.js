import Secrets from "../../../../secrets.json";
import MarketContract from "../../../Contracts/Market.json";
import Web3Modal from "web3modal";
import axios from 'axios';
import { ethers } from "ethers";

const state = {

}

const getters = {
    getFoundUser(state) {
        return state.foundUser
    }
}

const mutations = {
    SET_FOUND_USER(state, user) {
        if (user) {
            state.foundUser = { ...user.attributes }
        }
    }
}

const actions = {
    async searchUser({ }, text) {
        const query = new Moralis.Query('User')
        query.fullText('username', text)

        return await query.find()
    },
    async fetchUser({ commit }, username) {
        const query = new Moralis.Query('User')
        query.equalTo('username', username)

        const results = await query.find()
        console.log(results[0])
        commit('SET_FOUND_USER', results[0])
    },
    async getNFTsOfUser({ }, payload) {
        const options = {
            chain: "goerli",
            address: payload.walletAddress || null
        };

        try {
            const testnetNFTs = await Moralis.Web3API.account.getNFTs(options);

            // Sometimes NFT metadatas is missing on the Moralis side.
            // We need to fetch manually in this case
            for (let i = 0; i < testnetNFTs.result.length; i++) {
                
                if (!testnetNFTs.result[i].metadata) {
                    if(!testnetNFTs.result[i].token_uri) {
                        testnetNFTs.result.splice(i, 1)
                    }

                    let result = await axios.get(testnetNFTs.result[i].token_uri)
                    testnetNFTs.result[i].metadata = JSON.stringify(result.data)
                }

                testnetNFTs.result[i].metadata = JSON.parse(testnetNFTs.result[i].metadata)
            }

            return testnetNFTs.result
        } catch (error) {
            console.log(error)
        }

    },
    async getListedItemsOfUser({ }, payload) {
        const { walletAddress } = payload

        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const marketContract = new ethers.Contract(
            Secrets.MARKET_CONTRACT_ADDRESS,
            MarketContract.abi,
            signer
        );

        try {
            const res = await marketContract.getItemsOf(walletAddress);
            return res
        } catch (err) {
            console.log(err)
        }
    }
}

export default {
    state, actions, mutations, getters
}
