<template>
  <v-col cols="12">
    <div>
      <b>{{ title }}</b>
    </div>
    <v-card-text>
      <v-text-field
        v-model="locationData.address"
        :rules="[
          () => !!locationData.address || 'This field is required',
          () =>
            (!!locationData.address && locationData.address.length <= 25) ||
            'Address must be less than 25 characters',
          addressCheck,
        ]"
        label="Address Line"
        placeholder="Snowy Rock Pl"
        counter="25"
        @input="handleChange"
        required
      ></v-text-field>
      <v-text-field
        v-model="locationData.city"
        :rules="[
          () => !!locationData.city || 'This field is required',
          addressCheck,
        ]"
        label="City"
        placeholder="Indianapolis"
        required
        @input="handleChange"
      ></v-text-field>
      <v-autocomplete
        v-model="locationData.state"
        :rules="[() => !!locationData.state || 'This field is required']"
        :items="states"
        label="State"
        placeholder="IN..."
        required
        @input="handleChange"
      ></v-autocomplete>
      <v-text-field
        v-model="locationData.zip"
        :rules="[() => !!locationData.zip || 'This field is required']"
        label="ZIP / Postal Code"
        required
        placeholder="79938"
        @input="handleChange"
      ></v-text-field>
      <v-dialog
        ref="dialog"
        v-model="modal"
        :return-value.sync="locationData.date"
        persistent
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            :value="formatDate(locationData.date)"
            @input="handleChange"
            label="Pickup Date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="locationData.date" scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="modal = false"> Cancel </v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.dialog.save(locationData.date)"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-dialog>
    </v-card-text>
    <div class="flex justify-end">
      <v-btn
        elevation="2"
        :color="checked ? 'success' : 'warning'"
        @click="checkAddress()"
      >
        <v-icon left>
          {{ checked ? "mdi-map-marker-check-outline" : "mdi-eye" }}
        </v-icon>
        {{ checked ? "Checked" : "Check address" }}
      </v-btn>
    </div>
  </v-col>
</template>
<script>
import { getLatLong } from "~/api/geocoding";

export default {
  name: "LocationInputs",
  props: {
    location: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      locationData: this.location,
      states: [
        "AK",
        "AL",
        "AR",
        "AS",
        "AZ",
        "CA",
        "CO",
        "CT",
        "DC",
        "DE",
        "FL",
        "GA",
        "GU",
        "HI",
        "IA",
        "ID",
        "IL",
        "IN",
        "KS",
        "KY",
        "LA",
        "MA",
        "MD",
        "ME",
        "MI",
        "MN",
        "MO",
        "MS",
        "MT",
        "NC",
        "ND",
        "NE",
        "NH",
        "NJ",
        "NM",
        "NV",
        "NY",
        "OH",
        "OK",
        "OR",
        "PA",
        "PR",
        "RI",
        "SC",
        "SD",
        "TN",
        "TX",
        "UT",
        "VA",
        "VI",
        "VT",
        "WA",
        "WI",
        "WV",
        "WY",
      ],
      errorMessages: "",
      formHasErrors: false,
      modal: false,
      checked: false,
    };
  },
  watch: {
    location: {
      handler: function (val) {
        this.locationData = val;
      },
      deep: true,
    },
  },
  methods: {
    handleChange() {
      const location = {
        address: this.locationData.address,
        city: this.locationData.city,
        state: this.locationData.state,
        zip: this.locationData.zip,
        date: this.locationData.date,
        lat: null,
        lon: null,
        checked: false,
      };
      this.checked = false;
      this.setLocation(location);
    },
    setLocation(location) {
      this.$emit("onChange", location);
    },

    addressCheck() {
      this.errorMessages =
        this.address && !this.name ? `Hey! I'm required` : "";
      return true;
    },
    async getLocation(address) {
      try {
        const response = await getLatLong(address);
        if (response.results.length === 0) {
          this.$notifier.showMessage({
            content: "Address not found",
            color: "error",
          });
          return;
        }

        //set google address to form
        const addressmap = response.results[0].formatted_address.split(",");
        if (addressmap.length < 4) {
          this.$notifier.showMessage({
            content: "Address not found",
            color: "error",
          });
          return;
        }
        const { lat, lng } = response.results[0].geometry.location;
        this.locationData.address = addressmap[0];
        this.locationData.city = addressmap[1];
        this.locationData.state = addressmap[2].split(" ")[1];
        this.locationData.zip = addressmap[2].split(" ")[2];
        this.locationData.lat = lat;
        this.locationData.lon = lng;
        this.checked = true;
        this.setLocation({ ...this.locationData, checked: true });
      } catch (error) {
        this.$notifier.showMessage({
          content: "Address not found",
          color: "error",
        });
      }
    },
    checkAddress() {
      const address = `${this.locationData.address}, ${this.locationData.city}, ${this.locationData.state} ${this.locationData.zip}`;
      this.getLocation(address);
    },
  },
  computed: {
    formatDate() {
      return (date) => {
        if (!date) return null;
        const [year, month, day] = date.split("-");
        return `${month}/${day}/${year}`;
      };
    },
  },
};
</script>
