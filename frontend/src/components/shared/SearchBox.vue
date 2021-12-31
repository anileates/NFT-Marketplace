<template lang="pug">
.searchBox-container
  .flex-row.flex-jc-c.flex-ai-c
    i.fas.fa-search
    input(placeholder="Search user, collection or NFT")
  .dropdown-results
    ul.flex-col.flex-ai-c.flex-jc-sb
      li
        app-search-result-item
      li
        app-search-result-item
      li
        app-search-result-item
</template>

<script>
import inputBox from "./InputBox";
import Avatar from "./Avatar";
import SearchResultItem from "./SearchResultItem";

export default {
  name: "SearchBox",
  components: {
    appInputBox: inputBox,
    appAvatar: Avatar,
    appSearchResultItem: SearchResultItem
  },
  data() {
    return {
      imageUrl: 'https://lh3.googleusercontent.com/xVyUwQMXGvCha3V8UQ1laIx5tfwpmR76Bu1L0oaNKHfxz0FS_t5Y6wRlXBTFqZNlGb0ixL4_TSifMtjQUgv25ZPuTHaFVNitFGf4Dw=s0'
    }
  }
}
</script>

<style lang="scss">
.searchBox-container {
  background-color: white;

  border: 1px solid rgba(197, 197, 197, .5);
  border-radius: 0.5rem;
  outline: none;

  width: 100%;
  height: 100%;

  &:focus-within {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  }
}

input {
  height: 90%;
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

  border: 1px solid rgba(197, 197, 197, .5);
  border-radius: 0.5rem;
  outline: none;

  box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.25);

  ul {
    list-style-type: none;
    flex-wrap: wrap;
  }

  li {
    color: black;

    width: 100%;
    height: 3.5625rem;
    border: 1px solid rgba(197, 197, 197, .5);

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