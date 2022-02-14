<template lang="pug">
.nft-page-container.flex__col.flex__ai-c.flex__jc-c
  .sell-cancel-bar.flex__row.flex__jc-c(v-show="isOwner")
    .inner
      .btn-wrapper
        app-custom-button(buttonText="Cancel Listing", @click="cancelListing")
      //- .btn-wrapper
      //-   app-custom-button(buttonText="Lower Price")
  .center-box.flex__row.flex__jc-sb
    .left-box.flex__col.flex__ai-c.flex__jc-sb
      .image-wrapper
        img(
          style="width: 100%; height: 100%; object-fit: contain",
          :src="getNFTMetadata.image"
        )
      .detailed-information-section(style="margin-top: 1rem")
        app-description-card(
          :description="JSON.parse(this.nft.metadata).description"
        )
        app-details-card(:nft="this.nft")
        app-traits-card(:attributes="getNFTMetadata.attributes")

    .right-box
      .info-preview.flex__col.flex__ai-sb.flex__jc-sa
        .first-line.flex__row.flex__ai-c.flex__jc-sb
          a(:href="getCollectionRedirectUrl") {{ nft.name }}
          .actions
            button
              i.fas.fa-redo-alt.fa-lg
            button
              i.fas.fa-share-alt.fa-lg
        h1 {{ getNFTMetadata.name }}
        .third-line
          span Owned by
          a.owner-of(:href="getProfileRedirectUrl") {{ itemFound.seller || nft.owner_of }}
      .sale-information
        app-sale-card(:isForSale="this.isForSale" :price="itemFound.price" :disableButtons="true")
</template>

<script>
import SaleCard from "../components/shared/DropdownCards/SaleCard";
import DropdownCardMain from "../components/shared/DropdownCards/DropdownCardMain";
import DescriptionCard from "../components/shared/DropdownCards/DescriptionCard";
import DetailsCard from "../components/shared/DropdownCards/DetailsCard";
import CustomButton from "../components/shared/Buttons/CustomButton";
import TraitsCard from "../components/shared/DropdownCards/TraitsCard";

import Secrets from "../../../secrets.json";
import NFTMarket from "../../../Contracts/NFTMarket.json";
import NFT from "../../../Contracts/NFT.json";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "NFTPage",
  components: {
    appSaleCard: SaleCard,
    appDropdownCardMain: DropdownCardMain,
    appDescriptionCard: DescriptionCard,
    appDetailsCard: DetailsCard,
    appCustomButton: CustomButton,
    appTraitsCard: TraitsCard,
  },
  data() {
    return {
      nft: this.$route.params.nftMetadata,
      itemFound: {}
    };
  },
  methods: {
    async cancelListing() {
      console.log("Cancel Listin 🔥");
      console.log(
        "Params:",
        typeof this.$route.params.tokenId.toString(),
        this.$route.params.tokenId.toString()
      );
      console.log(this.getCurrentUser);

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

      let transaction = await contract.cancelSale(
        Secrets.third_nft_contract_address,
        this.$route.params.tokenId.toString(),
        { value: cancellingPrice }
      );
      await transaction.wait();
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

      items.forEach((item) => {
        if (item.tokenId == this.$route.params.tokenId) {
          this.itemFound = item;
        }
      });

      console.log(this.itemFound)
    },
  },
  computed: {
    ...mapGetters(["getCurrentUser"]),
    getNFTMetadata() {
      // NFT Metadata format is not parsable when it comes first. So, parse and return it via this method
      return JSON.parse(this.nft.metadata);
    },
    getCollectionRedirectUrl() {
      return `/collections/${this.nft.token_address}`;
    },
    getProfileRedirectUrl() {
      return `/users/${this.nft.owner_of}`;
    },
    isOwner () {
      if(this.getCurrentUser.ethAddress.toString().toLowerCase() === this.nft.owner_of.toString().toLowerCase()) return true
      else if (this.itemFound.seller && this.itemFound.seller.toLowerCase() === this.getCurrentUser.ethAddress.toString().toLowerCase()) return true
      else return false 
    },
    isForSale() {
      if(this.nft.owner_of.toString().toLowerCase() === Secrets.third_market_contract_address.toString().toLowerCase()){
        return true
      }else {
        return false
      }
    }
  },
  created() {
    this.getItemFromContract()
  },
};
</script>

<style scoped lang="scss">
.nft-page-container {
  width: 100%;
  margin-bottom: 5rem;
}

.sell-cancel-bar {
  width: 100%;
  height: 4.2rem;
  background-color: aliceblue;

  .inner {
    width: 82%;
    height: 100%;
    display: flex;
    flex__direction: row;
    align-items: center;
    justify-content: flex__end;
  }

  .btn-wrapper {
    width: 10rem;
    height: 3rem;
    margin-right: 0.5rem;
  }
}

.center-box {
  width: 82%;
  height: 100%;
  padding-top: 2rem;

  .left-box {
    //background-color: green;
    width: 42%;
    height: 100%;

    .image-wrapper {
      //background-color: orange;
      width: 100%;
      height: 34.5rem;
      border-radius: 0.6rem;
    }

    .detailed-information-section {
      width: 100%;
      height: 30.3125rem;

      & > .dropdown-card {
        border-radius: 0;
        border-width: 1px;
      }

      .dropdown-card:first-child {
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
      }

      .dropdown-card:last-child {
        border-bottom-left-radius: 1rem;
        border-bottom-right-radius: 1rem;
      }
    }
  }

  .right-box {
    width: 58%;
    height: 100%;
    padding-left: 1rem;

    .info-preview {
      width: 100%;
      height: 10rem;
      padding: 0 0 1rem 0;

      h1 {
        font-size: 1.875rem;
        color: rgb(53, 56, 64);
      }

      .third-line {
        font-size: 0.90625rem;
        color: rgb(112, 122, 131);
        line-height: 1.5;
        margin-top: 1rem;
      }
    }

    .sale-information {
      width: 100%;
      height: 15rem;
    }
  }
}

a {
  text-decoration: none;
  color: rgb(24, 104, 183);

  &:visited {
    color: rgb(24, 104, 183);
  }
}

.actions {
  button {
    background-color: transparent;
    border: solid rgb(229, 232, 235);
    border-width: 2px 2px 2px 0;
    cursor: pointer;

    &:hover {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    }

    &:first-child {
      border-left: 2px solid rgb(229, 232, 235);
      border-top-left-radius: 0.5rem;
      border-bottom-left-radius: 0.5rem;
    }

    &:last-child {
      border-top-right-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
    }

    i {
      margin: 1rem;
    }
  }
}

.owner-of {
  margin-left: 0.5rem;
}
</style>