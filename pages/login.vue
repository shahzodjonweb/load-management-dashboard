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
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :rules="passwordRules"
        label="Password"
        type="password"
        required
      ></v-text-field>
      <div class="text-red-400 text-sm" v-if="hasError">
        Email or password is incorrect
      </div>
      <div class="text-xs">
        Forgot password?
        <nuxt-link class="!text-blue-400 !text-sm" to="/forgot-password"
          >Reset password</nuxt-link
        >
      </div>
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
      >
        Sign in
      </v-btn>
    </v-form>
    <div class="h-[1px] bg-gray-300 w-[200px] relative opacity-70">
      <div
        class="absolute bg-white left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-8 text-center"
      >
        or
      </div>
    </div>
    <div class="w-full" @click="login()">
      <v-btn class="w-full" color="white" @click="loader = 'loading3'" large>
        <v-icon color="primary" left large> mdi-google-plus </v-icon>
        <div class="ml-4">Sign in with Google</div>
      </v-btn>
    </div>
    <div class="w-full" @click="appleLogin()">
      <v-btn class="w-full" color="black" @click="loader = 'loading3'" large>
        <v-icon color="white" left large> mdi-apple </v-icon>
        <div class="ml-4 text-white">Sign in with Apple</div>
      </v-btn>
    </div>
  </div>
</template>
<script>
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { loginUser } from "~/api/load.js";
import { VUE_APP_GOOGLE_TOKEN, STORAGE_KEY } from "~/core/constants.js";
import { userLogin } from "~/api/auth.js";
import { appleIdLogin } from "~/api/auth.js";
import cookie from "js-cookie";
import { SignInWithApple } from "@capacitor-community/apple-sign-in";

let options = {
  clientId: "register.ezship.app",
  redirectURI: "https://app.shipio.app/login",
  scopes: "name email",
  state: "12345",
  nonce: "nonce",
};

export default {
  name: "LoginPage",
  layout: "auth",
  data() {
    return {
      valid: true,
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      hasError: false,
      password: "",
      passwordRules: [(v) => !!v || "Password is required"],
      params: {
        clientId: VUE_APP_GOOGLE_TOKEN,
        scopes: ["profile", "email"],
        grantOfflineAccess: true,
      },
    };
  },
  methods: {
    async onSuccess(token) {
      try {
        const user = await userLogin(token);
        cookie.set(STORAGE_KEY, user.token, {
          expires: 3650,
        });
        this.$router.push("/");
      } catch (error) {
        this.$notifier.showMessage({ content: error, color: "error" });
      }
    },
    async login() {
      try {
        const response = await GoogleAuth.signIn();
        const token = response.authentication.accessToken;
        this.onSuccess(token);
      } catch (error) {
        this.$notifier.showMessage({ content: error, color: "error" });
      }
    },
    validate() {
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }
      const user = {
        email: this.email,
        password: this.password,
      };
      this.loginUser(user);
    },
    async loginUser(user) {
      try {
        const response = await loginUser(user);
        cookie.set(STORAGE_KEY, response.data.token, {
          expires: 3650,
        });
        this.$router.push("/");
      } catch (error) {
        this.$notifier.showMessage({ content: error, color: "error" });
        this.hasError = true;
      }
    },
    appleLogin() {
      SignInWithApple.authorize(options)
        .then((result) => {
          this.appleLoginByAuthCode(result.response.identityToken);
        })
        .catch((error) => {
          this.$notifier.showMessage({ content: error, color: "error" });
        });
    },
    async appleLoginByAuthCode(code) {
      try {
        const response = await appleIdLogin(code);
        cookie.set(STORAGE_KEY, response.data.token, {
          expires: 3650,
        });
        this.$router.push("/");
      } catch (error) {
        this.$notifier.showMessage({ content: error, color: "error" });
      }
    },
  },
  mounted() {
    GoogleAuth.initialize(this.params);
  },
};
</script>
