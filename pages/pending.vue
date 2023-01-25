<template>
  <div>
    <LoadList :loading="loading" :items="items" />
  </div>
</template>

<script>
import { getLoads } from "~/api/load";
export default {
  name: "IndexPage",
  data: () => ({
    items: [],
  }),
  methods: {
    async _getLoads() {
      try {
        this.loading = true;
        const payload = {
          status: "pending",
        };
        const response = await getLoads(payload);
        this.items = response.data;
        this.loading = false;
      } catch (error) {
        this.$notifier.showMessage({ content: error, color: "error" });
      }
    },
  },
  created() {
    this._getLoads();
    this.$store.commit("setHeader", "Pending Orders");
  },
};
</script>
