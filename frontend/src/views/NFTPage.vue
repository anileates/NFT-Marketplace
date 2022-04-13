<script>
import SaleCard from "../components/shared/DropdownCards/SaleCard";
import DropdownCardMain from "../components/shared/DropdownCards/DropdownCardMain";
import DescriptionCard from "../components/shared/DropdownCards/DescriptionCard";
import DetailsCard from "../components/shared/DropdownCards/DetailsCard";
import CustomButton from "../components/shared/Buttons/CustomButton";
import TraitsCard from "../components/shared/DropdownCards/TraitsCard";
import SellAsset from "../components/SellAsset.vue";
import PurchaseAsset from "../components/PurchaseAsset.vue";
import MakeOffer from "../components/MakeOffer.vue";

import { mapActions, mapGetters } from "vuex";
import { Toast } from "../SweetAlert";
import { ethers } from "ethers";
import { confirmCancelListing } from "../SweetAlert";

export default {
  name: "NFTPage",
  components: {
    appSaleCard: SaleCard,
    appDropdownCardMain: DropdownCardMain,
    appDescriptionCard: DescriptionCard,
    appDetailsCard: DetailsCard,
    appCustomButton: CustomButton,
    appTraitsCard: TraitsCard,
    appSellAsset: SellAsset,
    appPurchaseAsset: PurchaseAsset,
    appMakeOffer: MakeOffer,
  },
  data() {
    return {
      isLoading: true,
      isSellClicked: false,
      isBuyNowClicked: false,
      isMakeOfferClicked: false,
      nft: {
        metadata: {},
        saleInfo: {},
      },
    };
  },
  computed: {
    ...mapGetters({ getCurrentUser: "getCurrentUser" }),
    getCollectionRedirectUrl() {
      return `/collections/${this.nft.token_address}`;
    },
    getProfileRedirectUrl() {
      return `/users/${this.nft.owner_of}`;
    },
    isForSale() {
      if (this.nft.saleInfo) return true;
      else false;
    },
    getOwner() {
      if (!this.isForSale) {
        return this.nft.owner_of;
      } else {
        return this.nft.saleInfo.ownerAdd;
      }
    },
    getPriceInEth() {
      if (this.nft.saleInfo) {
        return ethers.utils.formatUnits(
          this.nft.saleInfo.price.toString(),
          "ether"
        );
      } else {
        return null;
      }
    },
    isOwner() {
      if (
        !this.isForSale &&
        this.nft.owner_of.toLowerCase() ==
          this.getCurrentUser.ethAddress.toLowerCase()
      ) {
        return true;
      } else if (
        this.isForSale &&
        this.nft.saleInfo.ownerAdd.toLowerCase() ==
          this.getCurrentUser.ethAddress.toLowerCase()
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    ...mapActions({
      fetchNFT: "fetchNFT",
      getListedItem: "getListedItem",
      createSale: "createSale",
      cancelListing: "cancelListing",
    }),
    async putOnSale() {
      this.toggleSellWindow();
    },
    async cancelSale() {
      const result = await this.cancelListing(
        this.nft.saleInfo.listingId.toString()
      );

      if (result) {
        Toast.fire({
          icon: "success",
          title: "Listing Cancelled Succesfully",
        });

        await router.push("/");
      } else {
        Toast.fire({
          icon: "error",
          title: "Something went wrong.",
        });

        await router.push("/");
      }
    },
    toggleSellWindow() {
      this.isSellClicked = !this.isSellClicked;
    },
    togglePurchaseWindow() {
      this.isBuyNowClicked = !this.isBuyNowClicked;
    },
    toggleMakeOfferWindow() {
      this.isMakeOfferClicked = !this.isMakeOfferClicked;
    },
  },
  async created() {
    // Fetched the nft metadata at the beforeEnter route. Just assign to local state here.
    this.nft = this.$route.params.nft;
    this.nft.metadata = JSON.parse(this.$route.params.nft.metadata);
    this.nft.saleInfo = await this.getListedItem({
      tokenId: this.nft.token_id,
      nftContractAddress: this.nft.token_address,
    });

    this.isLoading = false;
  },
};
</script>

<template lang="html">
  <div class="nft-page-container flex__col flex__ai-c flex__jc-c">
    <h1 v-show="isLoading">Loading.........</h1>

  <div class="overlay" v-if="isSellClicked"> 
   <appSellAsset id="appSellAsset" :nft="this.nft" @closed="toggleSellWindow" />
  </div>

  <div class="overlay" v-if="isBuyNowClicked"> 
   <appPurchaseAsset id="appPurchaseAsset" :nft="this.nft" @closed="togglePurchaseWindow"/>
  </div>

  <div class="overlay" v-if="isMakeOfferClicked"> 
   <appMakeOffer id="appMakeOffer" :nft="this.nft" @closed="toggleMakeOfferWindow"/>
  </div>

    <div v-if="!isLoading && isOwner" class="sell-cancel-bar flex__row flex__jc-c" style="">
      <div class="inner" style="">
        <div class="btn-wrapper flex__row flex__jc-sb" >
          <app-custom-button buttonText="Cancel Listing" @click="cancelSale" :disableButton="!isForSale"/>
        </div>

        <div class="btn-wrapper flex__row flex__jc-sb" >
          <app-custom-button buttonText="Put On Sale" @click="putOnSale" :disableButton="isForSale" />
        </div>
      </div>
    </div>
    
    <div v-if="!isLoading" class="center-box flex__row flex__jc-sb">
      <div class="left-box flex__col flex__ai-c flex__jc-sb">
        <div class="image-wrapper"><img style="width: 100%; height: 100%; object-fit: contain"
                                        :src="this.nft.metadata.image"/></div>
        <div class="detailed-information-section" style="margin-top: 1rem">
          <app-description-card :description="nft.metadata.description" />
          <app-details-card :nft="this.nft" />
          <app-traits-card :attributes="nft.metadata.attributes" />
        </div>
      </div>
      <div class="right-box">
        <div class="info-preview flex__col flex__ai-sb flex__jc-sa">
          <div class="first-line flex__row flex__ai-c flex__jc-sb"><a :href="getCollectionRedirectUrl">{{
              nft.name
            }}</a>
            <div class="actions">
              <button><i class="fas fa-redo-alt fa-lg"></i></button>
              <button><i class="fas fa-share-alt fa-lg"></i></button>
            </div>
          </div>

          <h1>{{ nft.metadata.name }}</h1>
          <div class="third-line"><span>Owned by</span><a class="owner-of" :href="getProfileRedirectUrl">{{
              getOwner
            }}</a></div>
        </div>
        <div class="sale-information">
          <app-sale-card 
          :isForSale="isForSale" 
          :price="getPriceInEth" 
          @buyNowClicked="togglePurchaseWindow" 
          @makeOfferClicked="toggleMakeOfferWindow" 
          :disablePurchaseButton="!isForSale || isOwner" 
          :disableOfferButton="isOwner"/>
        </div>
      </div>
    </div>
  </div>
</template>

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
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }

  .btn-wrapper {
    width: 10rem;
    height: 3rem;
    margin-right: 0.5rem;
  }
}

.center-box-wrapper {
  width: 100%;
  height: 100%;
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

.overlay {
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: black;
  background-color: rgba(0, 0, 0, 0.75);

  top: 0;
  left: 0;
}

#appSellAsset {
  position: absolute;

  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);

  height: 25rem;
  width: 40%;
}

#appPurchaseAsset {
  position: absolute;

  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);

  height: 25rem;
  width: 40%;
}

#appMakeOffer {
  position: absolute;

  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);

  height: 25rem;
  width: 40%;
}
</style>