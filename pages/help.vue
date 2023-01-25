<template>
  <div class="p-6 bg-white shadow-lg">
    <div class="text_2xl font-medium">
      Do you have a questions or suggestions?
    </div>
    <br />
    <div class="font-medium">Please email us:</div>
    <a href="mailto: support@gmail.com">support@gmail.com</a> <br />
    <div class="font-medium">Call us:</div>

    <a href="tel: 1234567890">1234567890</a> <br />
    <div class="font-medium">Visit our website for more info:</div>

    <a href="https://shipio.app">shipio.app</a> <br />
  </div>
</template>
<script>
export default {
  name: "Help",
  created() {
    this.$store.commit("setHeader", "Help");
  },
};
</script>
