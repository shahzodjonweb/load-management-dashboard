<template>
  <div class="p-6 bg-white shadow-lg">
    <v-form class="w-full" ref="form" v-model="valid" lazy-validation>
      <div class="text_2xl font-medium">Business info</div>
      <br />
      <div class="text_xl mb-2 font-medium">Company name *</div>
      <v-text-field
        v-model="name"
        :rules="[validation['required']]"
        label="Your company name"
        required
        solo
      ></v-text-field>
      <div class="text_xl mb-2 font-medium">Company address *</div>
      <v-text-field
        v-model="address"
        :rules="[validation['required']]"
        label="Lunt Ave, Chicago, IL 60613"
        required
        solo
      ></v-text-field>
      <div class="text_xl mb-2 font-medium">Business phone *</div>
      <v-text-field
        v-model="business_phone"
        prefix="+1"
        :rules="[validation['required'], ...validation['phoneRules']]"
        label="123 456 7890"
        oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
        placeholder="Enter your estimated rate"
        required
        solo
      ></v-text-field>
      <div class="text_xl mb-2 font-medium">Business email *</div>
      <v-text-field
        v-model="business_email"
        :rules="[validation['required'], validation['email']]"
        label="sales@company.com"
        required
        solo
      ></v-text-field>
      <div class="text_xl mb-2 font-medium">Tax Id</div>
      <v-text-field
        v-model="taxId"
        label="xxxxxxxxx"
        required
        solo
      ></v-text-field>
      <div class="text_xl mb-2 font-medium">Representative name *</div>
      <v-text-field
        v-model="representative_name"
        :rules="[validation['required']]"
        label="John Doe"
        required
        solo
      ></v-text-field>
      <div class="text_xl mb-2 font-medium">Representative position *</div>
      <v-text-field
        v-model="representative_position"
        :rules="[validation['required']]"
        label="CEO"
        required
        solo
      ></v-text-field>
      <hr class="my-4" />
      <div class="text_2xl font-medium">Sales info</div>
      <br />
      <div class="text_xl mb-2 font-medium">Sales person name *</div>
      <v-text-field
        v-model="sales_person_name"
        :rules="[validation['required']]"
        label="John Doe"
        required
        solo
      ></v-text-field>
      <div class="text_xl mb-2 font-medium">Sales phone *</div>
      <v-text-field
        v-model="sales_phone"
        prefix="+1"
        :rules="[validation['required'], ...validation['phoneRules']]"
        label="123 456 7890"
        oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
        placeholder="Enter your estimated rate"
        required
        solo
      ></v-text-field>
      <div class="text_xl mb-2 font-medium">Billing email *</div>
      <v-text-field
        v-model="sales_email"
        :rules="[validation['required'], validation['email']]"
        label="sales@company.com"
        required
        solo
      ></v-text-field>
      <div class="text_xl mb-2 font-medium">Billing address *</div>
      <v-text-field
        v-model="billing_address"
        :rules="[validation['required']]"
        label="Lunt Ave, Chicago, IL 60613"
        required
        solo
      ></v-text-field>
      <div class="text_xl mb-2 font-medium">Payment type</div>
      <v-select
        v-model="payment_type"
        :items="paymentTypes"
        label="Select payment type"
        required
        solo
      ></v-select>
      <!-- Aggrement -->
      <div v-if="!data.has_company" class="text_xl mb-2 font-medium">
        Agreement *
      </div>
      <v-checkbox
        v-if="!data.has_company"
        v-model="agreement"
        :rules="[validation['aggree']]"
        required
        solo
      >
        <template #label>
          <div>
            I agree to the
            <a target="_blank" href="https://vuetifyjs.com" @click.stop>
              terms and conditions
            </a>
          </div>
        </template>
      </v-checkbox>
    </v-form>
    <div>
      <v-btn
        :loading="loading"
        class="mt-2"
        color="success"
        @click="updateCompany"
      >
        Done
      </v-btn>
    </div>
  </div>
</template>
<script>
import { updateCompany } from "~/api/auth";
import { validation } from "~/core/ruleMapper";

export default {
  name: "EditCompanyInfo",
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      valid: true,
      validation: validation,
      hasCompany: true,
      taxId: "",
      name: "",
      address: "",
      business_phone: "",
      business_email: "",
      representative_name: "",
      representative_position: "",
      sales_person_name: "",
      sales_phone: "",
      sales_email: "",
      billing_address: "",
      payment_type: "",
      agreement: false,
      paymentTypes: [
        { text: "15 days", value: "15" },
        { text: "30 days", value: "30" },
        { text: "45 days", value: "45" },
      ],
    };
  },
  watch: {
    data: {
      handler: function (val) {
        this.updateCompanyOnchange(val);
      },
      deep: true,
    },
  },
  methods: {
    updateCompanyOnchange(val) {
      if (val.company) {
        this.taxId = val.company.tax_id;
        this.name = val.company.name;
        this.address = val.company.address;
        this.business_phone = val.company.business_phone;
        this.business_email = val.company.business_email;
        this.representative_name = val.company.representative_name;
        this.representative_position = val.company.representative_position;
        this.sales_person_name = val.company.sales_person_name;
        this.sales_phone = val.company.sales_phone;
        this.sales_email = val.company.sales_email;
        this.billing_address = val.company.billing_address;
        this.payment_type = val.company.payment_type;
      }
    },
    async updateCompany() {
      try {
        if (!this.$refs.form.validate()) {
          this.$notifier.showMessage({
            content: "Please fill all required fields",
            color: "error",
          });
          return;
        }
        this.loading = true;
        await updateCompany({
          tax_id: this.taxId,
          name: this.name,
          address: this.address,
          business_phone: this.business_phone,
          business_email: this.business_email,
          representative_name: this.representative_name,
          representative_position: this.representative_position,
          sales_person_name: this.sales_person_name,
          sales_phone: this.sales_phone,
          sales_email: this.sales_email,
          billing_address: this.billing_address,
          payment_type: this.payment_type,
          agreement: this.agreement,
        });

        this.$notifier.showMessage({
          content: "Company updated successfully",
          color: "success",
        });
        this.$emit("onRefresh");
        this.loading = false;
      } catch (error) {
        this.$notifier.showMessage({
          content: "Error in updating company",
          color: "error",
        });
        this.loading = false;
      }
    },
  },
  mounted() {
    this.updateCompanyOnchange(this.data);
  },
};
</script>
