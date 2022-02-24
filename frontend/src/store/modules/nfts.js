import Secrets from "../../../../secrets.json";
import NFTMarket from "../../../../Contracts/NFTMarket.json";
import NFT from "../../../../Contracts/NFTMarket.json";
import {ethers} from "ethers";
import Web3Modal from "web3modal";
import axios from "axios";


const state = {}

const getters = {}

const mutations = {}

const actions = {
    async searchNFT({}, text) {
        // TODO add a select box next to search box and search by chain option
        const options = {q: text, chain: "eth", filter: "name", limit: 10}; // TODO limit value will be changed

        return await Moralis.Web3API.token.searchNFTs(options)
    },
    async fetchNFT({}, payload) {
        // TODO add a select box next to search box and search by chain option
        const options = {
            address: payload.token_address,
            token_id: payload.token_id,
            chain: payload.chain || 'eth'
        };

        const tokenIdMetadata = await Moralis.Web3API.token.getTokenIdMetadata(options);
        return tokenIdMetadata;
    },
    async getItemFromContract() {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const marketContract = new ethers.Contract(
            Secrets.third_market_contract_address,
            NFTMarket.abi,
            signer
        );

        const tokenContract = new ethers.Contract(
            Secrets.third_nft_contract_address,
            NFT.abi,
            provider
        );
        const data = await marketContract.fetchItemsCreated();

        const items = await Promise.all(
            data.map(async (i) => {
                const tokenUri = await tokenContract.tokenURI(i.tokenId);
                const meta = await axios.get(tokenUri);
                let price = ethers.utils.formatUnits(i.price.toString(), "ether");
                let item = {
                    price,
                    tokenId: i.tokenId.toNumber(),
                    seller: i.seller,
                    owner: i.owner,
                    image: meta.data.image,
                };

                return item;
            })
        );

        return items[0];
    },
    async cancelListing() {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        let contract = new ethers.Contract(
            Secrets.third_market_contract_address,
            NFTMarket.abi,
            signer
        );

        let cancellingPrice = await contract.getCancellingPrice();
        cancellingPrice = cancellingPrice.toString();

        // TODO remove this.$route....
        let transaction = await contract.cancelSale(
            Secrets.third_nft_contract_address,
            this.$route.params.tokenId.toString(),
            {value: cancellingPrice}
        );

        await transaction.wait();
    },
}

export default {
    state, actions, mutations, getters
}