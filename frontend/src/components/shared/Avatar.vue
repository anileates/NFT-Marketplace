<template lang="pug">
.avatar-container(@mouseover="isHover = true", @mouseleave="isHover = false")
  .hover.flex__col.flex__ai-c.flex__jc-c(
    v-show="isEditable && ((!imgUrl && !_imgUrl) || isHover) ",
    @click="triggerInput"
  )
    input(ref="inputImageUpload", type="file", @change="onFileChange")
    i.far.fa-edit(v-if="imgUrl")
    i.far.fa-edit(v-else)
    span
  img(:src="imgUrl || _imgUrl", v-show="imgUrl || isUploaded")
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
      default: null,
    },
  },
  data() {
    return {
      isHover: false,
      isUploaded: false,
      _imgUrl: ""
    };
  },
  methods: {
    triggerInput() {
      this.$refs.inputImageUpload.click();
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      const file = files[0];
      this._imgUrl = URL.createObjectURL(files[0]);
      this.isUploaded = true;

      this.$emit("uploaded", file);
    },
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