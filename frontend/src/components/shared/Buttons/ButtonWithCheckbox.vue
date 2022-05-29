<script>
/**
 * A buttton with checkbox. When button clicked checkbox gets toggled.
 * Mainly, will be used for filters
 */

import CustomCheckbox from "../Buttons/CustomCheckbox.vue";

export default {
  name: "ButtonWithCheckbox",
  components: {
    appCustomCheckbox: CustomCheckbox,
  },
  props: {
    buttonText: {
      type: String,
      required: true,
      default: "No text",
    },
    isChecked: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      isClicked: false,
      _isChecked: null,
    };
  },
  methods: {
    buttonClicked() {
      /**
       * Button can be checked by default. 
       * And on the first click it must change properly
       */
      this.isClicked = this._isChecked ? this.isClicked = false : this.isClicked = !this.isClicked;
      this._isChecked = false;

      this.$emit("buttonCboxClicked");
    },
  },
  created() {
    // `_isChecked` internal representation of isChecked prop
    // Assign at created hook
    this._isChecked = this.isChecked;
  },
  computed: {
    checked() {
      return this.isClicked || this._isChecked;
    },
  },
};
</script>

<template lang="pug">
button.flex__row.flex__jc-sb.flex__ai-c(@click="buttonClicked")
  p {{ buttonText }}
  .customCheckboxWrapper
    appCustomCheckbox(:checked="checked")
</template>


<style lang="scss" scoped>
button {
  background-color: transparent;
  padding: 12px 12px;
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