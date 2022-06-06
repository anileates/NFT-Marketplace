<script>
import DropdownCardMain from "./DropdownCardMain";
import { mapActions, mapGetters } from "vuex";
import { Toast } from "../../../SweetAlert";
import router from "../../../router/index"

export default {
  name: "OffersCard",
  components: {
    appDropdownCard: DropdownCardMain,
  },
  props: {
    offers: [],
    isOwner: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      active: false,
    };
  },
  computed: {
    getOffersInDescending() {
      // Sort the offers by price in descending
      return this.offers.sort((a, b) => {
        return b.price - a.price;
      });
    },
    getOffersInAscending() {
      // Sort the offers by price in ascending
      return this.offers.sort((a, b) => {
        return a.price - b.price;
      });
    },
  },
  methods: {
    ...mapActions({ acceptOffer: "acceptOffer" }),
    async _acceptOffer(bidId, price) {
      const nftContractAddress = this.$route.params.tokenAddress;
      const tokenId = this.$route.params.tokenId;
      
      const res = await this.acceptOffer({ nftContractAddress, tokenId, bidId, price })
      if(res) {
        Toast.fire({
          icon: "success",
          title: "You sold an asset!👏🎉",
        });

        await router.push("/");
      } else {
        Toast.fire({
          icon: "error",
          title: "Something went wrong!😞 Please try again later. ",
        })
      }
    },
  }
};
</script>

<template lang="pug">
app-dropdown-card(:isCollapsible="true", :collapseByDefault="false")
  template(v-slot:dropdownCardHeader @click="btnClck")
    .header-wrapper.flex__row.flex__ai-c.flex__jc-fs
      i.fa-solid.fa-hand
      p Offers
  template(v-slot:dropdownCardBody)
    .body-wrapper.flex__col.flex__jc-c.flex__ai-c(v-if="offers && offers.length > 0")
      #tableHeader
        .wrapper.flex__row.flex__jc-fs.flex__ai-c
          .col-price
            span Price
          .col-from
            span From
          .col-action
            span Action
      #tableBody
        .row.wrapper.flex__row.flex__jc-fs.flex__ai-c(v-for="offer in getOffersInDescending")
          .col.col-price
            img.weth(
              src="https://openseauserdata.com/files/accae6b6fb3888cbff27a013729c22dc.svg"
            )
            span.amount {{ offer.price }}
            span.symbol WETH
          .col.col-from
            span {{ $filters.minimizeEthAddress(offer.bidder) }}
          .col.col-actions
            button(@click="_acceptOffer(offer.bidId, offer.price)" v-show="isOwner").accept-bid Accept
    .no-offer-body.flex__col.flex__ai-c.flex__jc-c(v-else)
      i.fa-solid.fa-money-check-dollar.fa-5x
      span No offers yet
</template>

<style lang="scss" scoped>
a,
a:link,
a:visited {
  color: #2081e2;
  text-decoration: none;

  &:visited {
    color: #2081e2;
  }
}

.header-wrapper {
  color: black;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.03rem;

  i {
    color: black;
  }
}

.body-wrapper {
  font-size: 0.875rem;
  line-height: 1.3125rem;
}

#tableHeader {
  width: 100%;
  height: 100%;
  background-color: #fff;

  border-bottom: 1px solid rgb(229, 232, 235);
  text-align: left;
}

#tableBody {
  width: 100%;
  height: 100%;
  text-align: left;

  .row {
    height: 4rem;
    border-bottom: 1px solid rgb(229, 232, 235);
  }

  .row:last-child {
    border-bottom: 0;
  }
}

.wrapper {
  padding: 0 1rem;
}

.col {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.col-price {
  width: 30%;
  font-size: 1rem;

  img.weth {
    width: 1rem;
    margin-right: 1rem;
  }

  span.amount {
    font-weight: 600;
    margin-right: 0.3rem;
  }
}

.col-from {
  width: 40%;
  font-size: 1rem;
}

.col-actions {
  width: 30%;
  font-size: 1rem;
}

button.accept-bid {
  background-color: #fff;
  border: 1px solid red;

  height: 2.5rem;
  width: 40%;

  border-radius: 0.3rem;
  color: red;

  &:hover {
    background-color: red;
    color: #fff;
    cursor: pointer;
  }

  transition: 0.2s;
}

.no-offer-body {
  padding: 1rem;
  color: #ccd1e4;

  i {
    margin-bottom: 0.5rem
  }
}
</style>