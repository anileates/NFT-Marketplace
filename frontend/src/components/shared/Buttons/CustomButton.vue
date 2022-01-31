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
button(:class="{disable: disableButton}")
  slot
  span(:class="{ iconExists: hasDefaultSlot }") {{ this.buttonText }}
</template>

<style scoped lang="scss">
button {
  height: 100%;
  width: 100%;

  background-color: rgb(32, 129, 226);
  color: white;

  border: none;
  border-radius: 0.5rem;

  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.06rem;

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

.iconExists {
  margin-left: 0.8rem;
}
</style>