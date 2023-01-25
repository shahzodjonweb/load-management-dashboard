<template>
  <PopupDialog @onSave="updateLoadInfo()">
    <template v-slot:button="{ onClick }">
      <v-btn @click="onClick" color="secondary" fab x-small dark>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <div class="p-6">
      <v-form class="w-full mt-10" ref="form" v-model="valid" lazy-validation>
        <div class="text_xl mb-2 font-medium">Description</div>
        <v-textarea
          v-model="descriptionData"
          :rules="descriptionRules"
          label="Description of shipment"
          required
          solo
        ></v-textarea>
        <div class="text_xl mb-2 font-medium">Your budget</div>
        <v-text-field
          v-model="rateData"
          :rules="rateRules"
          label="rate"
          oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
          prefix="$"
          min="50"
          maxlength="6"
          placeholder="Enter your budget"
          required
          solo
        ></v-text-field>
      </v-form>
      <div>
        <b> You can edit only your load description , locations and rate.</b> If
        you want to change other details, please delete the load and create a
        new one.
      </div>
      <div>
        <v-btn class="mt-2" color="error" @click="deleteLoad"> Delete </v-btn>
      </div>
    </div>
  </PopupDialog>
</template>
<script>
import { updateLoad } from "~/api/load";
export default {
  name: "EditLocation",
  props: {
    description: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    loadId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      valid: true,
      descriptionData: this.description,
      descriptionRules: [(v) => !!v || "Description is required"],
      rateData: this.rate,
      rateRules: [(v) => !!v || "Password is required"],
    };
  },
  methods: {
    async updateLoadInfo() {
      try {
        const data = await updateLoad(this.loadId, {
          description: this.descriptionData,
          initial_price: this.rateData,
        });

        this.$notifier.showMessage({
          content: "Load updated successfully",
          color: "success",
        });
        this.$store.commit("refreshPage");
      } catch (error) {
        this.$notifier.showMessage({
          content: "Error in updating load",
          color: "error",
        });
      }
    },
    async deleteLoad() {
      this.$emit("onDeleteLoad");
    },
  },
};
</script>
