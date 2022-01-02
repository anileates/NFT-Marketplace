<script>
export default {
  name: 'DropdownCard',
  data() {
    return {}
  }
}
</script>

<template lang="pug">
.dropdown-card
  .header.flex-row.flex-ai-c.flex-jc-fs
    slot(name="dropdownCardHeader")
  .body
    slot(name="dropdownCardBody")
</template>

<style lang="scss">
.dropdown-card {
  width: 100%;
  height: 100%;

  border-radius: 1rem;
  border: 1px solid rgb(229, 232, 235);

  .header {
    width: 100%;
    height: 28%;
    padding: 0 1rem;

    border-bottom: 1px solid rgb(229, 232, 235);
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;

    i{
      margin-right: 0.3rem;
    }
  }

  .body {
    width: 100%;
    height: 72%;
    padding: 0.3rem 0;

    background-color: rgb(251, 253, 255);

    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
  }
}

</style>