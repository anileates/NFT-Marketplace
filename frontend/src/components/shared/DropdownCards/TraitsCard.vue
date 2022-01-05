<script>

import DropdownCardMain from "./DropdownCardMain";

export default {
  name: 'TraitsCard',
  components: {
    appDropdownCard: DropdownCardMain
  },
  data() {
    return {}
  }
}
</script>

<template lang="pug">
app-dropdown-card(:isCollapsible="true" :collapseByDefault="true")
  template(v-slot:dropdownCardHeader)
    .header-wrapper.flex-row.flex-ai-c.flex-jc-fs
      i.fas.fa-tags
      p Traits
  template(v-slot:dropdownCardBody)
    .body-wrapper
      p Trait 1
      p Trait 1
      p Trait 1
      p Trait 1
      p Trait 1
      p Trait 1
</template>

<style scoped lang="scss">
.header-wrapper {
  color: black;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.03rem;

  i {
    color: black
  }
}

.body-wrapper {
  font-size: 0.875rem;
  padding: 1rem 2rem;
  line-height: 1.3125rem;

  max-height: 10rem;
  overflow: auto;
  overflow-x: hidden;
}

</style>