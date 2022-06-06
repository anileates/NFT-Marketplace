<template lang="pug">
#root
  app-navbar
  router-view
</template>

<script>
import Navbar from "./components/shared/Navbar";
import { mapActions} from "vuex";

export default {
  components: {
    appNavbar: Navbar,
  },
  methods: {
    ...mapActions(['initAuth'])
  },
  created() {
    this.initAuth()
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

:root {
  font-size: 62.5%;
}

/******** Flex Classes ********/

.flex {
  display: flex;

  &__row {
    @extend .flex;
    flex-direction: row;
  }

  &__col {
    @extend .flex;
    flex-direction: column;
  }

  &__jc-c {
    justify-content: center;
  }

  &__jc-sa {
    justify-content: space-around;
  }

  &__jc-sb {
    justify-content: space-between;
  }

  &__ai-c {
    align-items: center;
  }

  &__ai-fs {
    align-items: flex-start;
  }

  &__ai-fe {
    align-items: flex-end;
  }
}
</style>
