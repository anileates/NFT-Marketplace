<template lang="pug">
.avatar-container(@mouseover="isHover = true", @mouseleave="isHover = false")
  .hover.flex-col.flex-ai-c.flex-jc-c(
    v-show="(isEditable && isHover) || !imgUrl",
    @click="triggerInput"
  )
    input(ref="inputImageUpload", type="file", @change="uploadImage")
    i.far.fa-edit(v-if="imgUrl")
    i.far.fa-edit(v-else)
    span
  img(:src="imgUrl", v-show="imgUrl")
</template>

<script>
export default {
  name: "Avatar",
  props: {
    isEditable: {
      type: Boolean,
      default: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isHover: false,
    };
  },
  methods: {
    triggerInput() {
      this.$refs.inputImageUpload.click();
      // document.getElementById('inputImageUpload').click()
    },
    uploadImage() {
      if (this.$refs.inputImageUpload.files.length > 0) {
        const file = this.$refs.inputImageUpload.files[0];
        this.$emit("uploaded", file);
      }
    },
    // There is a webpack issue. So, dynamic img url does not work without require() statement in the 'src'
    // getImgUrl(pic){
    //   return require('../../../assets/'+pic)
    // }
  },
};
</script>

<style lang="scss" scoped>
.avatar-container {
  width: 100%;
  height: 100%;

  border-radius: inherit;
}

input {
  display: none;
}

.hover {
  width: 100%;
  height: 100%;

  background-color: gray;
  opacity: 70%;
  cursor: pointer;
  overflow: hidden;
  border-radius: inherit;

  position: absolute;
  color: #ffffff;
  font-size: 1.3rem;
}

img {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-fit: cover;
}

p {
  font-size: 1rem;
}
</style>