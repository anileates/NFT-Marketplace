<template lang="pug">
.sell-card
  .sell-card__header
    .overlay.flex__row.flex__ai-c.flex__jc-c
      h3 Complete Purchase
      .cross-wrapper.flex__row.flex__ai-c.flex__jc-c(@click="windowClosed")
        i.fas.fa-times.fa-2xl
  .sell-card__body
    .section-item.flex__col.flex__jc-sb
      .item-header
        span.header Item
      .item-details.flex__row.flex__jc-fs.flex_ai-c
        .img-wrapper
          img(:src="nft.metadata.image")
        .details.flex__col.flex__jc-fs
          a(:href="getCollectionRedirectUrl") {{ nft.name }}
          h4 # {{ nft.token_id }}
    hr
    .section-price.flex__row.flex__ai-fe.flex__jc-sb
      span.header Price
      .content.flex__row.flex__jc-fs.flex__ai-c
        img(
          src="../../ethereum.svg"
        )
        span.price {{ $filters.getPriceInEth(nft.saleInfo.price) }}
  .sell-card__footer.flex__row.flex__jc-c.flex__ai-c
    .btn-wrapper
      appCustomButton(
        buttonText="Confirm",
        @click="buyItem",
        :disableButton="buttonClicked"
      )
</template>

<script>
import InputBox from "./shared/InputBox.vue";
import CustomButton from "../components/shared/Buttons/CustomButton";
import { Toast } from "../SweetAlert";
import { mapActions } from "vuex";
import router from "../router/index";

export default {
  name: "PurchaseAsset",
  props: {
    nft: {},
    price: null,
  },
  data() {
    return {
      buttonClicked: false,
    };
  },
  components: {
    appInputBox: InputBox,
    appCustomButton: CustomButton,
  },
  computed: {
    getCollectionRedirectUrl() {
      return `/collections/${this.nft.token_address}`;
    },
  },
  methods: {
    ...mapActions({
      createSale: "createSale",
      buyNow: "buyNow"
    }),
    async buyItem () {
      const tokenAddress = this.$route.params.tokenAddress;
      const tokenId = this.$route.params.tokenId;
      const listingId = this.nft.saleInfo.listingId
      const price = this.nft.saleInfo.price;

      this.buttonClicked = true;
      const result = await this.buyNow({ tokenAddress, tokenId, price, listingId });
      if (result) {
        Toast.fire({
          icon: "success",
          title: "Congratz! You purchased a stunning NFT! 🎉.",
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
    windowClosed() {
      this.$emit("closed");
    },
  },
};
</script>

<style lang="scss" scoped>
.sell-card {
  font-size: 1.6rem;

  background-color: rgb(251, 253, 255);
  border: 2px solid rgb(229, 232, 235);
  border-radius: 1rem;

  &__header {
    // height: 12%;
    border-bottom: 2px solid rgb(229, 232, 235);
    padding: 1rem 1rem;
  }

  &__body {
    padding: 1.6em 3.2em;
  }

  &__footer {
    border-top: 2px solid rgb(229, 232, 235);
    padding: 1.6rem 3.2rem;
  }
}

.section-item {
  padding: 1rem 0;

  .img-wrapper {
    background-color: red;
    width: 16rem;
    height: 16rem;

    border-radius: 1.5rem;
    margin-right: 1.5rem;

    img {
      width: 100%;
      height: 100%;

      border-radius: inherit;
      object-fit: cover;
    }
  }

  .item-header {
    margin-bottom: 0.8rem;
  }

  .item-details {
    padding-left: 1.6rem;
  }

  .details {
    line-height: 3em;
    padding-top: 1.2rem;
  }
}

.section-price {
  padding-top: 1rem;

  .header {
    margin-bottom: 0.8rem;
  }

  img {
    width: 3.2rem;
    height: 3.2rem;

    margin-right: 1rem;
  }
}

.btn-wrapper {
  width: 16rem;
  height: 4.8rem;
}

input {
  height: 4.8rem;
}

hr {
  border: 1px solid rgb(229, 232, 235);
}

span.header {
  font-weight: 600;
}

.price {
  font-size: 2rem;
  font-weight: 600;

  color: rgb(32, 129, 226);
}

.overlay {
  height: 100%;
  width: 100%;

  position: relative;
  z-index: 999;
}

.cross-wrapper {
  position: fixed;
  right: 5px;

  width: 4rem;
  height: 4rem;

  &:hover {
    cursor: pointer;
  }
}
</style>