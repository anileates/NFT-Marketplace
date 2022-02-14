<script>
import DropdownCardMain from "./DropdownCardMain";
import CustomButton from "../Buttons/CustomButton";
import MakeOfferButton from "../Buttons/MakeOfferButton";

export default {
  name: 'SaleCard',
  components: {
    appDropdownCard: DropdownCardMain,
    appCustomButton: CustomButton,
    appMakeOfferButton: MakeOfferButton
  },
  props: {
    isForSale: {
      type: Boolean,
      required: false,
      default: false
    },
    price: {
      type: String,
      required: false
    },
    disableButtons: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {}
  }
}
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
        img(src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg")
        span.eth-price(v-if="isForSale") {{ price }}
        span.eth-price(v-else) --
        //- .fiat-equivalent-wrapper
        //-   p ($1,638.61)
      .actions-button-wrapper.flex__row.flex__ai-c.flex__jc-fs
        .btn-wrapper
          app-custom-button(buttonText="Buy Now" :disableButton="disableButtons")
            i.fas.fa-wallet(style="color: white")
        .btn-wrapper
          app-custom-button(buttonText="Make Offer" :disableButton="disableButtons")
            i.fas.fa-tag(style="color: white")
</template>

<style scoped lang="scss">
.body-wrapper {
  width: 100%;
  height: 100%;
  min-height: 10rem;

  padding: 0 1rem;
}

.header-wrapper > * {
  color: rgb(112, 122, 131);
}

.title-wrapper {
  p {
    color: rgb(112, 122, 131);

    font-size: 0.9025rem;
    line-height: 1.3rem;
    margin-bottom: -1rem;
  }
}

.price-wrapper {
  margin-top: -1rem;

  img {
    width: 1.5rem;
    height: 1.5rem;
  }

  .eth-price {
    color: rgb(53, 56, 64);

    font-size: 1.875rem;
    font-weight: 600;
    line-height: 2.8125rem;

    margin-left: 0.5625rem;
  }

  .fiat-equivalent-wrapper {
    color: rgb(112, 122, 131);
    font-size: 0.9375rem;
    font-weight: 400;
    line-height: 1.40625rem;

    margin-top: 0.625rem;
    margin-left: 0.5rem;
  }
}

.actions-button-wrapper {
  width: 100%;

}

.btn-wrapper {
  width: 13.125rem;
  height: 3rem;

  margin-right: 0.5rem;
  margin-top: -1rem;
}

</style>