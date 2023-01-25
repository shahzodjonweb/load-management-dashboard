<template>
  <v-chip :color="color" text-color="white">
    <v-avatar left>
      <v-icon>{{ icon }}</v-icon>
    </v-avatar>
    {{ text }}
  </v-chip>
</template>
<script>
export default {
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  computed: {
    color() {
      switch (this.status) {
        case "pending":
          return "orange";
        case "accepted":
          return "lime";
        case "started":
          return "green";
        case "rejected":
          return "red";
        case "completed":
          return "teal";
        case "invoiced":
          return "secondary";
        default:
          return "gray";
      }
    },
    text() {
      switch (this.status) {
        case "initial":
          return "Draft";
        case "pending":
          return "Pending";
        case "accepted":
          return "Accepted";
        case "started":
          return "Started";
        case "rejected":
          return "Rejected";
        case "completed":
          return "Completed";
        case "invoiced":
          return "Invoiced";
        default:
          return "Unknown";
      }
    },
    icon() {
      switch (this.status) {
        case "initial":
          return "mdi-file";
        case "pending":
          return "mdi-alarm";
        case "accepted":
          return "mdi-shield-check";
        case "started":
          return "mdi-timer-play";
        case "rejected":
          return "mdi-cancel";
        case "completed":
          return "mdi-checkbox-marked-circle";
        case "invoiced":
          return "mdi-text-box-check";
        default:
          return "mdi-checkbox-progress-alert";
      }
    },
  },
};
</script>
