<script>
import DropdownCardMain from "./DropdownCardMain";

export default {
  name: "DetailsCard",
  props: {
    nft: {},
  },
  components: {
    appDropdownCard: DropdownCardMain,
  },
  data() {
    return {
      active: false,
    };
  },
  computed: {
    getContractEtherScanAddress() {
      return "https://etherscan.io/address/" + this.nft.token_address;
    },
  },
};
</script>

<template lang="pug">
app-dropdown-card(:isCollapsible="true", :collapseByDefault="true")
  template(v-slot:dropdownCardHeader)
    .header-wrapper.flex__row.flex__ai-c.flex__jc-fs
      i.fas.fa-info-circle
      p Details
  template(v-slot:dropdownCardBody)
    .body-wrapper.flex__col.flex__ai-fs
      .token-info-line
        p.title Contract Address
        a.value(:href="getContractEtherScanAddress") {{ $filters.minimizeEthAddress(this.nft.token_address || this.nft.contractAddress) }}
      .token-info-line
        p.title Token ID
        p.value {{ this.nft.token_id }}
      .token-info-line
        p.title Token Standart
        p.value {{ this.nft.contract_type }}
      .token-info-line
        p.title Blockchain
        p.value ETH
</template>

<style scoped lang="scss">
a,
a:link,
a:visited {
  color: #2081e2;
  text-decoration: none;

  &:visited {
    color: #2081e2;
  }
}

.header-wrapper {
  color: black;
  font-size: 1.6rem;
  font-weight: 600;
  letter-spacing: 0.03rem;

  i {
    color: black;
  }
}

.body-wrapper {
  font-size: 1.4rem;
  padding: 1.6rem 3.2rem;
  line-height: 2.1rem;
}

.creator {
  font-size: 1.6rem;
  color: rgb(138, 147, 155);
}

.token-info-line {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  width: 100%;
  margin-top: 1rem;

  .title {
    font-size: 1.5rem;
    color: rgb(53, 56, 64);
    line-height: 2.25rem;
  }

  .value {
    font-size: 1.5rem;
    line-height: 2.1rem;
    font-weight: 500;
    color: rgb(112, 122, 131);
  }
}
</style>