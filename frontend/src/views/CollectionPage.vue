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
      span#seeMore(v-if="hidden" @click="toggleDescription")
        br 
        span See more&nbsp;
          i.fa-solid.fa-chevron-down.fa-sm
      span#moreText(v-else) &nbsp;Voluptate velit amet velit adipisicing dolor excepteur culpa esse amet. Voluptate do eiusmod pariatur nostrud. Commodo sit pariatur laboris laboris occaecat pariatur occaecat id Lorem sunt elit. Exercitation laborum occaecat dolor laboris. Velit elit nisi tempor mollit incididunt cupidatat ut irure dolore cillum ex culpa. Nostrud dolor aliquip labore non id pariatur.&nbsp; 
        br 
        br 
        span#seeLess(@click="toggleDescription") Show Less&nbsp;
          i.fa-solid.fa-chevron-up.fa-sm

    .statistics-container.flex__row.flex__jc-fs.flex__ai-c
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

  .showroom-container
    p Aliquip occaecat veniam laborum sint eu aute qui nulla ex veniam irure aute ut. Sit laboris nostrud velit aliquip proident in tempor laboris. Adipisicing ipsum veniam voluptate adipisicing pariatur magna pariatur ea tempor veniam irure dolore. Cupidatat magna velit culpa magna laboris nostrud minim adipisicing irure quis Lorem. Amet excepteur Lorem aliqua qui ipsum est adipisicing anim laborum consequat non elit ipsum aliquip. Irure proident proident irure incididunt nostrud dolore pariatur deserunt commodo occaecat proident incididunt exercitation ipsum. Irure anim nostrud voluptate cupidatat id cillum eu consequat aliquip exercitation ullamco eiusmod dolore ipsum.
    p Nisi velit do id incididunt irure do officia tempor exercitation. Ullamco laboris aute ex veniam quis ullamco labore pariatur tempor cupidatat cupidatat. Incididunt commodo sit amet exercitation.
</template>

<script>
export default {
  name: "CollectionPage",
  data() {
    return {
      hidden: true
    }
  },
  methods: {
    toggleDescription() {
      this.hidden = !this.hidden
    }
  }
};
</script>

<style lang="scss" scoped>
.banner-container {
  background-color: red;
  height: 320px;

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
  margin-top: -152px;
  border-radius: 5%;
  padding: 6px;
  height: 176px;
  width: 176px;

  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.25);

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
  // background-color: green;
  padding-top: 48px;

  .creator {
    margin-bottom: 16px;

    &-address {
      font-weight: 600;
    }
  }

  .description {
    margin-bottom: 32px;
  }

  .statistics-container {
    // background-color: orange;

    .stat-box {
      overflow: hidden;
      margin-right: 38px;
      padding: 5px 10px;
      transition: 0.2s;
      border-radius: 5px;

      &:hover {
        cursor: pointer;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
      }

      .key {
        color: #707a83;
        margin-top: -5px;
        letter-spacing: 0.3px;
      }

      .value {
        font-size: 20px;
        font-weight: 600;
      }
    }
  }
}

.showroom-container {
  background-color: purple;
}

.padding-1x {
  padding: 0 32px;
}

#seeMore, #seeLess {
  font-weight: 600;
  color: turquoise;
  margin-top: 30px;
  &:hover {
    cursor: pointer;
    color: green;
  }
}



h1 {
  font-size: 30px;
  font-weight: 600;
}

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