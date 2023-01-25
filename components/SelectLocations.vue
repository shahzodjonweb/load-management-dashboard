<template>
  <v-row justify="center">
    <LocationInputs
      title="Pickup info"
      :location="locations[0]"
      @onChange="
        (location) => {
          setLocation(0, location);
        }
      "
    />
    <LocationInputs
      title="Delivery info"
      :location="locations[1]"
      @onChange="
        (location) => {
          setLocation(1, location);
        }
      "
    />
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      locations: [
        {
          address: null,
          city: null,
          state: null,
          zip: null,
          lat: null,
          lon: null,
          date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 10),
          checked: false,
        },
        {
          address: null,
          city: null,
          state: null,
          zip: null,
          lat: null,
          lon: null,
          date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 10),
          checked: false,
        },
      ],
    };
  },
  watch: {
    locations: {
      handler() {
        this.$emit("onChange", this.locations);
      },
      deep: true,
    },
  },

  methods: {
    setLocation(index, location) {
      this.locations[index] = JSON.parse(JSON.stringify(location));
    },
  },

  mounted() {
    this.$emit("onChange", this.locations);
  },
};
</script>
