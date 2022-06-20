<script>
import DropdownCardMain from "./DropdownCardMain";
import CustomButton from "../Buttons/CustomButton";

export default {
  name: "SaleCard",
  components: {
    appDropdownCard: DropdownCardMain,
    appCustomButton: CustomButton,
  },
  props: {
    isForSale: {
      type: Boolean,
      required: false,
      default: false,
    },
    price: {
      type: String,
      required: false,
    },
    disablePurchaseButton: {
      type: Boolean,
      required: true,
    },
    disableOfferButton: {
      type: Boolean,
      required: true,
    },
    hasOffered: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    buyNow() {
      this.$emit("buyNowClicked");
    },
    makeOffer() {
      this.$emit("makeOfferClicked");
    },
    cancelOffer() {
      this.$emit('cancelOfferClicked')
    }    
  },
  data() {
    return {};
  },
};
</script>

<template lang="pug">
app-dropdown-card(:collapseByDefault="false")
  template(v-slot:dropdownCardHeader)
    .header-wrapper.flex__row.flex__ai-c.flex__jc-fs
      i.far.fa-clock.fa-lg
      p(v-if="isForSale") On Sale
      p(v-else) Not For Sale
  template(v-slot:dropdownCardBody)
    .body-wrapper.flex__col.flex__ai-fs.flex__jc-sa
      .title-wrapper
        p Current Price
      .price-wrapper.flex__row.flex__ai-c.flex__jc-fs
        img(
          src="../../../../ethereum.svg"
        )
        span.eth-price(v-if="isForSale") {{ price }}
        span.eth-price(v-else) --
        //- .fiat-equivalent-wrapper
        //-   p ($1,638.61)
      .actions-button-wrapper.flex__row.flex__ai-c.flex__jc-fs
        .btn-wrapper
          app-custom-button(
            buttonText="Buy Now",
            @click="buyNow()",
            :disableButton="this.disablePurchaseButton",
          )
            i.fas.fa-wallet(style="color: white")
        .btn-wrapper(v-if="!hasOffered")
          app-custom-button(
            buttonText="Make Offer",
            @click="makeOffer()",
            :disableButton="this.disableOfferButton",
          )
            i.fas.fa-tag(style="color: white")
        .btn-wrapper(v-else)
          app-custom-button(
            buttonText="Cancel Offer",
            @click="cancelOffer()",
          )
            i.fas.fa-tag(style="color: white")
</template>

<style scoped lang="scss">
.body-wrapper {
  width: 100%;
  height: 100%;
  min-height: 1.6rem;
  // height:  15rem;

  padding: 1rem 1.6rem;
}

.header-wrapper > * {
  color: rgb(112, 122, 131);
}

.title-wrapper {
  p {
    color: rgb(112, 122, 131);

    font-size: 1.5rem;
    line-height: 3.2rem;
  }
}

.price-wrapper {
  // margin-top: -1.6rem;

  img {
    width: 2.5rem;
    height: 2.5rem;
  }

  .eth-price {
    color: rgb(53, 56, 64);

    font-size: 3rem;
    font-weight: 600;
    line-height: 3rem;

    margin-left: 0.5rem;
  }

  .fiat-equivalent-wrapper {
    color: rgb(112, 122, 131);
    font-size: 1.5rem;
    font-weight: 400;
    line-height: 2.25rem;

    margin-top: 1rem;
    margin-left: 1.6rem;
  }
}

.actions-button-wrapper {
  width: 100%;
}

.btn-wrapper {
  width: 20rem;
  height: 4.8rem;

  margin: 1.6rem 0;
  margin-right: 1.6rem;
}
</style>