<script>
import SaleCard from "../components/shared/DropdownCards/SaleCard";
import DropdownCardMain from "../components/shared/DropdownCards/DropdownCardMain";
import DescriptionCard from "../components/shared/DropdownCards/DescriptionCard";
import DetailsCard from "../components/shared/DropdownCards/DetailsCard";
import CustomButton from "../components/shared/Buttons/CustomButton";
import TraitsCard from "../components/shared/DropdownCards/TraitsCard";
import {mapActions, mapGetters} from "vuex";
import router from '../router/index'

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
      isLoading: true,
      nft: {
        metadata: {},
        saleInformations: {}
      }
    };
  },
  computed: {
    ...mapGetters({getCurrentUser: "getCurrentUser"}),
    getCollectionRedirectUrl() {
      return `/collections/${this.nft.token_address}`;
    },
    getProfileRedirectUrl() {
      return `/users/${this.nft.owner_of}`;
    },
    // isOwner() {
    //   // TODO This might be built in a different way.
    //   if (
    //       this.getCurrentUser.ethAddress.toString().toLowerCase() ===
    //       this.nft.owner_of.toString().toLowerCase()
    //   )
    //     return true;
    //   else if (
    //       this.itemFound.seller &&
    //       this.itemFound.seller.toLowerCase() ===
    //       this.getCurrentUser.ethAddress.toString().toLowerCase()
    //   )
    //     return true;
    //   else return false;
    // },
    // isForSale() {
    //   // TODO This might be built in a different way.
    //   if (
    //       this.nft.owner_of.toString().toLowerCase() ===
    //       Secrets.third_market_contract_address.toString().toLowerCase()
    //   ) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
  },
  methods: {
    ...mapActions({fetchNFT: 'fetchNFT', getItemFromContract: 'getItemFromContract' })
  },
  async created() {
    const tokenAddress = this.$route.params.tokenAddress;
    const tokenId = this.$route.params.tokenId;

    try {
      this.nft = await this.fetchNFT({
        token_address: tokenAddress,
        token_id: tokenId,
      });

      this.nft.metadata = JSON.parse(this.nft.metadata);
      document.title = this.nft.metadata.name;
      this.isLoading = false;
    } catch (err) {
      await router.push('/not-found')
    }

    this.nft.saleInfo = this.getItemFromContract();
  },
};
</script>

<template lang="html">
  <div class="nft-page-container flex__col flex__ai-c flex__jc-c">
    <h1 v-if="isLoading">Loading.........</h1>

    <div v-else class="sell-cancel-bar flex__row flex__jc-c" v-show="true">
      <div class="inner">
        <div class="btn-wrapper">
          <app-custom-button buttonText="Cancel Listing" @click="cancelListing" />
        </div>
      </div>
    </div>
    <div v-else class="center-box flex__row flex__jc-sb">
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

          <!-- TODO: Change nft... places in here -->
          <h1>{{ nft.name }}</h1>
          <div class="third-line"><span>Owned by</span><a class="owner-of" :href="getProfileRedirectUrl">{{
              nft.seller || nft.owner_of
            }}</a></div>
        </div>
        <div class="sale-information">
          <app-sale-card :isForSale="this.isForSale" :price="nft.saleInfo.price" :disableButtons="true" />
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
</style>