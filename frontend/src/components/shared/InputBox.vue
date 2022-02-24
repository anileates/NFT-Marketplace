<template lang="pug">
input(:class="{ readOnly: isReadOnly }" :value="value" :readonly="isReadOnly")
</template>

<script>
export default {
  name: 'InputBox',
  props: {
    isReadOnly: {
      type: Boolean,
      default: false
    },
    value: String
  },
  data(){
    return {}
  }
}
</script>

<style lang="scss" scoped>
input {
  height: 100%;
  width: 100%;
  border: 1px solid #C5C5C5;
  font-size: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  outline: none;
  transition: box-shadow .4s;

  &:focus {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  }
}

.readOnly {
  background-color: #F0F0F0;

  &:focus {
    box-shadow: none;
  }
}

</style>