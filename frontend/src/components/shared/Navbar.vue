<template lang="pug">
nav.navbar
  .navbar-left.flex-row.flex-ai-c.flex-jc-sa
    router-link(to="/") LOGO IS HERE
  .navbar-middle
    | Search Bar Is Here
  .navbar-items.flex-col.flex-jc-c
    ul.flex-row.flex-jc-sa
      li
        a Explore
      li(@click="login")
        a Sign In
      li(@click="logout")
        a Sign Out
      li
        a Profile
      router-link(to="/settings", tag="li")
        a Settings
</template>


<script>
import { mapActions } from 'vuex'
export default {
  name: "Header",
  data() {
    return {};
  },
  methods: {
    ...mapActions(['initAuth', 'logout']),
    async login() {
      await this.initAuth()
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  color: white;
  height: 4.6rem;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  box-shadow: 0 1px 10px gray;

  &-left {
    color: black;
    width: 24rem;

    list-style-type: none;

    font-weight: 600;
    font-size: 1.5rem;

    box-sizing: border-box;
    padding-right: 8rem;
  }

  &-middle {
    width: 36rem;
  }

  &-items {
    width: 36rem;
  }
}

ul {
  list-style-type: none;

  font-family: "Poppins", sans-serif;
  font-weight: 600;
  line-height: 1.5rem;

  cursor: pointer;
  /* Make text not selectable */
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
}

a {
  text-decoration: none;
  color: gray;
}
</style>