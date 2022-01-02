<script>
import DropdownCardMain from "./DropdownCardMain";
export default {
  name: 'Description',
  components: {
    appDropdownCard: DropdownCardMain
  },
  data() {
    return {}
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
      p.creator Created by -
        a(href="/creator") NinjaSquadNFT_
      br
      p Ninja Squad is a collection of 8,888 randomly generated NFTs on the Ethereum Blockchain. With your Ninja comes a global crypto & NFT community, utility, education, games and friends from across the globe... Join the squad.
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