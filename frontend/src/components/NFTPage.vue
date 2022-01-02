<template lang="pug">
.nft-page-container.flex-col.flex-ai-c.flex-jc-c
  .sell-cancel-bar
  .center-box.flex-row.flex-jc-sb
    .left-box.flex-col.flex-ai-c.flex-jc-sb
      .image-wrapper
      .detailed-information-section
        app-description-card

    .right-box
      .info-preview.flex-col.flex-ai-sb.flex-jc-sa
        .first-line.flex-row.flex-ai-c.flex-jc-sb
          a(href="/collection-21321") Collection Name Here
          .actions
            button
              i.fas.fa-redo-alt.fa-lg
            button
              i.fas.fa-share-alt.fa-lg
        h1 Ninja #4515
        .third-line
          span Owned by
          a(href="/profile-link-of-owner") X
      .sale-information
        app-sale-card
</template>

<script>
import SaleCard from "./shared/DropdownCards/SaleCard";
import DropdownCardMain from "./shared/DropdownCards/DropdownCardMain";
import DescriptionCard from "./shared/DropdownCards/DescriptionCard";

export default {
  name: 'NFTPage',
  components: {
    appSaleCard: SaleCard,
    appDropdownCardMain:DropdownCardMain,
    appDescriptionCard: DescriptionCard
  },
  data() {
    return {}
  }
}
</script>

<style scoped lang="scss">
.nft-page-container {
  width: 100%;
  padding-bottom: 3rem;
}

.sell-cancel-bar {
  width: 100%;
  height: 4.5rem;

  background-color: aliceblue;
}

.center-box {
  width: 82%;
  height: 100%;
  padding-top: 2rem;

  .left-box {
    //background-color: green;
    width: 42%;
    height: 100%;

    .image-wrapper {
      background-color: orange;
      width: 100%;
      height: 34.5rem;
    }

    .detailed-information-section {
      width: 100%;
      height: 30.3125rem;

      //background-color: green;
      //margin-top: 15rem;

    }
  }

  .right-box {
    width: 58%;
    height: 100%;

    padding-left: 1rem;

    .info-preview {
      width: 100%;
      height: 10rem;
      padding: 0 0 1rem 0;

      h1 {
        font-size: 1.875rem;
        color: rgb(53, 56, 64);
      }

      .third-line {
        font-size: 0.90625rem;
        color: rgb(112, 122, 131);
        line-height: 1.5;
        margin-top: 1rem;
      }
    }

    .sale-information {
      width: 100%;
      height: 15rem;
    }
  }
}

a {
  text-decoration: none;
  color: rgb(24, 104, 183);

  &:visited {
    color: rgb(24, 104, 183);
  }
}

.actions {
  button {
    background-color: transparent;

    border: solid rgb(229, 232, 235);
    border-width: 2px 2px 2px 0;

    cursor: pointer;
    &:hover {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    }

    &:first-child {
      border-left: 2px solid rgb(229, 232, 235);
      border-top-left-radius: 0.5rem;
      border-bottom-left-radius: 0.5rem;
    }

    &:last-child {
      border-top-right-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
    }

    i {
      margin: 1rem;
    }
  }
}

</style>