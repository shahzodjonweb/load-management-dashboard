<template>
  <div
    class="p-6 pr-10 w-full bg-white hover:bg-gray-50 flex flex-col gap-y-4"
    @click="$router.push({ name: 'load-id', params: { id: item.id } })"
  >
    <CounterOffer
      v-if="item.counter_price && item.counter_price !== item.initial_price"
      :item="item"
      @accept="handleAcceptOffer"
      @reject="handleRejectOffer"
    />
    <div
      v-if="item.locations.length > 1"
      class="flex justify-between items-center"
    >
      <div class="flex justify-start items-center gap-2">
        <v-icon size="32" color="black darken-0">
          mdi-arrow-up-bold-circle-outline
        </v-icon>
        <div>
          <div class="text_lg font-medium">
            {{ item.locations[0].city }}, {{ item.locations[0].state }}
          </div>
          <div class="text_sm text-gray-400">
            {{ item.locations[0].date }}
          </div>
        </div>
      </div>
      <div class="flex justify-end items-center gap-2">
        <v-icon size="32" color="black darken-2"
          >mdi-arrow-down-bold-circle-outline
        </v-icon>
        <div>
          <div class="text_lg font-medium">
            {{ item.locations[item.locations.length - 1].city }},
            {{ item.locations[item.locations.length - 1].state }}
          </div>
          <div class="text_sm text-gray-400">
            {{ item.locations[item.locations.length - 1].date }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-y-2 text_md">
      <div class="flex justify-between">
        <div class="flex flex-col gap-y-2">
          <div class="text_lg text-green-600">
            <span class="font-medium">Rate:</span>
            <span> ${{ item.initial_price }}</span>
          </div>
          <div>
            <span class="font-medium">Type:</span>
            <span class="font-medium capitalize"> {{ item.type }}</span>
          </div>
        </div>
        <div>
          <LoadStatus :status="item.status" />
        </div>
      </div>

      <div v-if="item.description" class="text-justify">
        <span class="font-medium">Description:</span>
        <span>
          {{ item.description }}
        </span>
      </div>
    </div>
    <div class="flex gap-2 flex-wrap">
      <v-chip
        class="font-medium capitalize"
        color="blue"
        outlined
        v-for="(category, index) in item.categories"
        :key="index"
      >
        {{ category.name }}: {{ category.value }}
      </v-chip>
    </div>
  </div>
</template>

<script>
import { loadOfferActions } from "~/api/load";
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async handleAcceptOffer(id) {
      try {
        await loadOfferActions(id, {
          action: "accept",
        });
        this.$notifier.showMessage({
          content: "Offer accepted successfully",
          color: "success",
        });
        this.$store.commit("refreshPage");
      } catch (error) {
        this.$notifier.showMessage({
          content: "Error in accepting offer",
          color: "error",
        });
      }
    },
    async handleRejectOffer(id) {
      try {
        await loadOfferActions(id, {
          action: "reject",
        });
        this.$notifier.showMessage({
          content: "Offer rejected successfully",
          color: "success",
        });
        this.$store.commit("refreshPage");
      } catch (error) {
        this.$notifier.showMessage({
          content: "Error in rejecting offer",
          color: "error",
        });
      }
    },
  },
};
</script>
