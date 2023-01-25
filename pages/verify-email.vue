<template>
  <div
    class="h-screen w-[290px] mx-auto flex flex-col justify-center items-center space-y-7"
  >
    <div class="rounded-full shadow-lg p-3">
      <MainLogo class="w-[100px] h-[100px]" />
    </div>
    <div>
      <div v-if="loading" class="flex justify-center">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
      <div v-else>
        <div class="py-4 font-bold text-center">
          Your account now verified! You can login now and start using EZSHIP .
        </div>
        <v-btn color="success" class="w-full mt-5" to="/login"> Login </v-btn>
      </div>
    </div>
  </div>
</template>
<script>
import { emailVerify } from "~/api/auth.js";
export default {
  name: "VerifyEmail",
  layout: "secondaryauth",
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async emailVerify(url) {
      try {
        this.loading = true;
        const resp = await emailVerify(url);
        this.$notifier.showMessage({ content: resp.message, color: "success" });
        this.loading = false;
      } catch (error) {
        this.$notifier.showMessage({ content: error, color: "error" });
        this.loading = false;
      }
    },
  },
  mounted() {
    this.emailVerify(this.$route.query.url);
  },
};
</script>
