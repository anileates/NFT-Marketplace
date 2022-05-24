<template lang="pug">
.create-collection-container.flex__col.flex__ai-c.flex__jc-c
  .cc-page
    h2 Create A Collection
    .cc-page-content.flex__col.flex__ai-fs.flex__jc-sb
      .section.flex__col.flex__ai-fs.flex__jc-sa
        label.section-header Logo Image
        label.hint This image will also be used for navigation
        .image-box-logo
          app-avatar(:imgUrl="sadfasdf", @uploaded="changeAvatar")

      .section.flex__col.flex__ai-fs.flex__jc-sa
        label.section-header Banner Image
        label.hint This image will appear at the top of your collection page.
        .image-box-banner
          app-avatar(:imgUrl="sadfasdf", @uploaded="changeAvatar")

      .section.flex__col.flex__ai-fs.flex__jc-sa
        label.section-header Collection Name *
        label.hint
        appInputBox(placeholder="Name Of Your Collection")

      .section.flex__col.flex__ai-fs.flex__jc-sa
        label.section-header Description
        label.hint Allowed Max. 1000 characters
        appInputBox(value="" maxlength="1000")

      .section.flex__col.flex__ai-fs.flex__jc-sa
        label.section-header Creator Earnings
        label.hint Collect a fee when a user re-sells an item you originally created. (Percentage (%))
        appInputBox#username(value="" placeholder="e.g. 2.5")

      .btn-wrapper
        appCustomButton(buttonText="Create", @click="cancelSale")
</template>

<script>
import Avatar from "../components/shared/Avatar.vue";
import InputBox from "../components/shared/InputBox.vue";
import CustomButton from "../components/shared/Buttons/CustomButton.vue";

export default {
  name: "CreateCollection",
  data() {
    return {};
  },
  components: {
    appAvatar: Avatar,
    appInputBox: InputBox,
    appCustomButton: CustomButton,
  },
};
</script>

<style lang="scss" scoped>
.create-collection-container {
  width: 100%;
  padding-bottom: 3rem;
}

.cc-page {
  width: 48rem;
  height: 100%;

  &-content {
    margin-top: 2rem;
  }
}

h2 {
  font-size: 2.5rem;
}

.section {
  margin-bottom: 2rem;
  width: 100%;

  &-header {
    font-weight: 600;
    margin-bottom: 0.2rem;
  }

  .hint {
    font-size: 0.8rem;
    margin-bottom: 0.2rem;
    color: rgb(112, 122, 131);
  }

  input {
    height: 2.5rem;
    width: 100%;
  }
}

.image-box {
  background-color: white;
  position: relative;

  &-logo {
    @extend .image-box;
    height: 12rem;
    width: 12rem;
    border-radius: 50%;
  }

  &-banner {
    @extend .image-box;
    height: 14rem;
    width: 40rem;
    border-radius: 10px;
  }
}

.btn-wrapper {
  width: 8rem;
  height: 3rem;
  margin-right: 0.5rem;
}

</style>