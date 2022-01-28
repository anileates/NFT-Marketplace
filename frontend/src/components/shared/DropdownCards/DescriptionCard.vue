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
    console.log(this.description)
  }
}

// TODO add max-height for descripiton card and overflow auto
</script>

<template lang="pug">
app-dropdown-card(:isCollapsible="false")
  template(v-slot:dropdownCardHeader)
    .header-wrapper.flex-row.flex-ai-c.flex-jc-fs
      i.fas.fa-align-left
      p Description
  template(v-slot:dropdownCardBody)
    .body-wrapper.flex-col.flex-ai-fs.flex-jc-sa
      span(v-html="this.description" v-if="this.description")
      p.creator(v-else) No description found
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
}

.creator {
  font-size: 1rem;
  color: rgb(138, 147, 155)
}
</style>