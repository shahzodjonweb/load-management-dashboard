<template>
  <div>
    <slot :onClick="onClick" name="button"> </slot>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="success" dark @click="handleClick"> Save </v-btn>
        </v-toolbar>
        <slot></slot>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "Settings",
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    onClick() {
      this.dialog = true;
    },
    handleClick() {
      this.$emit("onSave");
      this.dialog = false;
    },
  },
};
</script>
