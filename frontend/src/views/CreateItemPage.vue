<template lang="pug">
.create-item-page-container.flex__col.flex__ai-c.flex__jc-c
  .create-item-page-body
    .page-header
      h2 Create Your Own Asset
    .create-item-page-content.flex__row.flex__ai-fs.flex__jc-sb
      .information-section.flex__col.flex__ai-fs.flex__jc-sa
        .info.flex__col.flex__ai-fs.flex__jc-sa
          label Asset Name*
          appInputBox#assetName(placeholder="Asset Name")
        .info.flex__col.flex__ai-fs.flex__jc-sa
          label Asset Description*
          appInputBox#assetDescription(placeholder="Asset Description")

        .info.flex__col.flex__ai-fs.flex__jc-sa
          label Collection*
          select(id="collection" name="collection")
            option(disabled selected) Please choose an collection
            option(value="") New Collection
            option(v-for="collection in getCollecionsOfUser" :value="collection") {{ collection }} 

          label.hint 
            span Choose which collection this item will be belong.
            br
            span Choose "New Collection" to create without a collection.
        button(@click="createNFT") Create Asset

      .image-section.flex__col.flex__ai-c.flex__jc-fs
        .section.flex__col.flex__ai-fs.flex__jc-sa
          label Upload Your Asset 👇
          .image-box-asset
            app-avatar(@uploaded="uploadFile", :imgUrl="asset.fileUrl")
</template>

<script>
import InputBox from "../components/shared/InputBox.vue";
import Avatar from "../components/shared/Avatar.vue";
import { mapActions, mapGetters } from "vuex";
import { Toast } from "../SweetAlert";
import router from "../router/index";

export default {
  name: "CreateItemPage",
  components: {
    appInputBox: InputBox,
    appAvatar: Avatar,
  },
  data() {
    return {
      asset: {
        name: undefined,
        description: undefined,
        fileUrl: undefined,
      },
      file: undefined,
    };
  },
  methods: {
    ...mapActions({ mintToken: "mintToken" }),
    uploadFile(file) {
      // Set the file as a data. So other methods can access file
      this.file = file;
    },
    /**
     * This method gets the NFT information from inputs
     * Then, calls the mintToken action
     */
    async createNFT() {
      // Get the infos
      this.asset.name = document.getElementById("assetName").value;
      this.asset.description =
        document.getElementById("assetDescription").value;

      this.asset.collectionAddress = document.getElementById('collection').value
      console.log(this.asset.collectionAddress)

      if (!this.asset.name || !this.asset.description || !this.file) {
        return Toast.fire({
          icon: "error",
          title: "Please fill the given places to create an asset.",
        });
      }

      // Then call the action
      const result = await this.mintToken({
        file: this.file,
        name: this.asset.name,
        description: this.asset.description,
        collectionAddress: this.asset.collectionAddress 
      });

      if (result) {
        Toast.fire({
          icon: "success",
          title: "Congratz! You minted a stunning NFT 🎉",
        });

        return await router.push("/");
      }
    },
  },
  computed: {
    ...mapGetters(["getCollecionsOfUser"]),
  },
};
</script>

<style lang="scss" scoped>
.create-item-page {
  &-body {
    width: 60rem;
    height: 100%;
  }

  &-content {
    margin-top: 2rem;
  }
}

h2 {
  font-size: 2.5rem;
}

label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.hint {
  font-size: 0.8rem;
  margin-top: 0.2rem;

  color: rgb(112, 122, 131);
}

.info {
  // height: 4rem;
  margin-bottom: 1rem;

  input {
    height: 2.5rem;
    width: 26rem;
  }
}

.section {
  margin-bottom: 0.5rem;
}

.image-section {
  // background-color: gray;
  height: 26rem;
  width: 30rem;
  margin-right: 2rem;
}

.image-box {
  background-color: #d5d5d5;
  position: relative;

  &-asset {
    @extend .image-box;
    height: 20rem;
    width: 20rem;
    border-radius: 5%;
  }
}

select {
  width: 26rem;
  border: 1px solid #c5c5c5;
  border-radius: 0.5rem;

  font-size: 1rem;
  padding: 0.5rem;
  outline: none;
}

button {
  width: 8rem;
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