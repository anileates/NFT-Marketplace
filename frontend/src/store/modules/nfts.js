import Secrets from "../../../../secrets.json";
import MarketContract from "../../../Contracts/Market.json";
import NFTContract from "../../../Contracts/CustomNFT.json";
import CollectionFactory from "../../../Contracts/CollectionFactory.json";
import ERC721 from "../../../Contracts/ERC721.json";
import ERC20 from '../../../Contracts/ERC20.json';
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
      let contract;
      if (payload.collectionAddress) {
        // If a contractAddress has given, that means we need to use CustomNFT contract which.
        // CustomNFT contracts belong to another user
        // TODO CustomNFTcontract does not exist in this project folder. Add later
        contract = new ethers.Contract(
          payload.collectionAddress,
          CustomNFTcontract.abi,
          signer
        );
      } else {
        // If a contract address has not given, that means user wants to create a single NFT on our platform.
        // So we can mint directly at our contract
        contract = new ethers.Contract(
          Secrets.NFT_CONTRACT_ADDRESS,
          NFTContract.abi,
          signer
        );
      }

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

      // Update volume data in Moralis DB
      let Collection = Moralis.Object.extend("Collection");
      const query = new Moralis.Query(Collection);
      query.equalTo("contractAddress", payload.tokenAddress);

      let results = await query.find();
      let collection = results[0]

      let newVolume = parseInt(collection.attributes.volume) + _price

      collection.set("volume", newVolume)
      await collection.save()

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
  async acceptOffer({ }, payload) {
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

      // If the address is not approved, approve it first.
      if (!isApproved && approvedAddress != signerAddress) {
        let transaction = await nftContract.setApprovalForAll(Secrets.MARKET_CONTRACT_ADDRESS, true);
        await transaction.wait();
      }

      let transaction = await marketContract.acceptBid(payload.bidId)
      await transaction.wait()

      // Update volume data in Moralis DB
      let Collection = Moralis.Object.extend("Collection");
      const query = new Moralis.Query(Collection);
      query.equalTo("contractAddress", payload.nftContractAddress);

      let results = await query.find();
      let collection = results[0]

      let newVolume = parseInt(collection.attributes.volume) + payload.price

      collection.set("volume", newVolume)
      await collection.save()

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  },
  async cancelOffer({ }, payload) {
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

    try {
      let transaction = await marketContract.cancelBid(payload.bidId.toString())
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
  async getTransfersOfToken({ }, payload) {
    const { nftContractAddress, tokenId } = payload

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let nftContract = new ethers.Contract(
      nftContractAddress,
      ERC721.abi,
      signer
    );

    const transferFilter = nftContract.filters.Transfer(null, null, parseInt(tokenId))
    const transfers = await nftContract.queryFilter(transferFilter)

    return transfers
  },
  async getListingsOfToken({ }, payload) {
    const { nftContractAddress, tokenId } = payload

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let marketContract = new ethers.Contract(
      Secrets.MARKET_CONTRACT_ADDRESS,
      MarketContract.abi,
      signer
    );

    const listingFilter = marketContract.filters.ListingCreated(null, null, nftContractAddress, parseInt(tokenId))
    const listings = await marketContract.queryFilter(listingFilter)

    return listings
  },
  async getSalesOfToken({ }, payload) {
    const { nftContractAddress, tokenId } = payload

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let marketContract = new ethers.Contract(
      Secrets.MARKET_CONTRACT_ADDRESS,
      MarketContract.abi,
      signer
    );

    const saleFilter = marketContract.filters.ItemSold(null, null, null, nftContractAddress, parseInt(tokenId), null)
    const sales = await marketContract.queryFilter(saleFilter)

    return sales
  },
  async getOffersOfToken({ }, payload) {
    const { nftContractAddress, tokenId } = payload

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let marketContract = new ethers.Contract(
      Secrets.MARKET_CONTRACT_ADDRESS,
      MarketContract.abi,
      signer
    );

    const offersFilter = marketContract.filters.BidPlaced(null, null, nftContractAddress, parseInt(tokenId))
    const offers = await marketContract.queryFilter(offersFilter)

    return offers
  },
  async getItemActivity({ dispatch }, payload) {
    const { nftContractAddress, tokenId } = payload

    const transfers = await dispatch('getTransfersOfToken', { nftContractAddress, tokenId: parseInt(tokenId) })
    const listings = await dispatch('getListingsOfToken', { nftContractAddress, tokenId: parseInt(tokenId) })
    const sales = await dispatch('getSalesOfToken', { nftContractAddress, tokenId: parseInt(tokenId) })
    const offers = await dispatch('getOffersOfToken', { nftContractAddress, tokenId: parseInt(tokenId) })

    const res = { listings, offers, sales, transfers }
    return res
  },
  async createCollection({ }, payload) {
    const { name, symbol } = payload

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress()

    let collectionFactoryContract = new ethers.Contract(
      Secrets.COLLECTION_FACTORY_ADDRESS,
      CollectionFactory.abi,
      signer
    );

    try {
      // First, create collection on-chain.
      let transaction = await collectionFactoryContract.createCollection(name, symbol, { value: "20000000000000000" });
      const res = await transaction.wait();

      // Append address of the created collection
      payload.contractAddress = res.logs[0].address

      // Save collection infos to the Moralis DB
      let Collection = Moralis.Object.extend("Collection");
      let newCollection = new Collection()
      for (let [key, value] of Object.entries(payload)) {
        newCollection.set(key, value)
      }

      newCollection.set("creator", signerAddress)

      await newCollection.save()
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  },
  /**
   * Get NFTs of a specific collection.
   * Generally used this method at `Colleciton Page` to fetch nfts.
   * 
   * - Requires a contract address. This address cannot be zero address.
   * - Requires a `limit` option to filter amount of results. 
   * - @param chain is optional and only for dev. reasons
   */
  async getNFTsOfCollection({ }, payload) {
    const options = {
      address: payload.token_address,
      chain: payload.chain || 'eth',
    };


    try {
      let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);

      // Sometimes NFT metadatas is missing on the Moralis side.
      // We need to fetch manually in this case
      for (let i = 0; i < NFTs.result.length; i++) {
        if (!NFTs.result[i].metadata) {
          let result = await axios.get(NFTs.result[i].token_uri)
          NFTs.result[i].metadata = JSON.stringify(result.data)
        }

        NFTs.result[i].metadata = JSON.parse(NFTs.result[i].metadata)
      }

      return NFTs.result;
    } catch (error) {
      console.log(error)
    }
  },
  /**
   * This method fetchs listed NFTs of a collection from our `Market Contract`.
   * 
   * - Requires a contract address. This address cannot be zero address 
   * Returns
   */
  async getOnsaleNFTs({ }, payload) {
    const { contractAddress } = payload

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

    try {
      const listedItems = await marketContract.getListedItemsOfContract(contractAddress)
      console.log(listedItems)

      return listedItems
    } catch (error) {
      console.log(error)
      return false
    }
  },
  /**
   * This method gets item count, owner count, total volume, logo, banner, description of a collection
   */
  async getCollectionInformations({ }, payload) {
    let collection = {}
    let Collection = Moralis.Object.extend("Collection");
    const query = new Moralis.Query(Collection);
    query.equalTo("contractAddress", "0x028f91C7905E4c3181E8160Ea60784074D977Ae4");

    let results = await query.find();
    collection = { ...results[0].attributes }

    return collection
  },
}

export default {
  state, actions, mutations, getters
}
