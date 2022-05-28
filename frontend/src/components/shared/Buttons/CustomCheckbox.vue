<template lang="pug">
.round
  input#checkbox(type="checkbox", :checked="checked")
  label
</template>

<script>
export default {
  name: "CustomCheckbox",
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.round {
  position: relative;

  width: 100%;
  height: 100%;
}

.round label {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;

  position: absolute;
  left: 0;
  top: 0;

  height: 100%;
  width: 100%;

  cursor: pointer;
  transition: 0.3s;
}

.round label:after {
  border: 2px solid #fff;
  border-top: none;
  border-right: none;

  opacity: 0;
  content: "";

  position: absolute;
  transform: rotate(-45deg);
  top: 32%;
  left: 26%;

  height: 20%;
  width: 42%;
}

.round input[type="checkbox"] {
  visibility: hidden;
}

.round input[type="checkbox"]:checked + label {
  background-color: #66bb6a;
  border-color: #66bb6a;
}

.round input[type="checkbox"]:checked + label:after {
  opacity: 1;
}
</style>