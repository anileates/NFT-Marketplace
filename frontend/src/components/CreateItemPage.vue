<template lang="pug">
.create-item-page
  input(v-model="this.asset.name", placeholder="Asset Name")
  input(v-model="this.asset.description", placeholder="Asset Description")
  input(v-model="this.asset.price", placeholder="Asset Price")
  input(type="file", ref="inputImageUpload")
  button(@click="this.createAsset") Create

  br
  br
  br
  button(@click="this.getUserTokens") Get Your Tokens
  br
  br
  br
  button(@click="this.loadNFTs") Get NFTs
</template>

<script>
import { Toast } from "../SweetAlert";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import NFTContract from "../../../Contracts/NFT.json";
import NFTMarket from "../../../Contracts/NFTMarket.json";
import Secrets from "../../../secrets.json";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export default {
  name: "CreateItemPage",
  data() {
    return {
      asset: {
        name: undefined,
        description: undefined,
        price: undefined,
        fileUrl: undefined,
      },
    };
  },
  methods: {
    async createAsset() {
      const file = this.$refs.inputImageUpload.files[0];

      if (
        !this.asset.name ||
        !this.asset.description ||
        !this.asset.price ||
        this.asset.fileUrl
      ) {
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

      /* first, upload the metadata to IPFS */
      const data = JSON.stringify({
        name: this.asset.name,
        description: this.asset.description,
        image: this.asset.fileUrl,
      });

      try {
        const added = await client.add(data);
        const url = `https://ipfs.infura.io/ipfs/${added.path}`;

        /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
        await this.createSale(url);
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    },
    async createSale(url) {
      console.log(url);
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
      console.log("Event 👉", event);
      console.log("Value 👉", value);
      console.log("Value ToNumber 👉", value.toNumber());

      let tokenId = value.toNumber();
      const price = ethers.utils.parseUnits(this.asset.price, "ether");

      transaction = await contract.approveFor(Secrets.third_market_contract_address, tokenId);
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
      // router.push('/')
    },
    async getUserTokens() {
      // get testnet NFTs for user
      // const testnetNFTs = await Moralis.Web3API.account.getNFTs({ chain: 'ropsten' });

      const options = {
        chain: "rinkeby",
        address: Secrets.wallets.new_wallet_address,
      };
      const polygonNFTs = await Moralis.Web3API.account.getNFTs(options);
      console.log(polygonNFTs);
    },
    async loadNFTs() {
      console.log("xxxxxxx");
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
        NFTContract.abi,
        provider
      );
      const data = await marketContract.fetchMyNFTs();

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

      console.log("ITEMs 👉", items);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>