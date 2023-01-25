<template>
  <v-alert border="top" colored-border type="info" elevation="2">
    <div v-if="item.status !== 'rejected'" class="flex flex-col w-full">
      <div class="text_lg font-semibold">
        Check our offer against ${{ item.initial_price }}
      </div>
      <div>
        <div class="text_lg opacity-80 font-medium text-green-500">
          Counter offer: ${{ item.counter_price }}
        </div>
      </div>
      <div class="flex space-x-2 self-end mt-2">
        <v-btn @click="handleAccept" elevation="2" small color="success">
          Accept
        </v-btn>
        <v-btn @click="handleReject" elevation="2" small color="error">
          Reject
        </v-btn>
      </div>
    </div>
    <div v-else class="flex flex-col w-full">
      <div class="text_lg font-semibold text-green-500">
        You can still accept our offer of ${{ item.counter_price }}
      </div>
      <div class="self-end mt-2">
        <v-btn @click="handleAccept" elevation="2" small color="success">
          Accept
        </v-btn>
      </div>
    </div>
  </v-alert>
</template>
<script>
export default {
  name: "CounterOffer",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    handleAccept() {
      this.$emit("accept", this.item.id);
    },
    handleReject() {
      this.$emit("reject", this.item.id);
    },
  },
};
</script>
