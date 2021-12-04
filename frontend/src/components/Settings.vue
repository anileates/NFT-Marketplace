<template lang="pug">
.settings-page-container.flex-col.flex-ai-c.flex-jc-c
  .settings-page-body
    .page-header
      h2 Profile Setting
    .settings-page-content.flex-row.flex-ai-fs.flex-jc-sb
      .information-section.flex-col.flex-ai-fs.flex-jc-sa
        .info.flex-col.flex-ai-fs.flex-jc-sa
          label Username*
          input(id="username")
        .info.flex-col.flex-ai-fs.flex-jc-sa
          label Bio
          input(id="biography")
        .info.flex-col.flex-ai-fs.flex-jc-sa
          label Email address
          input(id="email")
        .info.flex-col.flex-ai-fs.flex-jc-sa
          label Wallet address
          input(id="wallet-input" type="text" readonly).readonly
        button() Save
      .image-section.flex-col.flex-ai-fs.flex-jc-sa
        .section.flex-col.flex-ai-fs.flex-jc-sa
          label Profile Image
          .image-box-profile(style="border-radius: 50%")

        .section.flex-col.flex-ai-fs.flex-jc-sa
          label Cover Image
          .image-box-cover(style="border-radius: 5%")
</template>

<script>
export default {
  name: "Settings",
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.settings-page {
  &-body {
    width: 48rem;
    height: 100%;
  }

  &-content {
    margin-top: 2rem;
  }
}

h2 {
  font-size: 2.5rem;
}

.image-section {
  height: 26rem;
  margin-right: 2rem;
}

label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.info {
  height: 4rem;
  margin-bottom: 1rem;

  input {
    height: 2.5rem;
    width: 26rem;
    border: 1px solid #C5C5C5;
    font-size: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    outline: none;

    &:focus {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
    }
  }
}

.section {
  margin-bottom: 0.5rem;
}

.image-box {
  background-color: red;
  position: relative;

  &-profile {
    @extend .image-box;
    height: 10rem;
    width: 10rem;
    border-radius: 50%;
  }

  &-cover {
    @extend .image-box;
    height: 8rem;
    width: 14rem;
    border-radius: 5%;
  }
}

// TODO input boxes will be a component. So, we will get rid of this foolish structure
#wallet-input:focus {
  box-shadow: none;
}

.readonly {
  background-color: #F0F0F0
}

button {
  width: 5rem;
  height: 3rem;
  cursor: pointer;
  background-color: #2081e2;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
  border: none;
  float: bottom;
  margin-top: 0.5rem;
}
</style>

