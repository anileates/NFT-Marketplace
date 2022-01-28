<template lang="pug">
.nft-page-container.flex-col.flex-ai-c.flex-jc-c
  .sell-cancel-bar.flex-row.flex-jc-c
    .inner
      .btn-wrapper
        app-custom-button(buttonText="Cancel Listing")
      .btn-wrapper
        app-custom-button(buttonText="Lower Price")
  .center-box.flex-row.flex-jc-sb
    .left-box.flex-col.flex-ai-c.flex-jc-sb
      .image-wrapper
        img(style="width: 100%; height: 100%; object-fit: contain" :src="getNFTMetadata.image")
      .detailed-information-section(style="margin-top: 1rem")
        app-description-card(:description="JSON.parse(this.nft.metadata).description")
        app-details-card(:nft="this.nft")
        app-traits-card(:attributes="getNFTMetadata.attributes")

    .right-box
      .info-preview.flex-col.flex-ai-sb.flex-jc-sa
        .first-line.flex-row.flex-ai-c.flex-jc-sb
          a(:href="getCollectionRedirectUrl") {{ nft.name }}
          .actions
            button
              i.fas.fa-redo-alt.fa-lg
            button
              i.fas.fa-share-alt.fa-lg
        h1 {{ getNFTMetadata.name }}
        .third-line
          span Owned by
          a.owner-of(:href="getProfileRedirectUrl") {{ nft.owner_of }}
      .sale-information
        app-sale-card
</template>

<script>
import SaleCard from "./shared/DropdownCards/SaleCard";
import DropdownCardMain from "./shared/DropdownCards/DropdownCardMain";
import DescriptionCard from "./shared/DropdownCards/DescriptionCard";
import DetailsCard from "./shared/DropdownCards/DetailsCard";
import CustomButton from "./shared/Buttons/CustomButton";
import TraitsCard from "./shared/DropdownCards/TraitsCard";

export default {
  name: 'NFTPage',
  components: {
    appSaleCard: SaleCard,
    appDropdownCardMain: DropdownCardMain,
    appDescriptionCard: DescriptionCard,
    appDetailsCard: DetailsCard,
    appCustomButton: CustomButton,
    appTraitsCard: TraitsCard
  },
  data() {
    return {
      nft: this.$route.params.nftMetadata
    }
  },
  computed: {
    getNFTMetadata() {
      // NFT Metadata format is not parsable when it comes first. So, parse and return it via this method
      return JSON.parse(this.nft.metadata)
    },
    getCollectionRedirectUrl () {
      return `/collections/${this.nft.token_address}`
    },
    getProfileRedirectUrl () {
      return `/users/${this.nft.owner_of}`
    }
  },
  created() {
    // console.log('HERE => ', this.$route.params.nftMetadata)
    console.log(this.nft)
    console.log(this.nft.name)
    console.log("DESCR: ",JSON.parse(this.nft.metadata).description)
    console.log("X:", JSON.parse(this.nft.metadata).name)
    console.log("Attributes:", JSON.parse(this.nft.metadata).attributes)
  }
}
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