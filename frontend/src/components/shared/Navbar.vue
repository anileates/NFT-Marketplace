<template lang="pug">
nav
  .navbar.padding-1x(:class="doublePadding")
    .navbar-left.flex__row.flex__ai-c.flex__jc-sa(v-show="!showSearchbox")
      router-link(to="/") LOGO IS HERE

    transition(name="slide") 
      .navbar-middle.flex__row.flex__ai-c(v-if="!isMobile || showSearchbox")
        .searchbox-wrapper
          app-search-box

    .navbar-items.flex__col.flex__jc-c(v-show="isLarge")
      ul.flex__row.flex__jc-sa
        .list-item-wrapper(@mouseover="hovered = true" @mouseleave="hovered = false")
          li
            a Create
          .dropdown-menu(:class="{ visible: hovered }")
            ul.flex__col.flex__jc-fs.flex__ai-fs
              li
                a(href="/create-new-item") Create Item
              li
                a(href="/create-collection") Create Collection
        .list-item-wrapper
          li(@click="login")
            a Sign In
        .list-item-wrapper
          li(@click="_logout")
            a Sign Out
        .list-item-wrapper
          li
            a Profile
        .list-item-wrapper.animated-border
          router-link(to="/settings", tag="li")
            a Settings

    .mobile-navbar-wrapper.flex__row.flex__jc-c.flex__ai-c(
      v-show="isSmall || isMobile"
    )
      .mobile-search-icon-wrapper.flex__row.flex__jc-c.flex__ai-c(
        v-show="isMobile",
        @click="toggleSearchBox"
      )
        i.fas.fa-search.fa-xl

      .hamburger-menu-button-wrapper.flex__row.flex__jc-c.flex__ai-c(
        v-show="!(isMobile && showSearchbox)"
      )
        i.fa-solid.fa-bars.fa-xl
</template>


<script>
import { mapActions } from "vuex";
import SearchBox from "./SearchBox";

export default {
  name: "Header",
  components: {
    appSearchBox: SearchBox,
  },
  data() {
    return {
      isLarge: null,
      isMobile: null,
      isSmall: null,
      showSearchbox: false,
      showMenu: false,
      hovered: false
    };
  },
  methods: {
    ...mapActions(["initAuth", "logout"]),
    async login() {
      await this.initAuth();
    },
    async _logout() {
      this.logout();
    },
    resizeHandler(e) {
      if (screen.width > 1200) {
        this.isSmall = false;
        this.isMobile = false;
        this.isLarge = true;
      }
      if (screen.width <= 1200) {
        this.isSmall = true;
        this.isMobile = false;
        this.isLarge = false;
      }
      if (screen.width <= 768) {
        this.isSmall = false;
        this.isMobile = true;
        this.isLarge = false;
      }
    },
    // Toggle mobile searchbox
    toggleSearchBox() {
      this.showSearchbox = !this.showSearchbox;
    },
  },
  created() {
    if (screen.width > 1200) {
      this.isLarge = true;
    }
    if (screen.width <= 1200) {
      this.isSmall = true;

      this.isMobile = false;
      this.isLarge = false;
    }
    if (screen.width <= 768) {
      this.isMobile = true;

      this.isSmall = false;
      this.isLarge = false;
    }

    window.addEventListener("resize", this.resizeHandler);
  },
  computed: {
    doublePadding() {
      return {
        doublePadding: this.isMobile && this.showSearchbox,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  font-size: 1.6rem;
  color: white;
  height: 4em;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  box-shadow: 0 1px 10px gray;

  &-left {
    font-size: 2rem;
    color: black;

    min-width: 13.5rem;
    margin-right: 1em;

    list-style-type: none;
    font-weight: 600;

    box-sizing: border-box;
  }

  &-middle {
    width: 50%;
    margin-right: 1rem;

    .searchbox-wrapper {
      width: 100%;
      height: 70%;
    }
  }

  &-items {
    width: 50rem;
  }
}

ul {
  font-size: 1.8rem;
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

  .list-item-wrapper {
    .dropdown-menu {
      visibility: hidden;
      background-color: #fff;
      position: absolute;
      color: black;

      box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
      border-radius: 5px;

      margin-top: 1rem;
      margin-left: -1rem;

      ul {
        li {
          padding: 1.5rem 2rem;
          width: 100%;
          font-size: 1.5rem;

          border-bottom: 1px solid rgb(229, 232, 235);

          &:hover {
            transition: .2s;
            cursor: pointer;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
            border-radius: 5px;
          }
        }

        li:nth-child(2) {
          border: 0;
        }
      }
    }

    padding: 1rem 0;
  }
}

.visible {
  visibility: visible !important;
}

.animated-border {
  transition: 0.2s;
  &:hover {
    cursor: pointer;
    border-bottom: 5px solid turquoise;
    margin-top: -0.5rem;
  }
}

.padding-1x {
  padding: 0 3.2rem;
}

a {
  text-decoration: none;
  color: gray;
}

.mobile-search-icon-wrapper {
  right: 0px;
  color: black;
  padding: 3rem 2rem;
  border-radius: 50%;
  margin-left: -1rem;

  transition: 0.3s;
  &:hover {
    cursor: pointer;
    background-color: rgb(229, 232, 235);
  }
}

.hamburger-menu-button-wrapper {
  color: black;
  margin-right: -2rem;

  padding: 3rem 2rem;
  border-radius: 50%;

  transition: 0.3s;
  &:hover {
    cursor: pointer;
    background-color: rgb(229, 232, 235);
  }
}

.doublePadding {
  margin-left: -2rem !important;
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
.slide-leave {
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
    transform: translateX(20px);
  }
}

@keyframes slide-in {
  from {
    transform: translateX(20px);
  }

  to {
    transform: translateX(0px);
  }
}

/********************************************/
@media all and (max-width: 600px) {
}

@media all and (max-width: 1200px) {
  .navbar-middle {
    width: 100%;
  }
}

@media all and (min-width: 1600px) {
  .padding-1x {
    padding: 0 14rem;
  }
}
</style>