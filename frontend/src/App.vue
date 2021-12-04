<template lang="pug">
#root
  app-navbar
  router-view
</template>

<script>
import Navbar from "./components/shared/Navbar";

export default {
  components: {
    appNavbar: Navbar,
  } 
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;

  font-family: "Poppins", sans-serif;
  box-sizing: border-box;
}

/******** Flex Classes ********/

.flex {
  display: flex;

  &-row {
    @extend .flex;
    flex-direction: row;
  }

  &-col {
    @extend .flex;
    flex-direction: column;
  }

  &-jc-c {
    justify-content: center;
  }

  &-jc-sa {
    justify-content: space-around;
  }

  &-jc-sb {
    justify-content: space-between;
  }

  &-ai-c {
    align-items: center;
  }

  &-ai-fs {
    align-items: flex-start;
  }
}
</style>
