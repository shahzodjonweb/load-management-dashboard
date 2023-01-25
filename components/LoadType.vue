<template>
  <div id="loadtype">
    <v-row no-gutters>
      <v-col v-for="(item, index) in items" :key="index" cols="12">
        <v-btn
          :plain="selected != index ? true : false"
          @click="select(index)"
          x-large
          elevation="4"
          color="success"
          class="mb-4 py-3"
          width="100%"
        >
          <v-icon left v-text="item.icon" x-large></v-icon>
          <div class="ml-4">{{ item.name }}</div>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      items: [
        {
          name: "Shipping Car",
          value: "car",
          icon: "mdi-dolly",
        },
        {
          name: "Shipping Freight",
          value: "freight",
          icon: "mdi-truck",
        },
        {
          name: "Moving",
          value: "move",
          icon: "mdi-rv-truck",
        },
        {
          name: "Power Only",
          value: "po",
          icon: "mdi-truck-flatbed",
        },
      ],
      selected: -1,
    };
  },
  methods: {
    select(index) {
      this.selected = index;
      this.$emit("onChange", this.items[index].value);
    },
  },
};
</script>
