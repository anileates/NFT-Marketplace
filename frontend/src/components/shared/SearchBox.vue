<template lang="pug">
.searchBox-container
  .flex__row.flex__jc-c.flex__ai-c(style="height: 100%")
    i.fas.fa-search(@click="search")
    input(placeholder="Search user, collection or NFT", v-model="searchText")
  .dropdown-results(v-if="showResult")
    ul.flex__col.flex__ai-c.flex__jc-sb(v-if="users.length != 0")
      li(v-for="user in users")
        app-search-result-item(:userItem="{ imageUrl: user.attributes.avatar._url, title: user.attributes.username}")
    ul.flex__col.flex__ai-c.flex__jc-sb(v-if="items.length != 0")
      li(v-for="item in items")
        app-search-result-item(:assetItem="convertItemToProp(item)")
    p.flex__col.flex__jc-sb(v-else)(
      style="color: black; padding: 0.5rem 1rem; font-size: 0.8rem"
    ) No items found...
</template>

<script>
import inputBox from "./InputBox";
import Avatar from "./Avatar";
import SearchResultItem from "./SearchResultItem";
import { mapActions } from "vuex";

export default {
  name: "SearchBox",
  components: {
    appInputBox: inputBox,
    appAvatar: Avatar,
    appSearchResultItem: SearchResultItem,
  },
  data() {
    return {
      imageUrl:
        "https://lh3.googleusercontent.com/xVyUwQMXGvCha3V8UQ1laIx5tfwpmR76Bu1L0oaNKHfxz0FS_t5Y6wRlXBTFqZNlGb0ixL4_TSifMtjQUgv25ZPuTHaFVNitFGf4Dw=s0",
      searchText: "",
      users: [],
      items: [],
      showResult: false,
    };
  },
  methods: {
    ...mapActions(["searchUser", "searchNFT"]),
    async search() {
      this.users = await this.searchUser(this.searchText);
      const resItems = await this.searchNFT(this.searchText);
      this.items = resItems.result;

      this.showResult = true;
    },
    convertItemToProp(item) {
      const itemMetadata = JSON.parse(item.metadata);

      return {
        imageUrl: itemMetadata.image,
        title: itemMetadata.name,
        contractAddress: item.token_address,
        tokenId: item.token_id,
      };
    },
  },
  computed: {},
};
</script>

<style scoped lang="scss">
.searchBox-container {
  background-color: white;

  border: 1px solid rgba(197, 197, 197, 0.5);
  border-radius: 0.5rem;
  outline: none;

  width: 100%;
  height: 100%;

  &:focus-within {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  }
}

input {
  height: 80%;
  width: 90%;
  border: none;
  font-size: 1rem;
  padding: 1rem;
  outline: none;
}

i {
  color: black;
}

.dropdown-results {
  width: 100%;
  max-height: 40rem;
  overflow: auto;
  overflow-x: hidden;
  position: relative;
  z-index: 1;

  background-color: white;

  border: 1px solid rgba(197, 197, 197, 0.5);
  border-radius: 0.5rem;
  outline: none;

  box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.25);

  ul {
    list-style-type: none;
    flex__wrap: wrap;
  }

  li {
    color: black;

    width: 100%;
    height: 3.5625rem;
    border: 1px solid rgba(197, 197, 197, 0.5);

    &:first-child {
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
    }

    &:last-child {
      border-bottom-left-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
    }
  }
}
</style>