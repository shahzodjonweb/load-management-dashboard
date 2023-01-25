<template>
  <div
    class="h-screen w-[290px] mx-auto flex flex-col justify-center items-center space-y-7"
  >
    <div class="rounded-full shadow-lg p-3">
      <MainLogo class="w-[100px] h-[100px]" />
    </div>
    <v-form class="w-full mt-10" ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="password1"
        :rules="password1Rules"
        label="Password"
        type="password"
        required
      ></v-text-field>
      <v-text-field
        v-model="password2"
        :rules="password2Rules"
        label="Comfirm password"
        type="password"
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
        :loading="loading"
        color="success"
        class="w-full mt-5"
        @click="validate"
      >
        Reset Password
      </v-btn>
    </v-form>
  </div>
</template>
<script>
import { resetPassword } from "~/api/auth";
export default {
  name: "ResetPassword",
  layout: "secondaryauth",
  data() {
    return {
      token: "",
      email: "",
      loading: false,
      valid: true,
      password1: "",
      password1Rules: [(v) => !!v || "Password is required"],
      password2: "",
      password2Rules: [
        (v) => !!v || "Password is required",
        (v) => v === this.password1 || "Password must match",
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
        const resp = await resetPassword({
          token: this.token,
          email: this.email,
          password: this.password1,
          password_confirmation: this.password2,
        });
        this.$notifier.showMessage({ content: resp.message, color: "success" });
        this.loading = false;
        setTimeout(() => {
          this.$router.push("/login");
        }, 2000);
      } catch (error) {
        this.$notifier.showMessage({
          content: "Password reset link invalid!",
          color: "error",
        });
        this.$refs.form.validate();
        this.loading = false;
      }
    },
  },
  mounted() {
    if (this.$route.query.token) {
      this.token = this.$route.query.token;
      this.email = this.$route.query.email;
    } else {
      this.$router.push("/forgot-password");
    }
  },
};
</script>
