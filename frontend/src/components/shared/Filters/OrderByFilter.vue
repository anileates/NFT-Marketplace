<script>
import Filter from "./Filter.vue";
import ButtonWithCheckbox from "../Buttons/ButtonWithCheckbox.vue";

export default {
  name: "OrderByFilter",
  components: {
    appFilter: Filter,
    appButtonWithCheckbox: ButtonWithCheckbox,
  },
  data() {
    return {
      lowToHighSelected: true,
      highToLowSelected: false,
    };
  },
  methods: {
    /**
     * Toggle the buttons when any of them clicked
     * And emit an event to pass the choice selected by the user 
     * so that collection page can sort the nfts according to emitted value
     */
    selectItem(event) {
      if (event.currentTarget.id == "highToLow" && !this.highToLowSelected) {
        this.lowToHighSelected = false;
        this.highToLowSelected = true;

        this.$emit("orderSelected", "DESC");
      } else if (
        event.currentTarget.id == "lowToHigh" &&
        !this.lowToHighSelected
      ) {
        this.lowToHighSelected = true;
        this.highToLowSelected = false;

        this.$emit("orderSelected", "ASC");
      }
    },
  },
};
</script>

<template lang="pug">
appFilter(filterName="Order By")
  template(v-slot:filter-content)
    appButtonWithCheckbox#lowToHigh.custom-font(
      buttonText="Price: Low to High",
      @click="selectItem",
      :isChecked="lowToHighSelected",
      :key="lowToHighSelected",
      :disabled="lowToHighSelected"
    )
    appButtonWithCheckbox#highToLow.custom-font(
      buttonText="Price: High to Low",
      @click="selectItem",
      :isChecked="highToLowSelected",
      :key="highToLowSelected",
      :disabled="highToLowSelected"
    )
</template>

<style lang="scss" scoped>
.custom-font {
  font-weight: 400 !important;
  letter-spacing: 0.2px;
}

button:disabled {
  color: #66bb6a;
}
</style>