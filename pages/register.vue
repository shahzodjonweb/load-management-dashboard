<template>
  <div
    class="h-screen w-[290px] mx-auto flex flex-col justify-center items-center space-y-7"
  >
    <div class="rounded-full shadow-lg p-3">
      <MainLogo class="w-[100px] h-[100px]" />
    </div>
    <v-form class="w-full mt-10" ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="name"
        :rules="nameRules"
        label="Full name"
        required
      ></v-text-field>
      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        required
        @input="noEmailError = true"
      ></v-text-field>

      <v-text-field
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show1 ? 'text' : 'password'"
        @click:append="show1 = !show1"
        v-model="password1"
        :rules="password1Rules"
        label="Password"
        required
      ></v-text-field>
      <v-text-field
        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show2 ? 'text' : 'password'"
        @click:append="show2 = !show2"
        v-model="password2"
        :rules="password2Rules"
        label="Comfirm password"
        required
      ></v-text-field>
      <div class="text-xs">
        Already have an account?
        <nuxt-link class="!text-blue-400 !text-sm" to="/login"
          >Sign in</nuxt-link
        >
      </div>
      <v-btn
        :disabled="!valid"
        color="success"
        class="w-full mt-5"
        @click="validate"
      >
        Sign up
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
import { registerUser } from "~/api/load";
import { VUE_APP_GOOGLE_TOKEN, STORAGE_KEY } from "~/core/constants.js";
import { userLogin } from "~/api/auth.js";
import { appleIdLogin } from "~/api/auth.js";
import cookie from "js-cookie";
export default {
  name: "Register",
  layout: "auth",
  data() {
    return {
      show1: false,
      show2: false,
      valid: true,
      name: "",
      nameRules: [(v) => !!v || "Name is required"],
      email: "",
      noEmailError: true,
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
        (v) => (v && this.noEmailError) || "E-mail already in use",
      ],

      password1: "",
      password1Rules: [(v) => !!v || "Password is required"],
      password2: "",
      password2Rules: [
        (v) => !!v || "Password is required",
        (v) => v === this.password1 || "Password must match",
      ],
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
      const user = {
        name: this.name,
        email: this.email,
        password1: this.password1,
        password2: this.password2,
      };
      this.registerUser(user);
    },
    async registerUser(user) {
      try {
        const response = await registerUser(user);
        cookie.set(STORAGE_KEY, response.data.token, {
          expires: 3650,
        });
        this.$router.push("/");
      } catch (error) {
        this.$notifier.showMessage({ content: error, color: "error" });
        this.noEmailError = false;
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
