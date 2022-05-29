<template lang="pug">
.banner-container
  img(src="../../ninja-banner.jpg")
.padding-1x
  .logo-container
    img(src="../../ninja-logo.jpg")

  .about-container
    h1 Ninja Squad Official
    .creator
      span By&nbsp;
      span.creator-address Ninja Squad (0xASD123asdASsa)

    p.description Sit velit pariatur aliqua reprehenderit quis amet eu dolor ullamco non ipsum excepteur
      span(v-show="hidden") ...
      span#seeMore(v-if="hidden", @click="toggleDescription")
        br 
        span See more&nbsp;
          i.fa-solid.fa-chevron-down.fa-sm
      span#moreText(v-else) &nbsp;Voluptate velit amet velit adipisicing dolor excepteur culpa esse amet. Voluptate do eiusmod pariatur nostrud. Commodo sit pariatur laboris laboris occaecat pariatur occaecat id Lorem sunt elit. Exercitation laborum occaecat dolor laboris. Velit elit nisi tempor mollit incididunt cupidatat ut irure dolore cillum ex culpa. Nostrud dolor aliquip labore non id pariatur.&nbsp;
        br 
        br 
        span#seeLess(@click="toggleDescription") Show Less&nbsp;
          i.fa-solid.fa-chevron-up.fa-sm

    .statistics-container.flex__row.flex__jc-fs.flex__ai-c
      .filter-icon-wrapper(@click="toggleFilterBar")
        i.fa-solid.fa-bars.flex__row.flex__jc-c.flex__ai-c.fa-xl
      .stat-box
        p.value 8.9K
        p.key items
      .stat-box
        p.value 3.2K
        p.key owners
      .stat-box
        p.value 0.23
        p.key floor price
      .stat-box
        p.value 2.0K
        p.key total volume

  .showroom-container.flex__row.flex__jc-fs.flex__ai-fs
    transition(name="slide")
      .filters-bar(
        v-show="!isFilterBarHidden",
        :class={ hidefilterBar: isFilterBarHidden }
      )
        .header.flex__row.flex__jc-sb.flex__ai-c
          p Filters
          .filter-icon-wrapper(@click="toggleFilterBar")
            i.fa-solid.fa-bars.flex__row.flex__jc-c.flex__ai-c
        .border
        appListingStatusFilter
        appOrderByFilter
    .cards-layout
</template>

<script>
import ListingStatusFilter from "../components/shared/Filters/ListingStatusFilter.vue";
import OrderByFilter from "../components/shared/Filters/OrderByFilter.vue";

export default {
  name: "CollectionPage",
  components: {
    appListingStatusFilter: ListingStatusFilter,
    appOrderByFilter: OrderByFilter,
  },
  data() {
    return {
      hidden: true,
      isFilterBarHidden: false,
    };
  },
  methods: {
    toggleDescription() {
      this.hidden = !this.hidden;
    },
    toggleFilterBar() {
      this.isFilterBarHidden = !this.isFilterBarHidden;
    },
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
    width: 33.6rem;
    margin-left: -1.2rem;
    transition: 0.5s;

    .header {
      font-size: 2rem;
      padding: 0.4em 0.6em;
      padding-right: 0px;

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
    background-color: purple;
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

@media all and (min-width: 1600px) {
  .padding-1x {
    padding: 0 64px;
  }
}

@media all and (min-width: 769px) {
  .description {
    margin-bottom: 32px;
    max-width: 60%;
  }
}
</style>