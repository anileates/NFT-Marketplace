<script>
/**
 * A buttton with checkbox. When button clicked checkbox gets toggled.
 * Mainly, will be used for filters
 */

import CustomCheckbox from "../Buttons/CustomCheckbox.vue";

export default {
  name: "ButtonWithCheckbox",
  components: {
    appCustomCheckbox: CustomCheckbox
  },
  props: {
    buttonText: {
      type: String,
      required: true,
      default: "No text",
    },
  },
  data() {
    return {
      isClicked: false
    }
  },
  methods: {
    buttonClicked() {
      this.isClicked = !this.isClicked;
      this.$emit("buttonCboxClicked");
    }
  }
};
</script>

<template lang="pug">
button.flex__row.flex__jc-sb.flex__ai-c(@click="buttonClicked")
  p {{ buttonText }}
  .customCheckboxWrapper
    appCustomCheckbox(:checked="isClicked" )
</template>


<style lang="scss" scoped>
button {
  background-color: transparent;
  padding: 12px 16px;
  width: 100%;
  border: none;
  border-radius: 10px;

  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.8px;

  transition: 0.1s;
  &:focus,
  &:hover {
    background-color: rgba(229, 232, 235, 0.5);
    border: none;
    outline: none;
    cursor: pointer;
  }
}

.customCheckboxWrapper {
  width: 30px;
  height: 30px;
}
</style>