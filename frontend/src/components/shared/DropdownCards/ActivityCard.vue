<template lang="pug">
app-dropdown-card(:isCollapsible="false")
  template(v-slot:dropdownCardHeader)
    .header-wrapper.flex__row.flex__ai-c.flex__jc-fs
      i.fa-solid.fa-arrow-right-arrow-left
      p Item Activity
  template(v-slot:dropdownCardBody)
    .body-wrapper.flex__col.flex__jc-c.flex__ai-c(v-if="getActivities && getActivities.length > 0")
      #tableHeader
        .wrapper.flex__row.flex__jc-fs.flex__ai-c
          .col-2x
            span Event
          .col-2x
            span Price
          .col-2x
            span From
          .col-2x
            span To
          .col-2x
            span Date
      #tableBody
        .row.wrapper.flex__row.flex__jc-fs.flex__ai-c(
          v-for="activity in getActivities"
        )
          .col-2x
            span {{ activity.type }}
          .col-2x
            img.weth(
              src="https://openseauserdata.com/files/accae6b6fb3888cbff27a013729c22dc.svg"
            )
            span.amount {{ activity.price }}
            span.symbol WETH
          .col-2x
            span {{ activity.from && $filters.minimizeEthAddress(activity.from) }}
          .col-2x
            span {{ activity.to && $filters.minimizeEthAddress(activity.to) }}
          .col-2x
            span ---
    .no-offer-body.flex__col.flex__ai-c.flex__jc-c(v-else)
      i.fa-solid.fa-arrow-right-arrow-left.fa-4x
      span No Activity Yet
</template>

<script>
import DropdownCardMain from "./DropdownCardMain";
import { ethers } from "ethers";

export default {
  name: "ActivityCard",
  props: {
    activity: {},
  },
  components: {
    appDropdownCard: DropdownCardMain,
  },
  data() {
    return {};
  },
  methods: {
  },
  computed: {
    getActivities() {
      let _activities = [];

      const offers = this.activity.offers;
      for (let i = 0; i < offers.length; i++) {
        let _item = {};
        _item.tokenId = offers[i].args.tokenId.toString();
        _item.price = ethers.utils.formatUnits(offers[i].args.price, "ether");
        _item.from = offers[i].args.bidder;
        _item.bidId = offers[i].args.bidId.toString();
        _item.type = "OFFER";
        _item.blockNumber = offers[i].blockNumber;
        _activities.push(_item);
      }

      const listings = this.activity.listings;
      for (let i = 0; i < listings.length; i++) {
        let _item = {};
        _item.tokenId = listings[i].args.tokenId.toString();
        _item.price = ethers.utils.formatUnits(listings[i].args.price, "ether");
        _item.from = listings[i].args.owner;
        _item.listingId = listings[i].args.listingId.toString();
        _item.type = "LISTING";
        _item.blockNumber = listings[i].blockNumber;
        _activities.push(_item);
      }

      const sales = this.activity.sales;
      for (let i = 0; i < sales.length; i++) {
        let _item = {};
        _item.price = ethers.utils.formatUnits(sales[i].args.price, "ether");
        _item.from = sales[i].args.seller;
        _item.to = sales[i].args.buyer;
        _item.saleCount = sales[i].args.saleCount.toString();
        _item.type = "SALE";
        _item.blockNumber = sales[i].blockNumber;
        _activities.push(_item);
      }

      // Sort the offers by blockNumber in descending
      return _activities.sort((a, b) => {
        return b.blockNumber - a.blockNumber;
      });
    },
  },
};
</script>

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
  font-size: 1rem;

  border-bottom: 1px solid rgb(229, 232, 235);
  text-align: left;

  .wrapper {
    padding: 0 1rem;
  }
}

#tableBody {
  width: 100%;
  /* height: 100%; */
  text-align: left;

  .row {
    height: 4rem;
    padding: 0 1rem;
    border-bottom: 1px solid rgb(229, 232, 235);
  }

  .row:last-child {
    border-bottom: 0;
  }
}

.col {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 1rem;

  &-1x {
    @extend .col;
    width: 10%;
  }

  &-2x {
    @extend .col;
    width: 20%;
  }

  &-3x {
    @extend .col;
    width: 30%;
  }

  &-4x {
    @extend .col;
    width: 40%;
  }

  &-5x {
    @extend .col;
    width: 50%;
  }
}

img.weth {
  width: 1rem;
  margin-right: 1rem;
}

span.amount {
  font-weight: 600;
  margin-right: 0.3rem;
  font-size: 1rem;
}

.no-offer-body {
  padding: 1rem;
  color: #ccd1e4;

  i {
    margin-bottom: 0.5rem
  }
}

// .no-offer-body {
//   padding: 1rem;
//   color: #ccd1e4;
//
//   i {
//     margin-bottom: 0.5rem
//   }
// }
</style>
