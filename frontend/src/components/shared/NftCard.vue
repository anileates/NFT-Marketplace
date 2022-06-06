<template lang="pug">
a(:href="getCollectionRedirectUrl")
  .card-container
    .image-section
      img(:src="imgUrl")
    .info-section.flex__col.flex__jc-fs
      .title-line.flex__row.flex__jc-sb.flex__ai-c
        a(:href="getCollectionRedirectUrl") {{ collectionName }}
        .wrapper
          a Price
      .value-line.flex__row.flex__jc-sb.flex__ai-c
        a(:href="getTokenRedirectUrl") {{ name }}
        .price-label.flex__row.flex__jc-sb.flex__ai-c
          img(
            src="../../../ethereum.svg"
          )
          p(v-if="price") {{ price }}
          p(v-else) --
</template>

<script>
export default {
  name: "NftCard",
  props: {
    contractAddress: {
      type: String,
      required: true,
    },
    tokenId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    collectionName: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: false,
    },
  },
  computed: {
    getCollectionRedirectUrl() {
      return `/collections/${this.contractAddress}`;
    },
    getTokenRedirectUrl() {
      return `/tokens/${this.contractAddress}/${this.tokenId}`;
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.card-container {
  font-size: 1.6rem;
  padding-bottom: 3em;

  border-radius: 10px;
  border: 1px solid rgb(229, 232, 235);

  cursor: pointer;
  transition: 0.2s;
  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  }
}

.image-section {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  img {
    width: 100%;
    min-height: 20rem;
    object-fit: contain;

    border-radius: inherit;
  }
}

.info-section {
  margin: 0 0.625em;

  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;

  .title-line {
    width: 100%;

    font-size: 1.2rem;

    font-weight: 500;
    color: rgb(112, 122, 131) !important;
    line-height: 1.6rem;

    a {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      text-decoration: none;
      color: rgb(112, 122, 131);

      &:visited {
        color: rgb(112, 122, 131);
      }
    }
  }

  .value-line {
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 2rem;

    width: 100%;

    color: rgb(53, 56, 64);

    a {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      text-decoration: none;
      color: rgb(53, 56, 64);

      &:visited {
        color: rgb(53, 56, 64);
      }
    }
  }
}

.price-label {
  img {
    width: 1.5rem;
  }

  p {
    margin-left: 0.6em;
    font-size: 1.6rem;
  }
}

a {
  text-decoration: none;
}
</style>