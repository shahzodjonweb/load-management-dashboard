<template>
  <div
    class="h-screen w-[290px] mx-auto flex flex-col justify-center items-center space-y-7"
  >
    <div class="rounded-full shadow-lg p-3">
      <MainLogo class="w-[100px] h-[100px]" />
    </div>
    <div>
      <div>
        <div class="py-4 font-bold">
          We have sent you an email to
          <i class="text-green-600">{{ email }}</i> to verify your account.<br /><br />
          Please check your email and click the link to verify your account.<br />
          If you don't see the email in your inbox, please check your spam
          folder. <br /><br />If you still don't see the email, please click the
          button below to resend the email.
        </div>
        <v-btn
          :loading="loading"
          :disabled="loading"
          color="primary"
          class="w-full mt-5"
          @click="resendEmail"
        >
          Resend Email
        </v-btn>
        <v-btn color="secondary" class="w-full mt-2" to="/">
          Back to dashboard
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { emailResend } from "~/api/auth.js";
export default {
  name: "VerificationNotice",
  layout: "secondaryauth",
  data() {
    return {
      email: "",
      loading: false,
    };
  },
  methods: {
    async resendEmail() {
      try {
        this.loading = true;
        const resp = await emailResend({ email: this.email });
        this.loading = false;
        this.$notifier.showMessage({ content: resp.message, color: "success" });
      } catch (error) {
        this.$notifier.showMessage({ content: error, color: "error" });
        this.loading = false;
      }
    },
  },

  mounted() {
    this.email = this.$route.query.email;
    this.$notifier.showMessage({
      content: "You need to verify your account firstly!",
      color: "warning",
    });
  },
};
</script>
