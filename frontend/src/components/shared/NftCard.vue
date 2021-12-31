<template lang="pug">
a(href="/collection-item-1234")
  .card-container
      .image-section
      .info-section.flex-col.flex-jc-fs
        .title-line.flex-row.flex-jc-sb.flex-ai-c
          a(href="/collection-3123") Ninja Squad Official
          .wrapper
            a Price
        .value-line.flex-row.flex-jc-sb.flex-ai-c
          a(href="/collection-item-1234") Ninja #4515
          .price-label.flex-row.flex-jc-sb.flex-ai-c
            img(src="https://storage.opensea.io/files/6f8e2979d428180222796ff4a33ab929.svg")
            p 0.44

</template>

<script>
export default {
  name: 'NftCard',
  data() {
    return {}
  }
}
</script>

<style scoped lang="scss">
.card-container {
  height: 100%;
  width: 100%;
  border-radius: 1rem;

  border: 1px solid rgb(229, 232, 235);

  cursor: pointer;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  }
}

.image-section {
  height: 73%;
  width: 100%;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;

  background-color: orange;
}

.info-section {
  height: 27%;
  padding-top: 1rem;
  //border: 2px solid rgb(229, 232, 235);

  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;

  .title-line {
    width: 100%;
    padding: 0 1rem;

    font-size: 0.8rem;
    font-weight: 500;
    color: rgb(112, 122, 131) !important;
    line-height: 1rem;

    a {
      text-decoration: none;
      color: rgb(112, 122, 131);

      &:visited {
        color: rgb(112, 122, 131);
      }
    }
  }

  .value-line {
    width: 100%;
    padding: 0 1rem;

    color: rgb(53, 56, 64);
    font-weight: 600;
    font-size: 0.8rem;
    letter-spacing: 0.2px;
    line-height: 1.3rem;

    a {
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
    width: 0.6rem;
  }

  p {
    margin-left: 0.35rem;
  }
}

a {
  text-decoration: none;
}
</style>