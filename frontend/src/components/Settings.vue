<template lang="pug">
.settings-page-container.flex-col.flex-ai-c.flex-jc-c
  .settings-page-body
    .page-header
      h2 Profile Setting
    .settings-page-content.flex-row.flex-ai-fs.flex-jc-sb
      .information-section.flex-col.flex-ai-fs.flex-jc-sa
        .info.flex-col.flex-ai-fs.flex-jc-sa
          label Username*
          appInputBox#username(:value="getCurrentUser.username")
        .info.flex-col.flex-ai-fs.flex-jc-sa
          label Bio
          appInputBox#biography(:value="getCurrentUser.biography")
        .info.flex-col.flex-ai-fs.flex-jc-sa
          label Email address
          appInputBox#email(:value="getCurrentUser.email")
        .info.flex-col.flex-ai-fs.flex-jc-sa
          label Wallet address
          .flex-row.flex-ai-c
            appInputBox#wallet-input(
              type="text",
              :value="getCurrentUser.ethAddress",
              :isReadOnly="true"
            )
            i.far.fa-clipboard.fa-1x(
              style="position: absolute; margin-left: 24.5rem; cursor: pointer",
              @click="copyWalletAdress"
            )
        button(@click="saveUserInfo") Save
      .image-section.flex-col.flex-ai-fs.flex-jc-sa
        .section.flex-col.flex-ai-fs.flex-jc-sa
          label Profile Image
          .image-box-profile(style="border-radius: 50%")
            app-avatar(
              :imgUrl="getCurrentUser.avatar && getCurrentUser.avatar._url",
              @uploaded="changeAvatar"
            )

        .section.flex-col.flex-ai-fs.flex-jc-sa
          label Cover Image
          .image-box-cover(style="border-radius: 5%")
            app-avatar(
              :imgUrl="getCurrentUser.cover && getCurrentUser.cover._url",
              @uploaded="changeCover"
            )
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Avatar from "./shared/Avatar";
import InputBox from "./shared/InputBox";

export default {
  name: "Settings",
  components: {
    appAvatar: Avatar,
    appInputBox: InputBox,
  },
  data() {
    return {
      updatedUser: {},
    };
  },
  computed: {
    ...mapGetters(["getCurrentUser"]),
  },
  methods: {
    ...mapActions(["updateUser"]),
    async saveUserInfo() {
      this.updatedUser.username = document.getElementById("username").value;
      this.updatedUser.biography = document.getElementById("biography").value;
      this.updatedUser.email = document.getElementById("email").value;
      this.updatedUser.ethAddress =
        document.getElementById("wallet-input").value;

      await this.updateUser(this.updatedUser);
      alert("Informations has been changed"); // TODO will be changed with SweetAlert
    },
    changeAvatar(file) {
      const moralisFile = new Moralis.File("avatar.jpg", file);
      this.updateUser({ avatar: moralisFile });
    },
    changeCover(file) {
      const moralisFile = new Moralis.File("cover.jpg", file);
      this.updateUser({ cover: moralisFile });
    },
    copyWalletAdress() {
      let copyText = document.getElementById("wallet-input");
      copyText.select();
      navigator.clipboard.writeText(copyText.value);
    },
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
  }
}

.section {
  margin-bottom: 0.5rem;
}

.image-box {
  background-color: #d5d5d5;
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

