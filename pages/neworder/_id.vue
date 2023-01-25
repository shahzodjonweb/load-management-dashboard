<template>
  <v-stepper v-model="e13" vertical>
    <v-stepper-step
      step="1"
      :complete="steps[0].complete"
      :rules="[() => validateStep(steps[0], loadType)]"
    >
      Select Load Type
      <small v-if="!validateStep(steps[0], loadType)"
        >Please fill all required fields</small
      >
    </v-stepper-step>

    <v-stepper-content step="1">
      <div class="px-2">
        <LoadType @onChange="handleLoadType" />
        <div class="mb-4">
          <v-btn elevation="2" text to="/"> Back To Orders </v-btn>
        </div>
      </div>
    </v-stepper-content>

    <v-stepper-step
      step="2"
      :complete="steps[1].complete"
      :rules="[() => validateStep(steps[1], specs)]"
    >
      Select Specifications
      <small v-if="!validateStep(steps[1], specs)"
        >Please fill all required fields</small
      >
    </v-stepper-step>

    <v-stepper-content step="2">
      <div class="px-2">
        <LoadSpecifications
          :loadType="loadType"
          @onChange="handleLoadSpecifications"
        />
        <div class="mb-4">
          <v-btn
            elevation="2"
            color="primary"
            @click="updateLoadSpecifications()"
          >
            Continue
          </v-btn>
          <v-btn elevation="2" text @click="e13 = 1"> Back </v-btn>
        </div>
      </div>
    </v-stepper-content>

    <v-stepper-step
      step="3"
      :complete="steps[2].complete"
      :rules="[() => validateStep(steps[2], locations)]"
    >
      Select Locations
      <small v-if="!validateStep(steps[2], locations)"
        >Please fill all required fields</small
      >
    </v-stepper-step>

    <v-stepper-content step="3">
      <SelectLocations @onChange="handleLocations" />
      <div class="mb-4">
        <v-btn elevation="2" color="primary" @click="updateLocations()">
          Continue
        </v-btn>
        <v-btn elevation="2" text @click="e13 = 2"> Back </v-btn>
      </div>
    </v-stepper-content>

    <v-stepper-step
      step="4"
      :complete="steps[3].complete"
      :rules="[() => validateStep(steps[3], info)]"
    >
      Enter Order Info
      <small v-if="!validateStep(steps[3], info)"
        >Please fill all required fields</small
      >
    </v-stepper-step>

    <v-stepper-content step="4">
      <OtherInfo @onChange="handleLoadInfo" />
      <div class="mb-4">
        <v-btn elevation="2" color="primary" @click="updateLoadInfo()">
          Confirm
        </v-btn>
        <v-btn elevation="2" text @click="e13 = 3"> Back </v-btn>
      </div>
    </v-stepper-content>
  </v-stepper>
</template>
<script>
import { updateLoad } from "~/api/load";
export default {
  data() {
    return {
      e13: 1,
      loadType: "",
      specs: [],
      locations: [],
      info: [],
      steps: [
        {
          step: 1,
          complete: false,
        },
        {
          step: 2,
          complete: false,
        },
        {
          step: 3,
          complete: false,
        },
        {
          step: 4,
          complete: false,
        },
      ],
    };
  },
  methods: {
    handleLoadType(value) {
      this.loadType = value;
      this.updateLoadType();
      this.specs = [];
    },
    handleLoadSpecifications(value) {
      this.specs = value;
    },
    handleLocations(value) {
      this.locations = value;
    },
    handleLoadInfo(value) {
      this.info = value;
    },
    async updateLoadType() {
      this.steps[0].complete = true;
      if (!this.checkStepValidity(this.loadType, this.steps[0].step)) return;
      const payload = {
        type: this.loadType,
      };
      this._updateLoad(payload);
      this.e13 = 2;
    },
    updateLoadSpecifications() {
      this.steps[1].complete = true;
      if (!this.checkStepValidity(this.specs, this.steps[1].step)) return;
      const payload = {
        categories: this.specs,
      };
      this._updateLoad(payload);
      this.e13 = 3;
    },
    checkIfLocationsChecked() {
      if (!(this.locations[0].lat && this.locations[0].lon)) {
        this.$notifier.showMessage({
          content: "Please check validity of pickup location",
          color: "error",
        });
        return false;
      }
      if (!(this.locations[1].lat && this.locations[1].lon)) {
        this.$notifier.showMessage({
          content: "Please check validity of delivery location",
          color: "error",
        });
        return false;
      }
      return true;
    },
    updateLocations() {
      this.steps[2].complete = true;
      if (!this.checkIfLocationsChecked()) return;
      if (!this.checkStepValidity(this.locations, this.steps[2].step)) return;
      const payload = {
        locations: this.locations,
      };
      this._updateLoad(payload);
      this.e13 = 4;
    },
    async updateLoadInfo() {
      this.steps[3].complete = true;
      if (!this.checkStepValidity(this.info, this.steps[3].step)) return;
      const payload = this.info;
      await this._updateLoad(payload);
      const status = {
        status: "pending",
      };
      await this._updateLoad(status);
      this.$router.push("/");
    },
    async _updateLoad(payload) {
      const response = await updateLoad(this.$route.params.id, payload);
    },
    checkObjectValidity(obj) {
      if (Object.keys(obj).length === 0) {
        return false;
      }
      return Object.values(obj).every((element) => element !== null);
    },
    checkIfObjectArrayElementsEmpty(arr) {
      if (arr.length == 0) {
        return false;
      }
      for (let index = 0; index < arr.length; index++) {
        if (!this.checkObjectValidity(arr[index])) {
          return false;
        }
      }
      return true;
    },

    checkStepValidity(obj, step) {
      switch (step) {
        case 1:
          return obj !== "";
        case 2:
          return this.checkIfObjectArrayElementsEmpty(obj);
        case 3:
          return this.checkIfObjectArrayElementsEmpty(obj);
        case 4:
          return obj.initial_price > 0 && obj.phone != "";
        default:
          return false;
      }
    },
  },
  computed: {
    validateStep() {
      return (step, value) => {
        if (!step.complete) {
          return true;
        }
        if (this.checkStepValidity(value, step.step)) {
          return true;
        }
        return false;
      };
    },
  },
  created() {
    this.$store.commit("setHeader", "Create new order");
  },
};
</script>
