<script>
import Filter from "./Filter.vue"
import ButtonWithCheckbox from "../Buttons/ButtonWithCheckbox.vue"

export default {
  name: 'ListingStatusFilter',
  components: {
    appFilter: Filter,
    appButtonWithCheckbox: ButtonWithCheckbox
  }
}
</script>

<template lang="pug">
appFilter(filterName="Status")
  template(v-slot:filter-content)
    appButtonWithCheckbox.custom-font(buttonText="Buy Now")
    appButtonWithCheckbox.custom-font(buttonText="On Auction (coming soon...)" disabled)
</template>

<style lang="scss" scoped>
.custom-font {
  font-weight: 400 !important; 
  letter-spacing: 0.2px;
}
</style>