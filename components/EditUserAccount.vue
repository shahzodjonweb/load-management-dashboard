<template>
  <div class="p-6 bg-white shadow-lg">
    <div class="text_2xl font-medium">User info</div>
    <br />
    <v-form class="w-full" ref="form" v-model="valid" lazy-validation>
      <div class="text_xl mb-2 font-medium">Name</div>
      <v-text-field
        v-model="account.name"
        :rules="[validation['required']]"
        label="John Doe"
        required
        solo
      ></v-text-field>
      <div class="text_xl mb-2 font-medium">Email</div>
      <v-text-field
        v-model="account.email"
        :rules="[validation['required'], validation['email']]"
        label="support@gmail.com"
        required
        solo
      ></v-text-field>
      <div class="text_xl mb-2 font-medium">Phone</div>
      <v-text-field
        v-model="account.phone"
        prefix="+1"
        :rules="[validation['required'], ...validation['phoneRules']]"
        label="123 456 7890"
        oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
        required
        solo
      ></v-text-field>
    </v-form>
    <div>
      <v-btn
        :loading="loading"
        class="mt-2"
        color="success"
        @click="updateUser"
      >
        Update
      </v-btn>
    </div>
    <div v-if="!account.has_company" class="flex items-center space-x-2">
      <div>Are you business owner?</div>
      <v-switch
        v-model="hasCompany"
        flat
        :label="hasCompany ? 'Yes' : 'No'"
      ></v-switch>
    </div>
  </div>
</template>
<script>
import { userUpdate } from "~/api/auth";
import { validation } from "~/core/ruleMapper";

export default {
  name: "EditUserAccount",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      account: this.data,
      loading: false,
      valid: true,
      validation: validation,
      hasCompany: false,
    };
  },
  watch: {
    data: {
      handler: function (val) {
        this.account = val;
      },
      deep: true,
    },
    hasCompany(newValue) {
      this.hasCompany = newValue;
      this.$emit("onSwitchUserType", newValue);
    },
  },
  methods: {
    async updateUser() {
      try {
        if (!this.$refs.form.validate()) {
          return;
        }
        this.loading = true;
        await userUpdate({
          name: this.account.name,
          email: this.account.email,
          phone: this.account.phone,
        });

        this.$notifier.showMessage({
          content: "User updated successfully",
          color: "success",
        });
        this.$emit("onRefresh");
        this.loading = false;
      } catch (error) {
        this.$notifier.showMessage({
          content: "Error in updating user",
          color: "error",
        });
        this.loading = false;
      }
    },
  },
};
</script>
