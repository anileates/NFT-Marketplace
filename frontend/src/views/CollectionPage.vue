<template lang="pug">
.banner-container
  img(:src="collection.banner._url")
.padding-1x
  .logo-container
    img(:src="collection.logo._url")

  .about-container
    h1 {{ collection.name }}
    .creator
      span By&nbsp;
      span.creator-address {{ collection.creator }}

    p.description {{ getPreviewOfDescription }}
      span(v-show="hidden") ...
      span#seeMore(v-if="hidden", @click="toggleDescription")
        br 
        span See more&nbsp;
          i.fa-solid.fa-chevron-down.fa-sm
      span#moreText(v-else) &nbsp;{{ getRestOfDescription }} &nbsp;
        br 
        br 
        span#seeLess(@click="toggleDescription") Show Less&nbsp;
          i.fa-solid.fa-chevron-up.fa-sm

    .statistics-container.flex__row.flex__jc-fs.flex__ai-c
      .filter-icon-wrapper(@click="toggleFilterBar")
        i.fa-solid.fa-bars.flex__row.flex__jc-c.flex__ai-c.fa-xl
      .stat-box
        p.value {{ collection.tokenCount }}
        p.key items
      .stat-box
        p.value {{ collection.ownerCount }}
        p.key owners
      .stat-box
        p.value {{ collection.floorPrice }}
          span
            img.eth(src="../../ethereum.svg")
        p.key floor price
      .stat-box
        p.value {{ collection.volume }}
          span
            img.eth(src="../../ethereum.svg")
        p.key total volume

      a(href="/create-new-item")
        button.add-item-button 
          i.fa-solid.fa-plus
          span ADD ITEM

    .mobile-filter.flex__row.flex__jc-c.flex__ai-c(@click="toggleFilterBar")
      .wrapper 
        span Show Filters
        i.fa-solid.fa-bars

  .showroom-container.flex__row.flex__jc-fs.flex__ai-fs
    transition(name="slide")
      .filters-bar(v-show="!isFilterBarHidden")
        .header.flex__row.flex__jc-sb.flex__ai-c
          p Filters
          .filter-icon-wrapper(@click="toggleFilterBar")
            i.fa-solid.fa-bars.flex__row.flex__jc-c.flex__ai-c
        .border
        appListingStatusFilter(@buynowSelected="_buynowSelected")
        appOrderByFilter(@orderSelected="sortNFTs")
    .cards-layout
      .card(v-for="nft in sortedNFTs")
        appNftCard(
          v-if="(buynowSelected && nft.saleInfo) || !buynowSelected",
          :contractAddress="nft.token_address",
          :tokenId="nft.token_id",
          :name="nft.name + ` #` + nft.tokenId",
          :collectionName="nft.name",
          :imgUrl="nft.image",
          :price="nft.saleInfo && parseInt(nft.saleInfo.price)"
        )
</template>

<script>
import { mapActions } from "vuex";
import ListingStatusFilter from "../components/shared/Filters/ListingStatusFilter.vue";
import OrderByFilter from "../components/shared/Filters/OrderByFilter.vue";
import NftCard from "../components/shared/NftCard.vue";

import { ethers } from "ethers";
import Web3Modal from "web3modal";

