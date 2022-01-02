<script>
import DropdownCardMain from "./DropdownCardMain";
export default {
  name: 'DetailsCard',
  components: {
    appDropdownCard: DropdownCardMain
  },
  data() {
    return {}
  }
}

// TODO in the html template contract address will be formatted and redirect to etherscan for contract adress. Like 0x8c18....0d17
// TODO make contract address and token id copiable
</script>

<template lang="pug">
app-dropdown-card(:isCollapsible="true")
  template(v-slot:dropdownCardHeader)
    .header-wrapper.flex-row.flex-ai-c.flex-jc-fs
      i.fas.fa-info-circle
      p Details
  template(v-slot:dropdownCardBody)
    .body-wrapper.flex-col.flex-ai-fs
      .token-info-line
        p.title Contract Address
        p.value 0x120983
      .token-info-line
        p.title Token ID
        p.value 4515
      .token-info-line
        p.title Token Standart
        p.value ERC-721
      .token-info-line
        p.title Blockchain
        p.value Ethereum
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

.token-info-line {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  width: 100%;
  margin-top: 0.5rem;

  .title {
    font-size: 0.9375rem;
    color: rgb(53, 56, 64);
    line-height: 1.40625rem;
  }

  .value {
    font-size: 0.9375rem;
    line-height: 1.3125rem;
    font-weight: 500;
    color: rgb(112, 122, 131)
  }
}
</style>