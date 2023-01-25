<template>
  <div>
    <EditUserAccount
      @onSwitchUserType="handleSwitchUserType"
      @onRefresh="handleRefresh"
      :data="account"
    />
    <EditCompanyInfo
      v-if="account.has_company || switchToCompany"
      @onRefresh="handleRefresh"
      class="mt-2"
      :data="account"
    />
    <DeleteAccount class="mt-2" />
  </div>
</template>
<script>
import { userAccount } from "~/api/auth";
export default {
  name: "Settings",
  data() {
    return {
      account: JSON.parse(JSON.stringify(this.$store.state.user)),
      switchToCompany: false,
    };
  },
  watch: {
    "$store.state.user": {
      handler: function (val) {
        val = JSON.parse(JSON.stringify(val));
        this.account = val;
      },
      deep: true,
    },
  },
  methods: {
    async _userAccount() {
      try {
        const account = await userAccount();
        this.$store.commit("setUser", account.data);
      } catch (error) {
        this.$notifier.showMessage({ content: error, color: "error" });
      }
    },
    handleRefresh() {
      this._userAccount();
    },
    handleSwitchUserType(val) {
      this.switchToCompany = val;
    },
  },
  created() {
    this.$store.commit("setHeader", "Settings");
  },
};
</script>
