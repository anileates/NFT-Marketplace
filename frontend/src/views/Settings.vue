
<script>
import { mapActions, mapGetters } from "vuex";
import Avatar from "../components/shared/Avatar";
import InputBox from "../components/shared/InputBox";
import { Toast } from "../SweetAlert";

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
    ...mapGetters({ user: 'getCurrentUser' })
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
      Toast.fire({
        icon: "success",
        title: "Informations was changed successfully",
      });
    },
    changeAvatar(file) {
      const moralisFile = new Moralis.File("avatar.jpg", file);
      this.updateUser({ avatar: moralisFile });
    },
    changeCover(file) {
      const moralisFile = new Moralis.File("cover.jpg", file);
      this.updateUser({ cover: moralisFile });
    },
    copyWalletAddress() {
      let copyText = document.getElementById("wallet-input");
      navigator.clipboard.writeText(copyText.value);

      Toast.fire({
        icon: "success",
        title: "Wallet adress copied to clipboard",
      });
    },
  },
};
</script>

<template lang="pug">
.settings-page-container.flex__col.flex__ai-c.flex__jc-c
  .settings-page-body
    .page-header
      h2 Profile Setting
    .settings-page-content.flex__row.flex__ai-fs.flex__jc-sb
      .information-section.flex__col.flex__ai-fs.flex__jc-sa
        .info.flex__col.flex__ai-fs.flex__jc-sa
          label Username*
          appInputBox#username(:value="user.username")
        .info.flex__col.flex__ai-fs.flex__jc-sa
          label Bio
          appInputBox#biography(:value="user.biography")
        .info.flex__col.flex__ai-fs.flex__jc-sa
          label Email address
          appInputBox#email(:value="user.email")
        .info.flex__col.flex__ai-fs.flex__jc-sa
          label Wallet address
          .flex__row.flex__ai-c
            appInputBox#wallet-input(
              type="text",
              :value="user.ethAddress",
              :isReadOnly="true"
            )
            i.far.fa-clipboard.fa-1x(
              style="position: absolute; margin-left: 42.5rem; cursor: pointer",
              @click="copyWalletAddress"
            )
        button(@click="saveUserInfo") Save
      .image-section.flex__col.flex__ai-fs.flex__jc-sa
        .section.flex__col.flex__ai-fs.flex__jc-sa
          label Profile Image
          .image-box-profile(style="border-radius: 50%")
            app-avatar(
              :imgUrl="user.avatar && user.avatar._url",
              @uploaded="changeAvatar"
            )

        .section.flex__col.flex__ai-fs.flex__jc-sa
          label Cover Image
          .image-box-cover(style="border-radius: 5%")
            app-avatar(
              :imgUrl="user.cover && user.cover._url",
              @uploaded="changeCover"
            )
</template>

<style lang="scss" scoped>
.settings-page {
  &-body {
    // background-color: red;
    width: 80rem;
    height: 100%;
  }

  &-content {
    margin-top: 2rem;
  }
}

h2 {
  font-size: 4rem;
}

.image-section {
  height: 42rem;
  margin-right: 3.2rem;
}

label {
  font-weight: 600;
  // margin-bottom: 1rem;
}

.info {
  // height: 4.8rem;
  margin-bottom: 1.6rem;

  font-size: 1.6rem;

  input {
    height: 4rem;
    width: 45rem;
  }
}

.section {
  font-size: 1.6rem;
  margin-bottom: 1.6rem;
}

.image-box {
  background-color: #d5d5d5;
  position: relative;

  &-profile {
    @extend .image-box;
    height: 16rem;
    width: 16rem;
    border-radius: 50%;
  }

  &-cover {
    @extend .image-box;
    height: 12.8rem;
    width: 22.4rem;
    border-radius: 5%;
  }
}

button {
  width: 8rem;
  height: 4.8rem;
  cursor: pointer;
  background-color: #2081e2;
  color: #fff;
  font-size: 1.6rem;
  font-weight: 600;
  border-radius: 10px;
  border: none;
  float: bottom;
  margin-top: 1rem;
}
</style>

