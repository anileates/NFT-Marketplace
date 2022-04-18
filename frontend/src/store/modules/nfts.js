import Secrets from "../../../../secrets.json";
import MarketContract from "../../../Contracts/Market.json";
import NFTContract from "../../../Contracts/CustomNFT.json";
import ERC721 from "../../../Contracts/ERC721.json";
import ERC20 from '../../../Contracts/ERC20.json'
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
      image: asset.fileUrl,
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

      return true
    } catch (error) {
      console.log("Error uploading file: ", error);
      return false
    }
  },
  async createSale({ }, payload) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress()

    let { tokenAddress, tokenId, price } = payload
    let _price = ethers.utils.parseUnits(price, "ether");

    try {
      /* next connect to contract and mint the item */
      let nftContract = new ethers.Contract(
        tokenAddress,
        ERC721.abi,
        signer
      );

      // Check if the market_contract is approved for user's tokens or not
      let isApproved = await nftContract.isApprovedForAll(
        signerAddress,
        Secrets.MARKET_CONTRACT_ADDRESS
      );

      if (!isApproved) {
        let transaction = await nftContract.setApprovalForAll(Secrets.MARKET_CONTRACT_ADDRESS, true);

        await transaction.wait();
      }

      let marketContract = new ethers.Contract(
        Secrets.MARKET_CONTRACT_ADDRESS,
        MarketContract.abi,
        signer
      )

      let transaction = await marketContract.putOnSale(
        tokenAddress,
        tokenId,
        _price,
        { value: "10000000000000000" }
      )

      let tx = await transaction.wait();

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  },
  async cancelListing({ }, listingId) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    try {
      let marketContract = new ethers.Contract(
        Secrets.MARKET_CONTRACT_ADDRESS,
        MarketContract.abi,
        signer
      );

      let transaction = await marketContract.cancelSale(listingId);

      await transaction.wait();
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  },
  async buyNow({ }, payload) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let _price = ethers.utils.formatUnits(payload.price.toString(), "wei");
    try {
      let marketContract = new ethers.Contract(
        Secrets.MARKET_CONTRACT_ADDRESS,
        MarketContract.abi,
        signer
      );

      let transaction = await marketContract.buyNFT(
        payload.listingId.toString(),
        { value: _price.toString() }
      )

      await transaction.wait();
      return true
    } catch (error) {
      console.log(error)
      return false;
    }
  },
  async fetchNFT({ }, payload) {
    const options = {
      address: payload.token_address,
      token_id: payload.token_id,
      chain: payload.chain || 'eth'
    };

    let tokenData = await Moralis.Web3API.token.getTokenIdMetadata(options);

    try {
      if (!tokenData.metadata) {
        let result = await axios.get(tokenData.token_uri)
        tokenData.metadata = JSON.stringify(result.data)
      }

      return tokenData;
    } catch (error) {
      console.log(error)
    }

  },
  async makeOffer({ }, payload) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress()
    const WETH_ADDRESS = "0xc778417E063141139Fce010982780140Aa0cD5Ab";

    let _price = ethers.utils.parseUnits(payload.price, "ether");

    let WETHContract = new ethers.Contract(
      WETH_ADDRESS,
      ERC20.abi,
      signer
    );

    let marketContract = new ethers.Contract(
      Secrets.MARKET_CONTRACT_ADDRESS,
      MarketContract.abi,
      signer
    );

    try {
      /**
       * If WETH allowance is not enough, approve the MarketContract for WETH allowance
       */
      const wethAllowanceOfMarket = await WETHContract.allowance(signerAddress, Secrets.MARKET_CONTRACT_ADDRESS)

      if (wethAllowanceOfMarket < _price) {
        let transaction = await WETHContract.approve(Secrets.MARKET_CONTRACT_ADDRESS, _price);
        await transaction.wait();
      }

      const transaction = await marketContract.placeBid(payload.tokenAddress, payload.tokenId, _price)
      await transaction.wait()

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  },
  async acceptOffer ({ }, payload) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress()

    let marketContract = new ethers.Contract(
      Secrets.MARKET_CONTRACT_ADDRESS,
      MarketContract.abi,
      signer
    );

    let nftContract = new ethers.Contract(payload.nftContractAddress, ERC721.abi, signer);

    try {
      // Check if MarketContract is approved. If not, approve the contract. 
      const isApproved = await nftContract.isApprovedForAll(signerAddress, Secrets.MARKET_CONTRACT_ADDRESS);
      const approvedAddress = await nftContract.getApproved(payload.tokenId)
      if(!isApproved && approvedAddress != signerAddress) {
        let transaction = await nftContract.setApprovalForAll(Secrets.MARKET_CONTRACT_ADDRESS, true);
        await transaction.wait();
      }

      let transaction = await marketContract.acceptBid(payload.bidId)
      await transaction.wait()

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  },
  async getItemFromContract({ }, _tokenId) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      Secrets.MARKET_CONTRACT_ADDRESS,
      MarketContract.abi,
      signer
    );

    const tokenContract = new ethers.Contract(
      Secrets.NFT_CONTRACT_ADDRESS,
      NFTContract.abi,
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
  async getListedItem({ }, payload) {
    const { nftContractAddress, tokenId } = payload

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      Secrets.MARKET_CONTRACT_ADDRESS,
      MarketContract.abi,
      signer
    );

    let item;
    try {
      item = await marketContract._getListedItem(nftContractAddress, tokenId)
      return item
    } catch (error) {
      if (error.message.includes('Listing not found')) {
        return null
      } else {
        console.log(error)
      }
    }
  },

  /**
   * Test method - This method can be used to manually fetch tokenUri.
   */
  async getTokenUri({ }, tokenId) {
    const options = {
      address: '0x6D6b277478d23222a81e6De208bf332abb9fd697',
      token_id: '4',
      chain: 'rinkeby'
    };

    const tokenIdMetadata = await Moralis.Web3API.token.getTokenIdMetadata(options);
    console.log(tokenIdMetadata)
    return tokenIdMetadata;
  },
  async getPastEventsOfToken({ }, payload) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let marketContract = new ethers.Contract(
      Secrets.MARKET_CONTRACT_ADDRESS,
      MarketContract.abi,
      signer
    );

    // Get offers using past events of contract
    const filter = marketContract.filters.BidPlaced(null, null, payload.nftContractAddress, parseInt(payload.tokenId))
    const res = await marketContract.queryFilter(filter)

    // Make the result human readable
    let formattedRes = [];
    for (let i = 0; i < res.length; i++) {
      let _item = {};
      _item.tokenId = res[i].args.tokenId.toString()
      _item.price = ethers.utils.formatUnits(res[i].args.price, "ether")
      _item.bidder = res[i].args.bidder
      _item.bidId = res[i].args.bidId.toString()

      formattedRes.push(_item)
    }
    
    return formattedRes;
  }
}

export default {
  state, actions, mutations, getters
}