<template>
  <v-snackbar
    v-model="show"
    :color="color"
    :timeout="timeout"
    height="16"
    top
    right
  >
    <v-icon v-if="getIcon" left>{{ getIcon }}</v-icon>
    {{ message }}
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      message: "",
      color: "",
      timeout: 2000,
    };
  },
  computed: {
    getIcon() {
      const myObject = {
        success: "mdi-check",
        error: "mdi-alert",
        warning: "mdi-alert",
        info: "mdi-information",
      };
      return myObject[this.color];
    },
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "snackbar/showMessage") {
        this.message = state.snackbar.content;
        this.color = state.snackbar.color;
        this.show = true;
      }
    });
  },
};
</script>
