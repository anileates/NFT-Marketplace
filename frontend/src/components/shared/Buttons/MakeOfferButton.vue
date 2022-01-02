<script>
export default {
  name: 'MakeOfferButton',
  data(){
    return {}
  }
}
</script>

<template lang="pug">
button
  i.fas.fa-tag
  span Make offer
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

  i {
    color: white;
    margin-right: 0.8rem;
    margin-top: 0.2rem;
  }
}
</style>