<template>
  <PopupDialog @onSave="updateLoadInfo()">
    <template v-slot:button="{ onClick }">
      <v-btn @click="onClick" color="secondary" fab x-small dark>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <div class="p-6">
      <LocationInputs
        title="Edit Location"
        :location="locationData"
        @onChange="handleLocationChange"
      />
    </div>
  </PopupDialog>
</template>
<script>
import { updateLocation } from "~/api/load";
export default {
  name: "EditLocation",
  props: {
    location: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      locationData: this.location,
      loading: false,
    };
  },
  methods: {
    handleLocationChange(location) {
      this.locationData = location;
    },
    async updateLoadInfo() {
      try {
        this.loading = true;
        if (this.locationData.checked) {
          await updateLocation(this.location.id, this.locationData);
          this.$notifier.showMessage({
            content: "Location updated successfully",
            color: "success",
          });
          this.$store.commit("refreshPage");
        } else {
          this.$notifier.showMessage({
            content: "Please check location validity ",
            color: "error",
          });
        }
        this.loading = false;
      } catch (error) {
        this.$notifier.showMessage({
          content: "Error in updating location",
          color: "error",
        });
        this.loading = false;
      }
    },
  },
};
</script>
