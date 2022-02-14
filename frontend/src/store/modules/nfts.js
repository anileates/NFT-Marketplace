const state = {

}

const getters = {

}

const mutations = {

}

const actions = {
    async searchNFT({ }, text) {
        // TODO add a select box next to search box and search by chain option
        const options = { q: text, chain: "eth", filter: "name", limit: 10 }; // TODO limit value will be changed

        return await Moralis.Web3API.token.searchNFTs(options)
    },
    async fetchNFT({ }, payload) {
        // TODO add a select box next to search box and search by chain option
        const options = {
            address: payload.token_address,
            token_id: payload.token_id,
            chain: payload.chain || 'eth'
        };

        const tokenIdMetadata = await Moralis.Web3API.token.getTokenIdMetadata(options);
        return tokenIdMetadata
    }
}

export default {
    state, actions, mutations, getters
}