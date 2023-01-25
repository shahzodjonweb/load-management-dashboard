<template>
  <div>
    <div v-for="(item, index) in items" :key="index">
      <v-col cols="12" v-if="item.type === 'select'">
        <v-select
          :items="item.options"
          :label="item.description"
          v-model="item.selected"
          @change="updateSelected()"
        ></v-select>
      </v-col>
      <v-col cols="12" v-if="item.type === 'number'">
        <v-subheader class="pl-0">
          {{ item.description }} : {{ item.selected }}
        </v-subheader>
        <v-slider
          max="15"
          min="0"
          v-model="item.selected"
          thumb-label
          @change="updateSelected()"
        ></v-slider>
      </v-col>
      <v-col cols="12" v-if="item.type === 'checkbox'">
        <v-switch
          v-model="item.selected"
          inset
          :label="`${item.description}: ${item.selected ? 'yes' : 'no'}`"
          @change="updateSelected()"
        ></v-switch>
      </v-col>
    </div>
  </div>
</template>
<script>
export default {
  props: ["loadType"],
  data() {
    return {
      data: {
        car: [
          {
            name: "car",
            description: "Select car type",
            selected: null,
            type: "select",
            options: [
              "Sedan",
              "Coupe",
              "Sports Car",
              "Station Wagon",
              "Hatchback",
              "Convertible",
              "SUV (Sport - Utility Vehicle)",
              "Minivan",
              "Pick up Truck",
            ],
          },
        ],
        freight: [
          {
            name: "freight",
            description: "Freight category",
            selected: null,
            type: "select",
            options: [
              "VAN Air Ride",
              "FLATBED",
              "STEP DECK",
              "RGN",
              "REFREGIRATED FREIGHT",
              "BOX TRUCK",
              "Conestoga",
              "Double DROP",
              "DUMB TRAILER",
              "TANKER LOAD",
            ],
          },
          {
            name: "type",
            description: "Freight type",
            selected: null,
            type: "select",
            options: ["Full Truckload", "Partial Truckload"],
          },
        ],
        move: [
          {
            name: "type",
            description: "Moving type",
            selected: null,
            type: "select",
            options: ["Office", "Home"],
          },
          {
            name: "bedrooms",
            description: "Number of bedrooms",
            selected: 0,
            type: "number",
          },
        ],
        po: [
          {
            name: "trailer",
            description: "Trailer type",
            selected: null,
            type: "select",
            options: [
              "VAN Air Ride",
              "FLATBED",
              "STEP DECK",
              "RGN",
              "REFREGIRATED FREIGHT",
              "BOX TRUCK",
              "Conestoga",
              "Double DROP",
              "DUMB TRAILER",
              "TANKER LOAD",
            ],
          },
          {
            name: "assist",
            description: "Assistance required?",
            selected: false,
            type: "checkbox",
          },
        ],
      },
    };
  },
  methods: {
    updateSelected() {
      const data = [];
      this.data[this.loadType].forEach((item) => {
        const obj = {
          name: item.name,
          value: item.selected,
        };
        data.push(obj);
      });
      this.$emit("onChange", data);
    },
  },
  computed: {
    items() {
      return this.data[this.loadType];
    },
  },
};
</script>
