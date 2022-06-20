<template lang="pug">
.create-collection-container.flex__col.flex__ai-c.flex__jc-c
  .cc-page
    h2 Create A Collection
    .cc-page-content.flex__col.flex__ai-fs.flex__jc-sb
      .section.flex__col.flex__ai-fs.flex__jc-sa
        label.section-header Logo Image
        label.hint This image will also be used for navigation.
        .image-box-logo
          app-avatar#logo(@uploaded="uploadLogo")

      .section.flex__col.flex__ai-fs.flex__jc-sa
        label.section-header Banner Image
        label.hint This image will appear at the top of your collection page.
        .image-box-banner
          app-avatar#banner(@uploaded="uploadBanner")

      .section.flex__col.flex__ai-fs.flex__jc-sa
        label.section-header Collection Name *
        label.hint
        appInputBox#collection-name(placeholder="Name Of Your Collection")

      .section.flex__col.flex__ai-fs.flex__jc-sa
        label.section-header Collection Symbol *
        label.hint Symbol can be used for navigation either on-chain or on our platform.
        appInputBox#symbol(placeholder="E.g. MyNFT")

      .section.flex__col.flex__ai-fs.flex__jc-sa
        label.section-header Description
        label.hint Allowed Max. 1000 characters
        appInputBox#description(value="", maxlength="1000")

      .section.flex__col.flex__ai-fs.flex__jc-sa
        label.section-header Creator Earnings
        label.hint Collect a fee when a user re-sells an item you originally created. (Percentage (%))
        appInputBox#creator-earning(value="", placeholder="e.g. 2.5")

      .btn-wrapper
        appCustomButton(buttonText="Create", @click="saveCollectionInfo")
</template>

<script>
import Avatar from "../components/shared/Avatar.vue";
import InputBox from "../components/shared/InputBox.vue";
import CustomButton from "../components/shared/Buttons/CustomButton.vue";
import { mapActions } from "vuex";
import { Toast } from "../SweetAlert";
import router from "../router/index";

export default {
  name: "CreateCollection",
  data() {
    return {
      collection: {},
    };
  },
  components: {
    appAvatar: Avatar,
    appInputBox: InputBox,
    appCustomButton: CustomButton,
  },
  methods: {
    ...mapActions(["createCollection"]),
    async saveCollectionInfo() {
      this.collection.name = document.getElementById("collection-name").value;
      this.collection.symbol = document.getElementById("symbol").value;
      this.collection.description = document.getElementById("description").value;
      this.collection.creatorEarning = parseInt(document.getElementById("creator-earning").value)
      
      const res = await this.createCollection(this.collection)
      if (res) {
        Toast.fire({
          icon: "success",
          title: "Your collection has been created!",
        });

        return await router.push("/")
      }
    },
    uploadLogo(file) {
      const moralisFile = new Moralis.File("logo.jpg", file);
      this.collection.logo = moralisFile
    },
    uploadBanner(file) {
      const moralisFile = new Moralis.File("banner.jpg", file);
      this.collection.banner = moralisFile
    },
  },
};
</script>

<style lang="scss" scoped>
.create-collection-container {
  width: 100%;
  font-size: 1.6rem;
  padding-bottom: 4.8rem;
}

.cc-page {
  width: 75rem;
  height: 100%;

  &-content {
    margin-top: 3.2rem;
  }
}

h2 {
  font-size: 4rem;
}

.section {
  margin-bottom: 3.2rem;
  width: 100%;

  &-header {
    font-weight: 600;
    margin-bottom: 0.3rem;
  }

  .hint {
    font-size: 1.3rem;
    margin-bottom: 0.3rem;
    color: rgb(112, 122, 131);
  }

  input {
    height: 4rem;
    width: 100%;
  }
}

.image-box {
  background-color: white;
  position: relative;

  &-logo {
    @extend .image-box;
    height: 20rem;
    width: 20rem;
    border-radius: 50%;
  }

  &-banner {
    @extend .image-box;
    height: 22rem;
    width: 75rem;
    border-radius: 10px;
  }
}

.btn-wrapper {
  width: 12.8rem;
  height: 4.8rem;
  margin-right: 1rem;
}
</style>