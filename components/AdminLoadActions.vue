<template>
  <v-alert border="left" colored-border color="green accent-4" elevation="2">
    <div>
      <div class="font-bold mb-4 text_xl">Admin actions</div>
      <div class="flex items-center space-x-4">
        <div>
          <v-dialog v-model="counterRateDialog" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="secondary" dark v-bind="attrs" v-on="on">
                Give Counter Rate
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Give your counter rate</span>
              </v-card-title>
              <v-card-text>
                <v-text-field
                  label="Your counter rate*"
                  type="number"
                  v-model="loadData.price"
                  required
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="counterRateDialog = false"
                >
                  Close
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="
                    counterRateDialog = false;
                    sendCounterRate();
                  "
                >
                  Send
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
        <div>
          <v-dialog v-model="statusChangeDialog" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on">
                Change Status
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Select to change status</span>
              </v-card-title>
              <v-card-text>
                <v-select
                  v-model="loadData.status"
                  :items="items"
                  item-text="state"
                  item-value="abbr"
                  label="Select"
                  persistent-hint
                  return-object
                  single-line
                ></v-select>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="statusChangeDialog = false"
                >
                  Close
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="
                    statusChangeDialog = false;
                    changeStatus();
                  "
                >
                  Change
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </div>
    </div>
  </v-alert>
</template>
<script>
import { updateLoadStatus, updateLoadCounterRate } from "@/api/load";

export default {
  name: "AdminLoadActions",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      counterRateDialog: false,
      statusChangeDialog: false,
      items: [
        "rejected",
        "pending",
        "accepted",
        "started",
        "completed",
        "invoiced",
      ],
      loadData: {
        status: null,
        price: null,
      },
    };
  },
  methods: {
    async sendCounterRate() {
      if (this.loadData.price) {
        try {
          const response = await updateLoadCounterRate(this.data.id, {
            price: this.loadData.price,
          });
          this.$notifier.showMessage({
            content: "Counter rate set successfully",
            color: "success",
          });
          this.$store.commit("refreshPage");
        } catch (error) {
          this.$notifier.showMessage({
            content: "Something went wrong",
            color: "error",
          });
        }
      }
    },
    async changeStatus() {
      if (this.loadData.status) {
        try {
          const response = await updateLoadStatus(this.data.id, {
            status: this.loadData.status,
          });
          this.$notifier.showMessage({
            content: "Status changed successfully",
            color: "success",
          });
          this.$store.commit("refreshPage");
        } catch (error) {
          this.$notifier.showMessage({
            content: "Something went wrong",
            color: "error",
          });
        }
      }
    },
  },
};
</script>
