<template lang="pug">
.homepage-container
  | this is homepage
  button(@click="getNFT") Get NFT
  button Get User

  br
  br
  br

  app-custom-button(@buttonClicked="btn1Clicked" buttonText="bsatn" disableButton=false)
  app-custom-button(@buttonClicked="btn2Clicked" buttonText="btnasd2" disableButton=false)
</template>

<script>
import CustomButton from "../components/shared/Buttons/CustomButton";

export default {
  name: "Homepage",
  components: {
    appCustomButton: CustomButton
  },
  data() {
    return {};
  },
  methods: {
    async getNFT() {
      // const userEthNFTs = await Moralis.Web3API.account.getNFTs({ address: '0x72d0455d25db9c36af5869bbf426312ba923c643' });
      // const options = { address: "0x8c186802b1992f7650ac865d4ca94d55ff3c0d17", chain: "eth" };

      // const nftOwners = await Moralis.Web3API.token.getNFTOwners(options);

      const options = { q: "Ninja #4515", chain: "eth", filter: "name" };
      const NFTs = await Moralis.Web3API.token.searchNFTs(options);

      //
      const options2 = {
        address: "0x97e41d5ce9c8cb1f83947ef82a86e345aed673f3",
        token_id: "2518",
        chain: "eth",
      };
      const tokenIdMetadata = await Moralis.Web3API.token.getTokenIdMetadata(
        options2
      );

      console.log(NFTs);
      console.log(tokenIdMetadata);
    },
    btn1Clicked(){
      console.log('btn1')
    },
    btn2Clicked(){
      console.log('btn2')
    }
  },
};
</script>