export default {
  name: "CollectionPage",
  components: {
    appListingStatusFilter: ListingStatusFilter,
    appOrderByFilter: OrderByFilter,
    appNftCard: NftCard,
  },
  data() {
    return {
      hidden: true,
      isFilterBarHidden: false,
      isMobile: null,
      collection: {},
      nfts: [],
      buynowSelected: false,
      sortType: "ASC",
    };
  },
  methods: {
    ...mapActions({
      getCollectionInformations: "getCollectionInformations",
      getOwnerCountOfCollection: "getOwnerCountOfCollection",
      getTokenCountOfCollection: "getTokenCountOfCollection",
      fetchAllTokens: "fetchAllTokens",
      fetchOnsaleNFTs: "fetchOnsaleNFTs",
    }),
    toggleDescription() {
      this.hidden = !this.hidden;
    },
    toggleFilterBar() {
      this.isFilterBarHidden = !this.isFilterBarHidden;
    },
    resizeHandler(e) {
      if (screen.width <= 768) {
        this.isFilterBarHidden = true;
      }
    },
    getPriceInEth(price) {
      return ethers.utils.formatUnits(price.toString(), "ether");
    },
    _buynowSelected() {
      this.buynowSelected = !this.buynowSelected;
    },
    sortNFTs(type) {
      this.sortType = type;
    },
    setPageTitle() {
      document.title = this.collection.name + " | Marketplace";
    },
    /**
     * This method get the sale information of the listed items
     * And format their data as human-readeble
     * Then finds the nft in `nfts` array and append sale informations.
     */
    async getOnSaleNFTs(contractAddress) {
      let listedItems = await this.fetchOnsaleNFTs({ contractAddress });

      // This `prices` array will be used to find the floor price
      let prices = [];
      // Iterate & format the data
      for (let item in listedItems) {
        let formattedItem = {};

        formattedItem.listingId = parseInt(item.listingId);
        formattedItem.tokenId = parseInt(item.tokenId);
        formattedItem.contractAddress = item.contractAddress;
        formattedItem.ownerAddress = item.ownerAdd;
        formattedItem.price = this.getPriceInEth(item.price.toString());

        if (item.price.toString() != 0 && item.price.toString() != 0.0)
          prices.push(this.getPriceInEth(item.price.toString()));

        // Find the nft in the nfts array and append the on-chain data to the nft
        for (let nft in this.nfts) {
          if (nft.tokenId == formattedItem.tokenId) {
            nft.saleInfo = {};
            Object.assign(nft.saleInfo, formattedItem);
          }
        }
      }

      this.findFloorPrice(prices);
    },
    findFloorPrice(prices) {
      this.collection.floorPrice = Math.min(...prices);
    },
    async getCollecitonOffChainInfos(contractAddress) {
      this.collection = await this.getCollectionInformations({
        contractAddress,
      });
    },
    async getTokenAndOwnerCount(contractAddress) {
      this.collection.tokenCount = await this.getTokenCountOfCollection({
        contractAddress,
      });
      this.collection.ownerCount = await this.getOwnerCountOfCollection({
        contractAddress,
      });
    },
  },
  computed: {
    getPreviewOfDescription() {
      return this.collection.description.split(" ").slice(0, 10).join(" ");
    },
    getRestOfDescription() {
      return this.collection.description
        .split(" ")
        .slice(10, this.collection.description.length)
        .join(" ");
    },
    /**
     * Sort the NFTs by price
     */
    sortedNFTs() {
      // We need not to change the original `this.nfts` array. Otherwise there will be a bug
      // So parse `this.nfts` into a new array
      let _nfts = [...this.nfts];

      if (this.sortType == "ASC") {
        return _nfts.sort((a, b) => {
          if (a.saleInfo && b.saleInfo && b.saleInfo.price - a.saleInfo.price)
            return 1;
        });
      }
      if (this.sortType == "DESC") {
        return _nfts.sort((a, b) => {
          if (a.saleInfo && b.saleInfo && b.saleInfo.price - a.saleInfo.price)
            return -1;
        });
      }
    },
  },
  async created() {
    window.addEventListener("resize", this.resizeHandler);

    const contractAddress = this.$route.params.tokenAddress;

    await this.getCollecitonOffChainInfos(contractAddress);
    await this.getTokenAndOwnerCount(contractAddress);

    this.setPageTitle();

    // Fetch all the nfts of the collection
    this.nfts = await this.fetchAllTokens({
      contractAddress: contractAddress,
    });

    // Fetch on sale nfts from our market contract
    this.getOnSaleNFTs(contractAddress);
  },
};
</script>

<style lang="scss" scoped>
.banner-container {
  background-color: red;
  height: 32rem;

  img {
    width: 100%;
    height: 100%;
    border-radius: inherit;
    object-fit: cover;
  }
}

.logo-container {
  background-color: #fff;
  position: absolute;
  margin-top: -15.2rem;
  border-radius: 5%;
  padding: 0.6rem;
  height: 17.6rem;
  width: 17.6rem;

  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.25);

  transition: 0.3s;

  &:hover {
    cursor: pointer;
    box-shadow: 0 20px 20px rgba(0, 0, 0, 0.25);
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: inherit;
    object-fit: fill;
  }
}

.about-container {
  padding-top: 4.8rem;
  margin-bottom: 3.2rem;
  font-size: 1.6em;

  .creator {
    margin-bottom: 1.6rem;

    &-address {
      font-weight: 600;
    }
  }

  .description {
    margin-bottom: 3.2rem;
  }

  .statistics-container {
    .stat-box {
      padding: 0.3125em 0.625em;
      padding-right: 2.375em;

      transition: 0.2s;
      &:hover {
        cursor: pointer;
        border-bottom: 5px solid turquoise;
        margin-top: -1rem;
      }

      .key {
        color: #707a83;
        margin-top: -0.5rem;
        letter-spacing: 0.03rem;
      }

      .value {
        font-size: 1.25em;
        font-weight: 600;
      }
    }

    .stat-box:nth-child(1) {
      padding-left: 0;
    }
  }

  .filter-icon-wrapper {
    float: right;
    width: 4rem;
    padding: 1.8em;
    border-radius: 50%;

    transition: 0.3s;
    &:hover {
      cursor: pointer;
      background-color: rgb(229, 232, 235);
    }
  }
}

