<template>
  <div>
    <div v-if="!items.length && !loading" class="empty">Empty</div>
    <div v-if="loading" class="flex items-center justify-center h-[300px]">
      <v-progress-circular
        :size="50"
        color="red"
        indeterminate
      ></v-progress-circular>
    </div>
    <div v-if="items.length" class="flex flex-col divide-gray-100">
      <div
        class="block lg:hidden card-item w-full"
        v-for="(item, i) in items"
        :key="i"
      >
        <LoadCard class="mb-3" :item="item" />
      </div>
      <div class="hidden lg:table load-list px-10 py-5 bg-white">
        <v-simple-table>
          <template v-slot:default>
            <thead class="bg-gray-100">
              <tr>
                <th class="!text-lg text-left">Date</th>
                <th class="!text-lg text-left">Customer</th>
                <th class="!text-lg text-center">Pickup</th>
                <th class="!text-lg text-left"></th>
                <th class="!text-lg text-center">Delivery</th>
                <th class="!text-lg text-left">Equipment</th>
                <th class="!text-lg text-left">Status</th>
                <th class="!text-lg text-left">Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in items"
                :key="item.id"
                class="table-row cursor-pointer"
                @click="
                  $router.push({ name: 'load-id', params: { id: item.id } })
                "
              >
                <td>
                  <div>{{ item.created_at }}</div>
                </td>
                <td>
                  <div>
                    <div class="font-medium" v-if="item.owner">
                      {{ item.owner.name }}
                    </div>
                    <div class="font-medium text-red-500" v-else>
                      Deleted Customer
                    </div>
                  </div>
                </td>
                <td>
                  <div
                    class="table-data text-center"
                    v-if="item.locations.length > 1"
                  >
                    <div class="text_lg font-medium">
                      {{ item.locations[0].address }}
                    </div>
                    <div class="text_lg font-medium">
                      {{ item.locations[0].city }},
                      {{ item.locations[0].state }}
                    </div>
                    <div class="text_sm text-gray-400">
                      {{ item.locations[0].date }}
                    </div>
                  </div>
                </td>
                <td>
                  <div class="table-data flex items-center justify-center">
                    <v-icon class="indicator-icon" large color="red darken-2">
                      mdi-arrow-right-bold
                    </v-icon>
                  </div>
                </td>
                <td>
                  <div
                    class="table-data text-center"
                    v-if="item.locations.length > 1"
                  >
                    <div class="text_lg font-medium">
                      {{ item.locations[item.locations.length - 1].address }}
                    </div>
                    <div class="text_lg font-medium">
                      {{ item.locations[item.locations.length - 1].city }},
                      {{ item.locations[item.locations.length - 1].state }}
                    </div>
                    <div class="text_sm text-gray-400">
                      {{ item.locations[item.locations.length - 1].date }}
                    </div>
                  </div>
                </td>
                <td>
                  <div class="table-data">
                    <div
                      class="flex my-1"
                      v-for="(category, index) in item.categories"
                      :key="index"
                    >
                      <v-chip
                        class="font-medium capitalize"
                        color="blue"
                        outlined
                      >
                        {{ category.name }}: {{ category.value }}
                      </v-chip>
                    </div>
                  </div>
                </td>
                <td>
                  <LoadStatus :status="item.status" />
                </td>
                <td>
                  <div class="pt-5">
                    <div class="text_lg text-green-600 table-data">
                      <span class="font-medium">Rate:</span>
                      <span> ${{ item.initial_price }}</span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </div>
  </div>
</template>

<script>
import { loadOfferActions } from "~/api/load";

export default {
  name: "LoadList",
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
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
<style>
.load-list .table-data {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.table-row:hover .indicator-icon {
  transform: translateX(10px);
}
.indicator-icon:hover {
  transition: transform 0.3s ease;
}
</style>
