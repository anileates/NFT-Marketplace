import Secrets from "../../../../secrets.json";
import MarketContract from "../../../Contracts/Market.json";
import Web3Modal from "web3modal";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";
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
        // get testnet NFTs for user
        const testnetNFTs = await Moralis.Web3API.account.getNFTs({ chain: "rinkeby", address: payload.walletAddress });

        // get polygon NFTs for address
        const options = {
            chain: "eth",
            address: payload.walletAddress,
        };
        const etherNFTs = await Moralis.Web3API.account.getNFTs(options);
        return { etherNFTs, testnetNFTs }
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
        } catch (err) {
            console.log(err)
        }
    }
}

export default {
    state, actions, mutations, getters
}
