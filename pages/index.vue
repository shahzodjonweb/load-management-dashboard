<template>
  <div>
    <LoadList :loading="loading" :items="items" />
  </div>
</template>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA2b82nOOXYn8LIjMiqQtV1jhM9wVj4q3E"></script>
<script>
import { getLoads } from "~/api/load";
import { getAccessToken } from "~/core/utils";

export default {
  name: "IndexPage",
  data: () => ({
    items: [],
    loading: false,
  }),
  methods: {
    async _getLoads() {
      try {
        this.loading = true;
        const payload = {};
        const response = await getLoads(payload);
        this.items = response.data.filter((item) => item.status != "initial");
        this.loading = false;
      } catch (error) {
        if (error.code === "UNAUTHORIZED") {
          this.$router.push({
            name: "verification-notice",
            query: { email: this.$store.state.user.email },
          });
        } else {
          this.$notifier.showMessage({ content: error, color: "error" });
        }
      }
    },
  },
  created() {
    this.$store.commit("setHeader", "EZ SHIP");
    const token = getAccessToken();
    if (token) {
      this._getLoads();
    }
  },
};
</script>
