<template>
  <div class="p-6 w-full bg-white">
    <div v-if="loading" class="flex justify-center items-center h-[700px]">
      <v-progress-circular
        :size="50"
        color="red"
        indeterminate
      ></v-progress-circular>
    </div>
    <div v-else>
      <div class="flex items-center justify-between mb-4">
        <div class="text_2xl font-medium">
          Load № : #{{ item.id.slice(-8) }}
        </div>
        <div>
          <LoadStatus :status="item.status" />
        </div>
      </div>
      <AdminLoadActions :data="item" />
      <div class="transform -translate-x-10">
        <v-timeline align-right dense>
          <v-timeline-item color="pink" small>
            <div class="flex items-start justify-between">
              <div>
                <div class="text_lg font-medium">
                  {{ item.locations[0].address }}
                </div>
                <div class="text_lg font-medium">
                  {{ item.locations[0].city }}, {{ item.locations[0].state }}
                </div>
                <div class="text_sm text-gray-400">
                  {{ item.locations[0].date }}
                </div>
              </div>
              <div>
                <EditLocation
                  @refreshPage="handleRefresh"
                  :location="item.locations[0]"
                />
              </div>
            </div>
          </v-timeline-item>

          <v-timeline-item color="teal lighten-3" small>
            <div class="flex items-start justify-between">
              <div>
                <div class="text_lg font-medium">
                  {{ item.locations[1].address }}
                </div>
                <div class="text_lg font-medium">
                  {{ item.locations[1].city }}, {{ item.locations[1].state }}
                </div>
                <div class="text_sm text-gray-400">
                  {{ item.locations[1].date }}
                </div>
              </div>
              <div>
                <EditLocation :location="item.locations[1]" />
              </div>
            </div>
          </v-timeline-item>
        </v-timeline>
      </div>
      <div class="my-10 bg-slate-300">
        <iframe
          style="width: 100%; height: 300px"
          frameborder="0"
          :src="
            'https://www.google.com/maps/embed/v1/directions?key=AIzaSyDkJzaOxyHQ0Die9iyqfeJvhUMocA8fFac&origin=' +
            item.locations[0].lat +
            ',' +
            item.locations[0].lon +
            '&destination=' +
            item.locations[1].lat +
            ',' +
            item.locations[1].lon
          "
          allowfullscreen
        >
        </iframe>
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
            <EditLoadInfo
              :description="item.description"
              :rate="item.initial_price"
              :loadId="item.id"
              @onDeleteLoad="
                () => {
                  dialog = true;
                }
              "
            />
            <v-btn
              class="mt-2"
              fab
              dark
              x-small
              color="error"
              @click="dialog = true"
            >
              <v-icon dark> mdi-delete </v-icon>
            </v-btn>
          </div>
        </div>

        <div v-if="item.description" class="text-justify">
          <span class="font-medium">Description:</span>
          <span>
            {{ item.description }}
          </span>
        </div>
      </div>
      <div class="flex gap-2 flex-wrap mt-4">
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

    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5">
          Do you want to delete load?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="dialog = false">
            Close
          </v-btn>

          <v-btn color="red darken-1" text @click="handleDeleteLoad">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { getLoad, loadOfferActions, deleteLoad } from "@/api/load";
export default {
  name: "LoadCard",
  data() {
    return {
      loading: false,
      dialog: false,
      item: {
        id: 1,
        initial_price: 100,
        counter_price: 200,
        type: "full",
        status: "pending",
        description: "This is a description",
        categories: [
          {
            name: "weight",
            value: "1000",
          },
          {
            name: "length",
            value: "1000",
          },
          {
            name: "width",
            value: "1000",
          },
          {
            name: "height",
            value: "1000",
          },
        ],
        locations: [
          {
            city: "city1",
            state: "state1",
            date: "date1",
          },
          {
            city: "city2",
            state: "state2",
            date: "date2",
          },
          {
            city: "city3",
            state: "state3",
            date: "date3",
          },
        ],
      },
    };
  },
  computed: {
    showPaymentAlert() {
      return (
        (this.item.status === "accepted" || this.item.status === "invoiced") &&
        this.item.payment &&
        !this.item.payment.is_paid
      );
    },
  },
  methods: {
    async handleDeleteLoad() {
      try {
        await deleteLoad(this.$route.params.id);
        this.$notifier.showMessage({
          content: "Load deleted successfully",
          color: "success",
        });
        this.$router.push("/");
      } catch (err) {
        this.$notifier.showMessage({
          content: "Error while deleting order",
          color: "error",
        });
      }
    },
    handleRefresh() {
      this.getLoad();
    },
    handleAcceptOffer() {
      this.$emit("accept", this.item);
    },
    handleRejectOffer() {
      this.$emit("reject", this.item);
    },
    async getLoad() {
      try {
        this.loading = true;
        const res = await getLoad(this.$route.params.id);
        this.item = res.data;
        this.loading = false;
      } catch (err) {
        this.$notifier.showMessage({
          content: "Error while fetching order",
          color: "error",
        });
      }
    },
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
  created() {
    this.$store.commit("setHeader", "EZ SHIP");
    this.getLoad();
  },
};
</script>
