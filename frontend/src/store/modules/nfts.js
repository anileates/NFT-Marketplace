import Secrets from "../../../../secrets.json";
import MarketContract from "../../../Contracts/Market.json";
import NFTContract from "../../../Contracts/CustomNFT.json";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");


const state = {}

const getters = {}

const mutations = {}

const actions = {
  async searchNFT({ }, text) {
    // TODO add a select box next to search box and search by chain option
    const options = { q: text, chain: "eth", filter: "name", limit: 10 }; // TODO limit value will be changed

    return await Moralis.Web3API.token.searchNFTs(options)
  },
  async mintToken({ }, payload) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let asset = payload;

    // Upload the media to the IPFS
    try {
      const added = await client.add(asset.file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      asset.fileUrl = `https://ipfs.infura.io/ipfs/${added.path}`;
    } catch (err) {
      console.log(err);
    }

    const data = JSON.stringify({
      name: asset.name,
      description: asset.description,
      imageUrl: asset.fileUrl,
    });


    /* upload the metadata to IPFS */
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      /* next connect to contract and mint the item */
      let contract = new ethers.Contract(
        Secrets.NFT_CONTRACT_ADDRESS,
        NFTContract.abi,
        signer
      );

      let transaction = await contract.mintToken(url);
      let tx = await transaction.wait();
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  },
  async createSale(url) {
    let tokenId = value.toNumber();
    // TODO Not this.asset
    const price = ethers.utils.parseUnits(this.asset.price, "ether");

    transaction = await contract.approveFor(
      Secrets.MARKET_CONTRACT_ADDRESS,
      tokenId
    );
    tx = await transaction.wait();

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(
      Secrets.MARKET_CONTRACT_ADDRESS,
      NFTMarket.abi,
      signer
    );
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    console.log("Price 👉", price);
    console.log("Listin Price 👉", listingPrice);

    transaction = await contract.createMarketItem(
      Secrets.NFT_CONTRACT_ADDRESS,
      tokenId,
      price,
      { value: listingPrice }
    );
    const lastRes = await transaction.wait();
    console.log(lastRes);
    await router.push('/')
  },
  async fetchNFT({ }, payload) {
    // TODO add a select box next to search box and search by chain option
    const options = {
      address: payload.token_address,
      token_id: payload.token_id,
      chain: payload.chain || 'eth'
    };

    const tokenIdMetadata = await Moralis.Web3API.token.getTokenIdMetadata(options);
    return tokenIdMetadata;
  },
  async getItemFromContract({ }, _tokenId) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      Secrets.MARKET_CONTRACT_ADDRESS,
      NFTMarket.abi,
      signer
    );

    const tokenContract = new ethers.Contract(
      Secrets.NFT_CONTRACT_ADDRESS,
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

    // TODO this is not a good way to find the NFT we are looking for. This may cause bugs. Gonna change whole the method after changing the smart contract
    let item2 = {};
    items.forEach((item) => {
      if (item.tokenId == _tokenId) {
        item2 = item
      }
    });

    return item2;
  },
  async cancelListing() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(
      Secrets.MARKET_CONTRACT_ADDRESS,
      NFTMarket.abi,
      signer
    );

    let cancellingPrice = await contract.getCancellingPrice();
    cancellingPrice = cancellingPrice.toString();

    // TODO remove this.$route....
    let transaction = await contract.cancelSale(
      Secrets.NFT_CONTRACT_ADDRESS,
      this.$route.params.tokenId.toString(),
      { value: cancellingPrice }
    );

    await transaction.wait();
  },


}

export default {
  state, actions, mutations, getters
}