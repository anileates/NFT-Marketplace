<script>
/**
 * This component represents a single filter in the filters section.
 * Basically emits the selections of user
 */

import ButtonWithCheckbox from "../../shared/Buttons/ButtonWithCheckbox.vue";

export default {
  name: "Filter",
  components: {
    appButtonWithCheckbox: ButtonWithCheckbox,
  },
  props: {
    filterName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      filterHidden: true,
    };
  },
  methods: {
    toggleFilter() {
      this.filterHidden = !this.filterHidden;
    },
  },
};
</script>

<template lang="pug">
button.filter
  .filter-header.flex__row.flex__jc-sb.flex__ai-c(@click="toggleFilter")
    span {{ filterName }}
    i.fa-solid.fa-chevron-down.fa-sm(v-if="!filterHidden")
    i.fa-solid.fa-chevron-up.fa-sm(v-else)
  .filter-content(v-show="!filterHidden")
    slot(name="filter-content")
</template>

<style lang="scss" scoped>
.filter {
  background-color: transparent;
  position: relative;

  width: 100%;
  border: none;
  border-radius: 10px;

  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.8px;

  transition: 0.3s;

  .filter-header {
    padding: 12px 12px;
    border-radius: inherit;
    
    transition: 0.3s;

    &:focus,
    &:hover {
      background-color: rgba(229, 232, 235, 0.5);
      border: none;
      outline: none;
      cursor: pointer;
    }
  }
}
</style>