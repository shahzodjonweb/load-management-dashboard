<template>
  <div>
    <v-col cols="12">
      <v-col>
        <v-textarea
          @input="updateInfo()"
          v-model="description"
          name="input-7-4"
          label="Description of shipment"
        ></v-textarea>
      </v-col>
      <v-col>
        <v-text-field
          @input="updateInfo()"
          v-model="phone"
          type="text"
          prefix="+1"
          oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
          maxlength="10"
          placeholder="Phone Number"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          @input="updateInfo()"
          v-model="price"
          prefix="$"
          min="50"
          oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
          maxlength="6"
          placeholder="Enter your budget"
        ></v-text-field>
      </v-col>
    </v-col>
  </div>
</template>
<script>
export default {
  data() {
    return {
      description: "",
      phone: "",
      price: null,
    };
  },
  methods: {
    updateInfo() {
      const payload = {
        description: this.description,
        phone: this.phone,
        initial_price: this.price,
      };
      this.$emit("onChange", payload);
    },
  },
};
</script>
