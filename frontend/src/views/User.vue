<template lang="pug">
.banner-container
  img(:src="getFoundUser.cover._url")
.padding-1x
  .logo-container
    img(:src="getFoundUser.avatar._url")

  .about-container
    h1 {{ getFoundUser.username }}

    p.description {{ getFoundUser.biography }}

    .statistics-container.flex__row.flex__jc-fs.flex__ai-c
      .stat-box(
        @click="isItemsViewSelected = true",
        :class="{ isSelected: isItemsViewSelected }"
      )
        p.value My Items
      .stat-box(
        @click="isItemsViewSelected = false",
        :class="{ isSelected: !isItemsViewSelected }"
      )
        p.value My Collections

  .showroom
    .card-layout(v-if="isItemsViewSelected")
      .card(v-for="nft in nfts")
        appNftCard(
          :contractAddress="nft.token_address",
          :tokenId="nft.token_id",
          :name="nft.metadata.name + ` #` + nft.token_id",
          :collectionName="nft.name",
          :imgUrl="nft.metadata.image",
          :price="nft.saleInfo && nft.saleInfo.price"
        )

    .collection-layout(v-else)
      .collection(v-for="collection in collections")
        appCollectionCard(
          :contractAddress="collection.contractAddress",
          :collectionName="collection.name",
          :bannerUri="collection.banner._url",
          :logoUri="collection.logo._url"
        )

      .collection.item-empty
      .collection.item-empty(v-if="isCollectionCountOdd")
</template>

<script>
import Avatar from "../components/shared/Avatar";
import NftCard from "../components/shared/NftCard";
import CollectionCard from "../components/shared/CollectionCard.vue";
import { mapActions, mapGetters } from "vuex";
import { ethers } from "ethers";

export default {
  name: "UserPage",
  components: {
    appAvatar: Avatar,
    appNftCard: NftCard,
    appCollectionCard: CollectionCard,
  },
  data() {
    return {
      isItemsViewSelected: true,
      url: "https:///i.pinimg.com/736x/02/70/6c/02706c93c5f630d1e1ae987c15ae7f53.jpg",
      nfts: [],
      collections: [],
    };
  },
  computed: {
    ...mapGetters(["getFoundUser"]),
    isCollectionCountOdd() {
      return this.collection && this.collections.length % 2;
    },
  },
  methods: {
    ...mapActions({
      getNFTsOfUser: "getNFTsOfUser",
      getListedItem: "getListedItem",
      getListedItemsOfUser: "getListedItemsOfUser",
      getCollectionInformations: "getCollectionInformations",
      fetchNFT: "fetchNFT",
    }),
    async getUserCollections() {
      const collectionAddresses = this.getFoundUser.collections;
      if (!collectionAddresses) return;

      for (let i = 0; i < collectionAddresses.length; i++) {
        let collectionInfo = await this.getCollectionInformations({
          contractAddress: collectionAddresses[i],
        });
        this.collections.push(collectionInfo);
      }
    },
    getPriceInEth(price) {
      return ethers.utils.formatUnits(price.toString(), "ether");
    },
    async getOnSaleNFTsOfUser() {
      // This method returns sale data of the NFTs
      const listedItemsOfUser = await this.getListedItemsOfUser({
        walletAddress: this.getFoundUser.ethAddress,
      });


      // We need to fetch metadata of the NFTs
      for (let i = 0; i < listedItemsOfUser.length; i++) {
        let contractAddress = listedItemsOfUser[i].nftContractAdd;
        let tokenId = parseInt(listedItemsOfUser[i].tokenId);

        let fetchedNFT = await this.fetchNFT({
          contractAddress,
          tokenId,
          chain: "goerli",
        });

        fetchedNFT.saleInfo = {};
        fetchedNFT.saleInfo.listingId = parseInt(listedItemsOfUser[i].listingId);
        fetchedNFT.saleInfo.tokenId = parseInt(listedItemsOfUser[i].tokenId);
        fetchedNFT.saleInfo.price = this.getPriceInEth(listedItemsOfUser[i].price.toString());

        this.nfts.push(fetchedNFT)
      }
    },
  },
  async created() {
    this.nfts = await this.getNFTsOfUser({
      walletAddress: this.getFoundUser.ethAddress,
    });

    await this.getUserCollections();

    // Fetch on sale nfts from our market contract
    this.getOnSaleNFTsOfUser();
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
    object-fit: cover;
  }
}

.about-container {
  padding-top: 4.8rem;
  margin-bottom: 3.2rem;
  font-size: 1.6em;
  border-bottom: 1px solid rgb(229, 232, 235);

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
      padding-right: 1em;
      // margin-right: 2rem;

      &:hover {
        cursor: pointer;
        border-bottom: 5px solid turquoise;
        margin-top: -0.5rem;
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
}

.profile-header {
  height: 48rem;
  border-bottom: 1px solid #c2c2c2;

  .pp-layer {
    position: absolute;
    width: 12.8rem;
    height: 12.8rem;

    border-radius: 50%;
  }
}

.showroom {
  width: 100%;

  .card-layout {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
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

.collection-layout {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;

  .collection {
    margin: 1rem 0.5rem;
    width: 70rem;
    height: 35rem;
  }

  &::after {
    content: "";
    flex: auto;
  }

  .item-empty {
    visibility: hidden;
  }
}

.isSelected {
  border-bottom: 5px solid turquoise;
  margin-top: -0.5rem;
}
</style>