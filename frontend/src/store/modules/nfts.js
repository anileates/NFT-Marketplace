import Secrets from "../../../../secrets.json";
import NFTMarket from "../../../../Contracts/NFTMarket.json";
import NFT from "../../../../Contracts/NFT.json";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import axios from "axios";


const state = {}

const getters = {}

const mutations = {}

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
    return tokenIdMetadata;
  },
  async getItemFromContract({ }, _tokenId) {
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
      { value: cancellingPrice }
    );

    await transaction.wait();
  },
  async createAsset({ }, payload) {
    // { file, assetName, assetDesc, assetPrice }

    // Bu degiskenler zaten component icerisinde kontrol edilecek. Buraya gerek yok
    if (!this.asset.name || !this.asset.description || !this.asset.price || !this.file) {
      return Toast.fire({
        icon: "error",
        title: "Please fill the given places to create an asset.",
      });
    }

    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      this.asset.fileUrl = `https://ipfs.infura.io/ipfs/${added.path}`;
    } catch (err) {
      console.log(err);
    }

    const data = JSON.stringify({
      name: this.asset.name,
      description: this.asset.description,
      image: this.asset.fileUrl,
    });

    /* first, upload the metadata to IPFS */
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      /* after file is uploaded to IPFS, pass the URL to save it on Rinkeby */
      await this.createSale(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  },
  async createSale(url) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(
      Secrets.third_nft_contract_address,
      NFTContract.abi,
      signer
    );
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();

    let event = tx.events[0];
    let value = event.args[2];

    let tokenId = value.toNumber();
    // TODO Not this.asset
    const price = ethers.utils.parseUnits(this.asset.price, "ether");

    transaction = await contract.approveFor(
      Secrets.third_market_contract_address,
      tokenId
    );
    tx = await transaction.wait();

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(
      Secrets.third_market_contract_address,
      NFTMarket.abi,
      signer
    );
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    console.log("Price 👉", price);
    console.log("Listin Price 👉", listingPrice);

    transaction = await contract.createMarketItem(
      Secrets.third_nft_contract_address,
      tokenId,
      price,
      { value: listingPrice }
    );
    const lastRes = await transaction.wait();
    console.log(lastRes);
    await router.push('/')
  },
}

export default {
  state, actions, mutations, getters
}