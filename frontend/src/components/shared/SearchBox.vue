<template lang="pug">
.searchBox-container.flex-row.flex-jc-c.flex-ai-c
  i.fas.fa-search
  input(placeholder="Search user, collection or NFT")


</template>

<script>
import inputBox from "./InputBox";

export default {
  name: "SearchBox",
  components: {
    appInputBox: inputBox
  },
  data() {

  }
}
</script>

<style lang="scss">
.searchBox-container {
  background-color: white;
  border: 1px solid rgba(197, 197, 197, .4) ;

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
</style>