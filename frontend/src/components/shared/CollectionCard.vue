<template lang="pug">
a(:href="getCollectionRedirectUrl")
  .card-container
    .banner-section
      img(:src="bannerUri")
    .logo-section
      .logo
        img(:src="logoUri")
    .info-section.flex__col.flex__jc-fs
      .title-line.flex__row.flex__jc-sb.flex__ai-c
        h1
          a(:href="getCollectionRedirectUrl") {{ collectionName }}
</template>

<script>
export default {
  name: "CollectionCard",
  props: {
    contractAddress: {
      type: String,
      required: true,
    },
    collectionName: {
      type: String,
      required: true,
    },
    bannerUri: {
      type: String,
      required: true,
    },
    logoUri: {
      type: String,
      required: true,
    },
  },
  computed: {
    getCollectionRedirectUrl() {
      return `/collections/${this.contractAddress}`;
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.card-container {
  height: 100%;
  font-size: 1.6rem;

  border-radius: 10px;
  border: 1px solid rgb(229, 232, 235);

  cursor: pointer;
  transition: 0.2s;
  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  }
}

.banner-section {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  img {
    width: 100%;
    // min-height: 18rem;
    height: 20rem;
    object-fit: cover;

    border-radius: inherit;
  }
}

.logo-section {
  padding-left: 2rem;
}

.logo {
  position: absolute;
  margin-top: -13rem;
  border-radius: 5%;
  padding: 0.6rem;
  height: 17.6rem;
  width: 17.6rem;

  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.25);

  img {
    width: 100%;
    height: 100%;
    border-radius: inherit;
    object-fit: cover;
  }
}

.info-section {
  padding: 1rem 2rem;
  margin-top: 6rem;

  .title-line {
    width: 100%;

    font-weight: 500;
    line-height: 1.6rem;

    a {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      text-decoration: none;
      color: #000;

      &:visited {
        color: #000;
      }
    }
  }

  .value-line {
    font-size: 1.2rem;
    font-weight: 600;
    // line-height: 2rem;

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