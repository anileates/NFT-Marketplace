<script>
import Filter from "./Filter.vue";
import ButtonWithCheckbox from "../Buttons/ButtonWithCheckbox.vue";

export default {
  name: "OrderByFilter",
  components: {
    appFilter: Filter,
    appButtonWithCheckbox: ButtonWithCheckbox,
  },
};
</script>

<template lang="pug">
appFilter(filterName="Order By")
  template(v-slot:filter-content)
    appButtonWithCheckbox.custom-font(
      buttonText="Price: Low to High",
    )
    appButtonWithCheckbox.custom-font(
      buttonText="Price: High to Low",
    )
</template>

<style lang="scss" scoped>
.custom-font {
  font-weight: 400 !important;
  letter-spacing: 0.2px;
}
</style>