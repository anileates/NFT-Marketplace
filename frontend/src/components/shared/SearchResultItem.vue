<template lang="pug">
a.search-result-item.flex-row.flex-ai-c
  .avatar-wrapper
    app-avatar(:imgUrl="imageUrl"  :isEditable="false")
  p User or collection name here
</template>

<script>
import Avatar from "./Avatar";

export default {
  name: "SearchResultItem",
  components: {
    appAvatar: Avatar
  },
  data() {
    return {
      imageUrl: 'https://lh3.googleusercontent.com/xVyUwQMXGvCha3V8UQ1laIx5tfwpmR76Bu1L0oaNKHfxz0FS_t5Y6wRlXBTFqZNlGb0ixL4_TSifMtjQUgv25ZPuTHaFVNitFGf4Dw=s0'
    }
  }
}
</script>

<style lang="scss">
a {
  /* Make text not selectable */
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

.search-result-item {
  width: 100%;
  height: 100%;
  padding-left: 1rem;

  color: black;

  cursor: pointer;
  &:hover {
    box-shadow: 2px 2px 30px 0 rgba(197, 197, 197, .9)
  }

  .avatar-wrapper {
    width: 2rem;
    height: 2rem;

    background-color: black;

    border-radius: 50%;
    margin-right: 1rem;
  }
}

</style>