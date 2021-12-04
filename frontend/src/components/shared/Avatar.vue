<template lang="pug">
.avatar-container(@mouseover="isHover=true" @mouseleave="isHover=false")
  .hover.flex-col.flex-ai-c.flex-jc-c(v-show="isEditable && isHover" @click="triggerInput")
    input(ref="inputImageUpload" type="file" @change="uploadImage" @click="this.click")
  img(:src='imgUrl')
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    isEditable: {
      type: Boolean,
      default: true
    },
    imgUrl: {
      type: String,
      required: true,
      default: 'default_profile.jpg'
    }
  },
  data() {
    return {
      isHover: false
    }
  },
  methods: {
    triggerInput() {
      this.$refs.inputImageUpload.click()
      // document.getElementById('inputImageUpload').click()
    },
    uploadImage() {
      if(this.$refs.inputImageUpload.files.length > 0){
        const file = this.$refs.inputImageUpload.files[0]
        this.$emit('uploaded', file)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-container {
  width: 100%;
  height: 100%;

  border-radius: inherit
}

input {
  display: none;
}

.hover{
  width: 100%;
  height: 100%;

  background-color: gray;
  opacity: 70%;
  cursor: pointer;
  overflow: hidden;
  border-radius: inherit;

  position: absolute;
}

img {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-fit: cover
}
</style>