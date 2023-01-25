<template>
  <v-app id="inspire" v-show="isAuthenticated">
    <v-navigation-drawer v-model="drawer" app>
      <v-list color="primary" dense nav>
        <v-list-item>
          <v-list-item-avatar color="red">
            <v-img v-if="account.avatar" :src="account.avatar"></v-img>
            <span v-else class="white--text text-h5">{{
              getFirstLetter(account.name)
            }}</span>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="white--text text-h6">
              {{ account.name }}
            </v-list-item-title>
            <v-list-item-subtitle class="white--text">{{
              account.email
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item>
          <v-btn
            class="w-full mt-2 mb-5"
            :loading="loading"
            :disabled="loading"
            color="secondary"
            @click="createNewOrder"
          >
            <v-icon left> mdi-plus </v-icon> Create Order
          </v-btn>
        </v-list-item>
        <v-list-item
          active-class="pink--text"
          v-for="item in items"
          :key="item.title"
          :to="item.to"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout()">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar height="70" color="primary" class="white--text" app>
      <v-app-bar-nav-icon
        color="white"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>{{ $store.state.pageHeader }}</v-toolbar-title>

      <div class="ml-auto">
        <div @click="onRefresh" ref="refreshButton">
          <v-icon class="text-lg" color="white"> mdi-cached </v-icon>
        </div>
      </div>
    </v-app-bar>

    <v-main ref="pageContent" class="bg-gray-100">
      <vue-pull-refresh
        :on-refresh="onRefresh"
        :config="{
          errorLabel: 'error',
          startLabel: 'Pull down to refresh',
          readyLabel: 'Release to refresh',
          loadingLabel: 'Loading...',
          pullDownHeight: 80,
        }"
      >
        <nuxt-child :key="key"
      /></vue-pull-refresh>
    </v-main>
    <v-card-text
      class="bg-gray-100 relative h-0"
      v-if="$route.name != 'neworder-id'"
    >
      <v-fab-transition>
        <v-btn
          :loading="loading"
          :disabled="loading"
          @click="createNewOrder"
          color="secondary"
          dark
          fixed
          bottom
          right
          fab
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-card-text>
    <VuetifyToast ref="toast" />
  </v-app>
</template>

<script>
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { userAccount } from "~/api/auth";
import { getAccessToken } from "~/core/utils";
import VuePullRefresh from "vue-pull-refresh";
import cookie from "js-cookie";
import { STORAGE_KEY } from "~/core/constants.js";

export default {
  name: "DefaultLayout",
  components: {
    VuePullRefresh,
  },
  data() {
    return {
      isAuthenticated: false,
      loading: false,
      selectedItem: 0,
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "My Orders",
          to: "/",
        },
        {
          icon: "mdi-shield-check",
          title: "Accepted Orders",
          to: "/accepted",
        },
        {
          icon: "mdi-cancel",
          title: "Rejected Orders",
          to: "/rejected",
        },
        {
          icon: "mdi-timer-play",
          title: "Started Orders",
          to: "/started",
        },
        {
          icon: "mdi-account-clock",
          title: "Pending Orders",
          to: "/pending",
        },
        {
          icon: "mdi-check-all",
          title: "Completed Orders",
          to: "/completed",
        },
        {
          icon: "mdi-clipboard-text-clock",
          title: "History",
          to: "/invoiced",
        },
        {
          icon: "mdi-cog",
          title: "Settings",
          to: "/settings",
        },
        {
          icon: "mdi-help-circle",
          title: "Help",
          to: "/help",
        },
      ],
      account: {
        name: "",
        email: "",
      },
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Vuetify.js",
      key: 0,
    };
  },
  watch: {
    "$store.state.refresh": function () {
      this.onRefresh();
    },
  },
  methods: {
    async createNewOrder() {
      this.$router.push({
        name: "new-order",
      });
    },
    logout() {
      GoogleAuth.signOut();
      cookie.remove(STORAGE_KEY);
      this.$router.push("/login");
    },
    getFirstLetter(name) {
      if (name) {
        return name[0].toUpperCase();
      } else {
        return "";
      }
    },
    async _userAccount() {
      try {
        const account = await userAccount();
        this.$store.commit("setUser", account.data);
        this.account = account.data;
        if (!this.account.email_verified_at) {
          this.$router.push({
            name: "verification-notice",
            query: { email: this.$store.state.user.email },
          });
        } else {
          if (this.account.loads_count === 0) {
            this.createNewOrder();
          }
        }
      } catch (error) {
        if (error.code === "UNAUTHORIZED") {
          this.$router.push({
            name: "verification-notice",
            query: { email: this.$store.state.user.email },
          });
        } else {
          this.$notifier.showMessage({ content: error, color: "error" });
          this.logout();
        }
      }
    },
    onRefresh() {
      this.key++;
      this.animateRotation();
    },
    animateRotation() {
      this.$refs.refreshButton.classList.add("animate-spin");
      setTimeout(() => {
        this.$refs.refreshButton.classList.remove("animate-spin");
      }, 1000);
    },
  },
  created() {
    const token = getAccessToken();
    this.isAuthenticated = token.length > 0;
    console.log("default", token);
    if (!token) {
      GoogleAuth.signOut();
      this.$router.push("/login");
    } else {
      this._userAccount();
    }
  },
};
</script>
<style>
.pull-down-header {
  background-color: white !important;
}
.pull-down-header * {
  color: black !important;
}
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(720deg);
  }
}
</style>
