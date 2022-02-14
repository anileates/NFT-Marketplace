<script>
export default {
  name: "CustomButton",
  props: {
    buttonText: {
      type: String,
      required: true,
      default: "",
    },
    disableButton: {
      type: Boolean,
      required: true,
      default: false
    },
  },
  data() {
    return {};
  },
  computed: {
    hasDefaultSlot() {
      return !!this.$slots.default;
    }
  },
};
</script>

<template lang="pug">
button(:class="{ disable: disableButton }" @click="$emit('buttonClicked')")
  slot
  span(:class="{ iconMargin: hasDefaultSlot }") {{ this.buttonText }}
</template>

<style scoped lang="scss">
button {
  height: 100%;
  width: 100%;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.06rem;

  background-color: rgb(32, 129, 226);
  color: white;
  border: none;
  border-radius: 0.5rem;

  transition: box-shadow .4s;

  &:hover {
    cursor: pointer;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  }
}

.disable {
    background-color: rgb(177, 197, 218);

  &:hover {
    cursor: default;
    box-shadow: none;
  }
}

.iconMargin {
  margin-left: 0.8rem;
}
</style>