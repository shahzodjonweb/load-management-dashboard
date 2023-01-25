export const validation = {
  required: (v) => !!v || "This field is required",
  email: (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
  phoneRules: [
    (v) => !!v || "This field is required",
    (v) => Number.isInteger(Number(v)) || "The value must be an integer number",
    (v) => v > 0 || "The value must be greater than zero",
    (v = 0) => v.toString().length === 10 || "The value must be 10 digits",
  ],
  aggree: (v) => !!v || "You must agree to the terms and conditions",
};
