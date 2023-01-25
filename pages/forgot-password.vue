<template>
  <div
    class="h-screen w-[290px] mx-auto flex flex-col justify-center items-center space-y-7"
  >
    <div class="rounded-full shadow-lg p-3">
      <MainLogo class="w-[100px] h-[100px]" />
    </div>
    <v-form class="w-full mt-10" ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        @input="noEmailError = true"
        required
      ></v-text-field>
      <div class="text-xs">
        Don't have an account?
        <nuxt-link class="!text-blue-400 !text-sm" to="/register"
          >Sign up</nuxt-link
        >
      </div>
      <v-btn
        :disabled="!valid"
        color="success"
        class="w-full mt-5"
        @click="validate"
        :loading="loading"
      >
        Reset Password
      </v-btn>
    </v-form>
  </div>
</template>
<script>
import { forgotPassword } from "~/api/auth";
export default {
  name: "ForgotPassword",
  layout: "secondaryauth",
  data() {
    return {
      loading: false,
      valid: true,
      email: "",
      noEmailError: true,
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
        (v) => (v && this.noEmailError) || "No user found with this email",
      ],
    };
  },
  methods: {
    validate() {
      this.$refs.form.validate();
      if (this.valid) {
        this.resetPassword();
      }
    },
    async resetPassword() {
      try {
        this.loading = true;
        const resp = await forgotPassword({
          email: this.email,
        });
        this.$notifier.showMessage({ content: resp.message, color: "success" });
        this.loading = false;
      } catch (error) {
        this.noEmailError = false;
        this.$refs.form.validate();
        this.loading = false;
      }
    },
  },
};
</script>
