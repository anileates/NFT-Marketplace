<script>
import DropdownCardMain from "./DropdownCardMain";

export default {
  name: 'Description',
  props: {
    description: String
  },
  components: {
    appDropdownCard: DropdownCardMain
  },
  data() {
    return {}
  },
  created() {
  }
}

</script>

<template lang="pug">
app-dropdown-card(:isCollapsible="false")
  template(v-slot:dropdownCardHeader)
    .header-wrapper.flex__row.flex__ai-c.flex__jc-fs
      i.fas.fa-align-left
      p Description
  template(v-slot:dropdownCardBody)
    .body-wrapper.flex__col.flex__ai-fs.flex__jc-sa
      span(v-html="this.description" v-if="this.description")
      p.creator(v-else) No description found
</template>

<style scoped lang="scss">
.header-wrapper {
  color: black;
  font-size: 1.6rem;
  font-weight: 600;
  letter-spacing: 0.03rem;

  i {
    color: black
  }
}

.body-wrapper {
  font-size: 1.4rem;
  padding: 1.6rem 3.2rem;
  line-height: 2.1rem;
}

.creator {
  font-size: 1rem;
  color: rgb(138, 147, 155)
}
</style>