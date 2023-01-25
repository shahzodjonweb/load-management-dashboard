<template>
  <v-app>
    <v-main>
      <Nuxt />
    </v-main>
    <VuetifyToast ref="toast" />
  </v-app>
</template>
<script>
import { getAccessToken } from "~/core/utils";

export default {
  created() {
    console.log("mounted");
    const token = getAccessToken();
    if (token) {
      console.log("actual", token);
      this.$router.push("/");
    }
  },
};
</script>