.showroom-container {
  .filters-bar {
    width: 32rem;
    min-width: 25rem;
    margin-left: -1.2rem;
    transition: 0.5s;

    .header {
      font-size: 2rem;
      padding: 0.4em 0.6em;
      padding-right: 0;

      font-weight: 600;

      .filter-icon-wrapper {
        float: right;
        width: 3.9rem;
        padding: 0.5em;
        border-radius: 50%;

        transition: 0.3s;
        &:hover {
          cursor: pointer;
          background-color: rgb(229, 232, 235);
        }
      }
    }

    .border {
      margin-left: 0.6em;
      height: 0.1rem;
      border-bottom: 1px solid rgb(229, 232, 235);
    }
  }

  .cards-layout {
    margin-left: 1rem;

    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    flex-wrap: wrap;

    .card {
      margin: 1rem 0.5rem;
      width: 20rem;
      height: 33rem;
    }
  }
}

.padding-1x {
  padding: 0 3.2rem;
  padding-bottom: 4.8rem;
}

#seeMore,
#seeLess {
  font-weight: 600;
  color: turquoise;
  margin-top: 3rem;
  &:hover {
    cursor: pointer;
    color: green;
  }
}

h1 {
  font-size: 3rem;
  font-weight: 600;
}

.hide-filterBar {
  display: none;
  transition: opacity 1s ease-out;
  opacity: 0;
}

/** Animations & Transitions **/
.slide-enter {
  opacity: 0;
}
.slide-enter-active {
  animation: slide-in 0.4s ease-out forwards;
  transition: opacity 0.4s;
  opacity: 1;
}
.slide-leave-active {
  animation: slide-out 0.4s ease-out forwards;
  transition: opacity 0.4s;
  opacity: 0;
}

img.eth {
  width: 1.2rem;
  margin-left: 0.5rem;
}

.add-item-button {
  background-color: transparent;

  font-size: 1.6rem;
  font-weight: 500;
  letter-spacing: 0.2px;

  padding: 1.2rem;
  margin-left: 2rem;

  transition: color 0.4s linear;
  border: 2px solid black;

  &:hover {
    color: #fff;
    border: 1px solid black;
    cursor: pointer;
  }

  position: relative;
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #000;
    z-index: -1;
    transition: transform 1s;
    transform-origin: 0 0;
    transition-timing-function: cubic-bezier(0.5, 1.6, 0.4, 0.7);

    transform: scaleX(0);
  }

  &:hover::before {
    transform: scaleX(1);
  }

  i {
    margin-right: 1rem;
  }
}

@keyframes slide-out {
  from {
    transform: translateX(0px);
  }

  to {
    transform: translateX(-70px);
  }
}

@keyframes slide-in {
  from {
    transform: translateX(-70px);
  }

  to {
    transform: translateX(0px);
  }
}
/*********************************************/

/******** Small Screens (Mobile Phones) ********/
@media all and (max-width: 480px) {
  .showroom-container {
    margin-bottom: 3rem;

    .cards-layout {
      margin-left: 0px;
      .card {
        width: 45%;
      }
    }
  }
}

@media all and (max-width: 768px) {
  .padding-1x {
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: justify;

    .description {
      padding: 0 1rem;
    }
  }

  .logo-container {
    margin-top: -14rem;
  }

  .about-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .filter-icon-wrapper {
    display: none;
  }

  .showroom-container {
    margin-bottom: 3rem;

    .cards-layout {
      margin-left: 0px;

      .cards-layout {
        margin-left: 0px;
        .card {
          width: 45%;
        }
      }
    }
  }

  .statistics-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;

    width: 100%;
    padding: 0 1rem;
    margin-left: -1rem;

    .stat-box {
      padding-right: 0px !important;
    }
  }

  .mobile-filter {
    // background-color: blue;
    width: 90%;
    margin-top: 1rem;
    border-radius: 3rem;
    border: 3px solid rgb(229, 232, 235);
    font-size: 2rem;

    padding: 0.5rem 2rem;

    .wrapper {
      span {
        margin-right: 1rem;
      }
    }
  }

  .filters-bar {
    position: absolute;
    background-color: #fff;
    height: 100vh;
    width: 90% !important;
    border: 3px solid rgb(229, 232, 235);

    margin-top: -3rem;
  }
}

@media all and (min-width: 769px) {
  .mobile-filter {
    display: none;
  }
  .description {
    margin-bottom: 32px;
    max-width: 60%;
  }
}

@media all and (min-width: 1600px) {
  .padding-1x {
    padding: 0 14rem;
  }
}
</style>