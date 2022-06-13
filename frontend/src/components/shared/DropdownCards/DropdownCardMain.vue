<script>
export default {
  name: "DropdownCard",
  props: {
    isCollapsible: {
      type: Boolean,
      required: true,
      default: true,
    },
    collapseByDefault: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isCollapsed: this.$props.collapseByDefault,
    };
  },
  computed: {},
  methods: {
    minimizeCard() {
      if (this.isCollapsible) this.isCollapsed = !this.isCollapsed;
    },
  },
};
</script>

<template lang="pug">
.dropdown-card
  .header.flex__row.flex__ai-c.flex__jc-sb(
    :class="{ collapsibleCard: isCollapsible }",
    @click="minimizeCard"
  )
    slot(name="dropdownCardHeader")
    i.fas.fa-chevron-down(v-show="isCollapsible && isCollapsed")
    i.fas.fa-chevron-up(v-show="isCollapsible && !isCollapsed")
  transition(name="slide" type="animation")
    .body(v-show="!isCollapsible || !isCollapsed")
      slot(name="dropdownCardBody")
</template>

<style lang="scss">
.dropdown-card {
  width: 100%;
  // min-width: 28rem;
  font-size: 1.6rem;
  border-radius: 1.6rem;
  border: 2px solid rgb(229, 232, 235);
  transition: height 5s;

  .header {
    width: 100%;
    height: 28%;

    padding: 1em 1em;

    i {
      margin-right: 1rem;
      color: rgb(112, 122, 131);
    }
  }

  .body {
    width: 100%;
    background-color: rgb(251, 253, 255);

    border-top: 1px solid rgb(229, 232, 235);

    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
  }
}

.collapsibleCard {
  cursor: pointer;
}

/** Animations & Transitions **/
.slide-enter {
  opacity: 0;
}
.slide-enter-active {
  animation: slide-in .4s ease-out forwards;
  transition: opacity .4s;
  opacity: 1;
}
.slide-leave {
}
.slide-leave-active {
  animation: slide-out .4s ease-out forwards;
  transition: opacity .4s;
  opacity: 0;
}

@keyframes slide-out {
  from {
    transform: translateY(0px);
  }

  to {
    transform: translateY(-20px);
  }
}

@keyframes slide-in {
  from {
    transform: translateY(-20px);
  }

  to {
    transform: translateY(0px);
  }
}
</style>