<script>

import DropdownCardMain from "./DropdownCardMain";

export default {
  name: 'TraitsCard',
  props: {
    attributes: []
  },
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
    .header-wrapper.flex__row.flex__ai-c.flex__jc-fs
      i.fas.fa-tags
      p Traits
  template(v-slot:dropdownCardBody)
    .body-wrapper
      .trait-line.flex__row.flex__ai-c.flex__jc-sb(v-if="attributes && attributes.length != 0" v-for="attribute in attributes")
        span {{ attribute.trait_type }}
        span {{ attribute.value }}
      p(v-else) No trait found
</template>

<style scoped lang="scss">
.header-wrapper {
  color: black;
  font-size: 1.6rem;
  font-weight: 600;
  letter-spacing: 1px;

  i {
    color: black
  }
}

.body-wrapper {
  font-size: 1.4rem;
  padding: 1.6rem 3.2rem;
  line-height: 2.1rem;

  overflow: auto;
  overflow-x: hidden;
}

</style>