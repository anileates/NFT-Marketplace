<template lang="pug">
.user-page-container
  .profile-header.flex__col.flex__jc-c.flex__ai-c
    .pp-layer(:style="randomColor")
      app-avatar(
        v-if="getFoundUser.avatar",
        :imgUrl="getFoundUser.avatar._url",
        :isEditable="false"
      )
    .other-layer
      .cover-image
        app-avatar(
          v-if="getFoundUser.cover",
          :imgUrl="getFoundUser.cover._url",
          :isEditable="false"
        )
      .bio-section.flex__col.flex__jc-c.flex__ai-c
        h3 {{ getFoundUser.username }}
        p {{ getFoundUser.biography }}

  .showroom.flex__row.flex__jc-c
    .card-layout
      .card
        app-nft-card
      .card
        app-nft-card
      .card
        app-nft-card
      .card
        app-nft-card
      .card
        app-nft-card
      .card
        app-nft-card
      .card
        app-nft-card
      .card
        app-nft-card
      .card
        app-nft-card
</template>

<script>
import Avatar from "../components/shared/Avatar";
import NftCard from "../components/shared/NftCard";
import { mapGetters } from "vuex";

export default {
  name: "UserPage",
  components: {
    appAvatar: Avatar,
    appNftCard: NftCard
  },
  data() {
    return {
      url: "https:///i.pinimg.com/736x/02/70/6c/02706c93c5f630d1e1ae987c15ae7f53.jpg",
    };
  },
  computed: {
    ...mapGetters(["getFoundUser"]),
    randomColor() {
      let random = Math.floor(Math.random() * 16777215).toString(16);
      return {
        backgroundColor: "#" + random,
      };
    },
  },
  methods: {},
  created() {},
};
</script>

<style lang="scss" scoped>
.profile-header {
  height: 30rem;
  border-bottom: 1px solid #c2c2c2;

  .pp-layer {
    // background-color: red;
    position: absolute;
    width: 8rem;
    height: 8rem;

    border-radius: 50%;
  }
}

.other-layer {
  display: inline;
  height: 100%;
  width: 100%;

  .cover-image {
    background-color: #e5e8eb;
    width: 100%;
    height: 50%;
  }

  .bio-section {
    width: 100%;
    height: 50%;

    h3 {
      font-size: 2.5rem;
      margin-bottom: 2rem;
      margin-top: 1rem;
    }

    p {
      font-size: 1.2rem;
      font-weight: 500;
      color: #707a9f;
    }
  }
}

.showroom {
  width: 100%;
  margin-top: 1rem;

  .card-layout {
    width: 88rem;

    display: flex;
    flex__direction: row;
    justify-content: flex__start;
    flex__wrap: wrap;

    .card {
      margin: 0.5rem 1rem;
      width: 20rem;
      height: 29rem;
    }
  }
}
</style>