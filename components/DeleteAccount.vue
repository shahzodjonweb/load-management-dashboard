<template>
  <div class="p-6 bg-white shadow-lg">
    <div class="text_2xl font-medium">Delete your account</div>
    <br />
    <div>
      <div class="pb-4 text_lg font-bold text-red-500">
        Be careful, this action is irreversible. All of your account and order
        data will be deleted.
      </div>
      <v-row>
        <v-btn class="mx-3" color="error" dark @click.stop="dialog = true">
          Delete account
        </v-btn>

        <v-dialog v-model="dialog" max-width="290">
          <v-card>
            <v-card-title class="text-h5">
              Are you sure to delete your account?
            </v-card-title>

            <v-card-text>
              After deleting your account, you will not be able to recover it.
              All of your account and order data will be deleted.
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="green darken-1" text @click="dialog = false">
                Close
              </v-btn>

              <v-btn
                color="red darken-1"
                text
                :loading="loading"
                @click="
                  dialog = false;
                  __deleteUser();
                "
              >
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </div>
  </div>
</template>
<script>
import { deleteUser } from "~/api/load";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { STORAGE_KEY } from "~/core/constants.js";
import cookie from "js-cookie";

export default {
  name: "EditUserAccount",
  data() {
    return {
      loading: false,
      dialog: false,
    };
  },
  methods: {
    async __deleteUser() {
      try {
        this.loading = true;
        await deleteUser();
        this.$notifier.showMessage({
          content: "Your account deleted successfully",
          color: "success",
        });
        this.loading = false;
        this.logout();
      } catch (error) {
        this.$notifier.showMessage({
          content:
            "You cannot delete your account while you have active orders",
          color: "error",
        });
        this.loading = false;
      }
    },
    logout() {
      GoogleAuth.signOut();
      cookie.remove(STORAGE_KEY);
      this.$router.push("/login");
    },
  },
};
</script>
