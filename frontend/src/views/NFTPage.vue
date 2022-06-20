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
import OffersCard from "../components/shared/DropdownCards/OffersCard.vue";
import ActivityCard from "../components/shared/DropdownCards/ActivityCard.vue";

import { mapActions, mapGetters } from "vuex";
import { Toast } from "../SweetAlert";
import { ethers } from "ethers";
import { confirmCancelListing } from "../SweetAlert";
import router from "../router/index";

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
    appOffersCard: OffersCard,
    appActivityCard: ActivityCard,
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
      offers: [],
      itemActivity: {},
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
      if (!this.nft.saleInfo) return "--";

      return ethers.utils.formatUnits(
        this.nft.saleInfo.price.toString(),
        "ether"
      );
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
    hasOffered() {
      const ethAddress = this.getCurrentUser.ethAddress;
      for (let i = 0; i < this.getFormattedOffers.length; i++) {
        if (this.getFormattedOffers[i].bidder.toLowerCase() == ethAddress)
          return { offerId: this.getFormattedOffers[i].bidId };
      }

      return false;
    },
    getOfferId() {
      if (!this.hasOffered) return false;

      const ethAddress = this.getCurrentUser.ethAddress;
      for (let i = 0; i < this.getFormattedOffers.length; i++) {
        if (this.getFormattedOffers[i].bidder.toLowerCase() == ethAddress);
      }
    },
    getFormattedOffers() {
      // Make the result human readable
      const res = this.offers;
      let formattedResOfOffers = [];
      for (let i = 0; i < res.length; i++) {
        let _item = {};
        _item.tokenId = res[i].args.tokenId.toString();
        _item.price = ethers.utils.formatUnits(res[i].args.price, "ether");
        _item.bidder = res[i].args.bidder;
        _item.bidId = res[i].args.bidId.toString();

        formattedResOfOffers.push(_item);
      }

      return formattedResOfOffers;
    },
  },
  methods: {
    ...mapActions({
      fetchNFT: "fetchNFT",
      getListedItem: "getListedItem",
      createSale: "createSale",
      cancelListing: "cancelListing",
      getOffersOfToken: "getOffersOfToken",
      cancelOffer: "cancelOffer",
      getItemActivity: "getItemActivity",
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
    async _cancelOffer() {
      const res = await this.cancelOffer({ bidId: this.hasOffered.offerId });
      if (res) {
        Toast.fire({
          icon: "success",
          title: "Offer Cancelled Succesfully!",
        });

        await router.push("/");
      } else {
        Toast.fire({
          icon: "error",
          title: "Something went wrong!😞 Please try again later.",
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
    const contractAddress = this.$route.params.tokenAddress;
    const tokenId = this.$route.params.tokenId;

    this.nft = await this.fetchNFT({
      contractAddress,
      tokenId,
      chain: "goerli",
    });

    this.nft.saleInfo = await this.getListedItem({
      contractAddress,
      tokenId,
    });

    // Get offers for this NFT
    this.offers = await this.getOffersOfToken({
      contractAddress,
      tokenId,
    });

    this.itemActivity = await this.getItemActivity({
      contractAddress,
      tokenId,
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

    <div v-if="!isLoading && isOwner" class="padding sell-cancel-bar flex__row flex__jc-c" style="">
      <div class="inner" style="">
        <div class="btn-wrapper flex__row flex__jc-sb" >
          <app-custom-button buttonText="Cancel Listing" @click="cancelSale" :disableButton="!isForSale"/>
        </div>

        <div class="btn-wrapper flex__row flex__jc-sb" >
          <app-custom-button buttonText="Put On Sale" @click="putOnSale" :disableButton="isForSale" />
        </div>
      </div>
    </div>

    <div class="padding">
    <div v-if="!isLoading" class="center-box flex__row flex__jc-c">
      <div class="left-box flex__col flex__ai-c flex__jc-sb">
        <div class="image-wrapper"><img style="width: 100%; height: 100%; object-fit: contain"
                                        :src="this.nft.metadata.image"/></div>
        <div class="detailed-information-section" style="margin-top: 1rem">
          <app-description-card :description="nft.metadata.description" />
          <app-details-card :nft="this.nft" />
          <app-traits-card :attributes="nft.attributes" />
        </div>
      </div>
      
      <div class="right-box">
        <div class="info-preview flex__col flex__ai-sb flex__jc-sa">
          <div class="first-line flex__row flex__ai-c flex__jc-sb"><a :href="getCollectionRedirectUrl">{{
              nft.metadata.name
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
          @cancelOfferClicked="_cancelOffer"
          :disablePurchaseButton="!isForSale || isOwner"
          :disableOfferButton="isOwner"
          :hasOffered="hasOffered" />
        </div>

        <div class="offers-card">
          <appOffersCard :offers="getFormattedOffers" :isOwner="isOwner" />
          </div>
      </div>
    </div>


    </div>

    <!-- <div class="activity" style="width: 80%">
      <appActivityCard :activity="itemActivity" />
    </div> -->
  </div>
</template>

<style scoped lang="scss">
.nft-page-container {
  margin-bottom: 5rem;
  min-width: 73rem;
}

.sell-cancel-bar {
  width: 100%;
  background-color: aliceblue;

  .inner {
    width: 131rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }

  .btn-wrapper {
    width: 16rem;
    height: 4.5rem;

    &:nth-child(1) {
      margin-right: 0.5rem;
    }
    margin: 0.8rem 0;
  }
}


.padding {
  width: 100%;
  padding: 0 10rem;
}

.center-box {
  padding-top: 2rem;

  .left-box {
    width: 50rem;
    height: 100%;

    .image-wrapper {
      width: 100%;
      border-radius: 0.6rem;
    }

    .detailed-information-section {
      width: 100%;
      height: 48.5rem;

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
    width: 80rem;
    height: 100%;
    margin-left: 1.6rem;

    .info-preview {
      width: 100%;
      height: 12rem;
      padding: 0 0 1rem 0;

      h1 {
        font-size: 3rem;
        color: rgb(53, 56, 64);
      }

      .first-line {
        font-size: 1.6rem;
      }
      .third-line {
        font-size: 1.5rem;
        color: rgb(112, 122, 131);
        line-height: 1.5;
        margin-top: 1rem;
      }
    }

    .sale-information {
      width: 100%;
      height: 24rem;
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
      margin: 1.6rem;
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

  // height: 40rem;
  width: 70rem;
}

#appPurchaseAsset {
  position: absolute;

  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);

  width: 70rem;
}

#appMakeOffer {
  position: absolute;

  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);

  width: 70rem;
}

.offers-card {
  margin-top: 1rem;
}
</style>
