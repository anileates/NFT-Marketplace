<script>
export default {
  name: 'DropdownCard',
  props: {
    isCollapsible: {
      type: Boolean,
      required: true,
      default: true
    },
    collapseByDefault: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCollapsed: this.$props.collapseByDefault
    }
  },
  computed: {},
  methods: {
    minimizeCard() {
      if (this.isCollapsible) this.isCollapsed = !this.isCollapsed
    }
  }
}
</script>

<template lang="pug">
.dropdown-card
  .header.flex-row.flex-ai-c.flex-jc-sb(:class="{collapsibleCard: isCollapsible}" @click="minimizeCard")
    slot(name="dropdownCardHeader")
    i.fas.fa-chevron-down(v-show="isCollapsible && isCollapsed")
    i.fas.fa-chevron-up(v-show="isCollapsible && !isCollapsed")
  .body(v-show="!isCollapsible || !isCollapsed")
    slot(name="dropdownCardBody")
</template>

<style lang="scss">
.dropdown-card {
  width: 100%;
  min-width: 28rem;
  border-radius: 1rem;
  border: 2px solid rgb(229, 232, 235);

  .header {
    width: 100%;
    height: 28%;
    min-height: 4rem;
    padding: 0 1rem;

    i {
      margin-right: 0.5rem;
      color: rgb(112, 122, 131);
    }
  }

  .body {
    width: 100%;
    padding: 0.3rem 0;
    background-color: rgb(251, 253, 255);

    border-top: 1px solid rgb(229, 232, 235);

    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
  }
}

.collapsibleCard {
  cursor: pointer;
}
</style>