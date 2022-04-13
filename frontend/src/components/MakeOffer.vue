<template lang="pug">
.sell-card
  .sell-card__header
    .overlay.flex__row.flex__ai-c.flex__jc-c
      h3 Make Offer
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
    .section-price
      .header
        span.header Price
      .content.flex__row.flex__jc-fs.flex__ai-c
        img(
          src="https://openseauserdata.com/files/accae6b6fb3888cbff27a013729c22dc.svg"
        )
        appInputBox#price(
          placeholder="Amount",
          @keydown="checkValidPriceFormat"
        )
  .sell-card__footer.flex__row.flex__jc-c.flex__ai-c
    .btn-wrapper
      appCustomButton(
        buttonText="Confirm",
        @click="_makeOffer",
        :disableButton="buttonClicked"
      )
</template>

<script>
import InputBox from "./shared/InputBox.vue";
import CustomButton from "../components/shared/Buttons/CustomButton";
import { Toast } from "../SweetAlert";
import { mapActions, mapGetters } from "vuex";
import router from "../router/index";

export default {
  name: "MakeOffer",
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
    ...mapGetters({ user: "getCurrentUser" }),
    getCollectionRedirectUrl() {
      return `/collections/${this.nft.token_address}`;
    },
  },
  methods: {
    ...mapActions({
      createSale: "createSale",
      makeOffer: "makeOffer",
      getWethBalanceOf: "getWethBalanceOf",
    }),
    windowClosed() {
      this.$emit("closed");
    },
    checkValidPriceFormat(event) {
      let validChars = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "e",
        ".",
        "Backspace",
      ];

      if (!validChars.includes(event.key)) event.preventDefault();
    },
    async _makeOffer() {
      const tokenAddress = this.$route.params.tokenAddress;
      const tokenId = this.$route.params.tokenId;
      const price = document.getElementById("price").value;

      if (!price || price <= 0) {
        Toast.fire({
          icon: "error",
          title: "Price must be greater than 0",
        });

        return false;
      }

      const wethBalance = await this.getWethBalanceOf(this.user.ethAddress);
      if (wethBalance < price) {
        Toast.fire({
          icon: "error",
          title: "Your WETH balance is not enough",
        });

        return false;
      }

      this.buttonClicked = true;
      const result = await this.makeOffer({ tokenAddress, tokenId, price });
      if (result) {
        Toast.fire({
          icon: "success",
          title: "Your offer succesfully placed.",
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
  },
};
</script>

<style lang="scss" scoped>
.sell-card {
  width: 100%;
  height: 100%;
  min-height: 30rem;

  background-color: rgb(251, 253, 255);
  border: 2px solid rgb(229, 232, 235);
  border-radius: 0.5rem;

  &__header {
    height: 12%;
    border-bottom: 2px solid rgb(229, 232, 235);
    padding: 0 0;
  }

  &__body {
    padding: 1rem 2rem;
  }

  &__footer {
    border-top: 2px solid rgb(229, 232, 235);
    padding: 1rem 2rem;
  }
}

.section-item {
  padding: 1rem 0;

  .img-wrapper {
    background-color: red;
    width: 10rem;
    height: 10rem;

    border-radius: 1rem;

    margin-right: 1rem;

    img {
      width: 100%;
      height: 100%;

      border-radius: inherit;
    }
  }

  .item-header {
    margin-bottom: 0.5rem;
  }

  .item-details {
    padding-left: 1rem;
  }

  .details {
    line-height: 1.8rem;
    padding-top: 0.8rem;
  }
}

.section-price {
  padding-top: 0.5rem;

  .header {
    margin-bottom: 0.5rem;
  }

  img {
    width: 2rem;
    height: 2rem;

    margin-right: 0.5rem;
  }
}

.btn-wrapper {
  width: 10rem;
  height: 3rem;
}

input {
  height: 3rem;
}

hr {
  border: 1px solid rgb(229, 232, 235);
}

span.header {
  font-weight: 600;
}

.overlay {
  height: 100%;
  width: 100%;

  position: relative;
  z-index: 999;
}

.cross-wrapper {
  position: fixed;
  right: 0px;

  width: 2.5rem;
  height: 2.5rem;

  &:hover {
    cursor: pointer;
  }
}
</style>