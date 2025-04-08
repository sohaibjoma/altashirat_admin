<template>
  <div>
    <v-btn
      icon
      color="primary"
      variant="text"
      class="profile-btn"
      @click="openDialog"
    >
      <v-icon>mdi-eye</v-icon>
    </v-btn>

    <v-dialog
      v-model="dialog"
      max-width="700px"
      transition="dialog-bottom-transition"
      class="profile-dialog"
    >
      <v-card class="profile-card">
        <v-card-title class="profile-header">
          <v-avatar size="50" color="primary" class="mr-3">
            <span class="white--text text-h5">
              {{ userData?.username?.charAt(0).toUpperCase() || "?" }}
            </span>
          </v-avatar>
          <span class="font-weight-bold text-h5 ma-2">
            {{
              userData?.username || $t("users.profile_title", "User Profile")
            }}
          </span>
        </v-card-title>

        <v-card-text class="pt-6">
          <div v-if="loading" class="text-center">
            <v-progress-circular
              indeterminate
              color="primary"
              size="40"
            ></v-progress-circular>
          </div>
          <div v-else-if="userData" class="profile-content">
            <v-row>
              <v-col cols="12" md="6">
                <v-list dense class="transparent-bg">
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon color="primary">mdi-account</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{
                        $t("actions.fullName")
                      }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{
                          `${userData.firstname || ""} ${
                            userData.middlename || ""
                          } ${userData.lastname || ""}`.trim() || "N/A"
                        }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon color="primary">mdi-email</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{
                        $t("actions.email")
                      }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ userData.email || "N/A" }}
                        <v-chip
                          v-if="userData.email"
                          :color="
                            userData.email_verified ? 'success' : 'warning'
                          "
                          size="small"
                          class="ml-2"
                        >
                          {{
                            userData.email_verified
                              ? $t("users.verified", "Verified")
                              : $t("users.not_verified", "Not Verified")
                          }}
                        </v-chip>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>

              <v-col cols="12" md="6">
                <v-list dense class="transparent-bg">
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon color="primary">mdi-phone</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{
                        $t("actions.phoneno")
                      }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{
                          userData.phone
                            ? `${userData.phone.country_code} ${userData.phone.number}`
                            : "N/A"
                        }}
                        <v-chip
                          v-if="userData.phone"
                          :color="
                            userData.phone_verified ? 'success' : 'warning'
                          "
                          size="small"
                          class="ml-2"
                        >
                          {{
                            userData.phone_verified
                              ? $t("users.verified", "Verified")
                              : $t("users.not_verified", "Not Verified")
                          }}
                        </v-chip>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon color="primary">mdi-flag</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{
                        $t("users.country")
                      }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{
                          userData.country
                            ? `${userData.country.flag} ${userData.country.name}`
                            : "N/A"
                        }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>

            <v-row class="mt-2">
              <v-col cols="12">
                <v-divider class="my-4"></v-divider>
                <p class="text-subtitle-1 font-weight-medium mb-2">
                  {{ $t("users.roles", "Roles") }}
                </p>
                <v-chip-group>
                  <v-chip
                    v-for="(role, i) in userData.roles"
                    :key="i"
                    color="primary"
                    outlined
                    class="ma-1"
                  >
                    {{ role.name }}
                  </v-chip>
                  <span
                    v-if="!userData.roles?.length"
                    class="text-caption text-grey"
                  >
                    {{ $t("users.no_roles", "No roles assigned") }}
                  </span>
                </v-chip-group>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" class="text-center">
                <v-chip
                  :color="userData.blocked ? 'red' : 'green'"
                  class="mt-4"
                >
                  {{
                    userData.blocked
                      ? $t("users.blocked", "Blocked")
                      : $t("users.active", "Active")
                  }}
                </v-chip>
              </v-col>
            </v-row>
          </div>
          <div v-else class="text-center">
            <v-icon size="40" color="grey">mdi-alert-circle-outline</v-icon>
            <p class="mt-2">{{ $t("users.no_data", "No data available") }}</p>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <OutlinedButton color="primary" rounded width="100" @click="dialog = false">
            {{ $t("users.close", "Close") }}
          </OutlinedButton>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useApi } from "../../../composables/api";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  userId: {
    type: [Number, String],
    required: true,
  },
});

const { GET, loading } = useApi();
const dialog = ref(false);
const userData = ref(null);

const openDialog = async () => {
  dialog.value = true;
  if (!userData.value) {
    await fetchUserData();
  }
};

const fetchUserData = async () => {
  try {
    const response = await GET(`/admin-panel/users/${props.userId}`);
    if (response?.data) {
      userData.value = response.data.user;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
</script>

<style scoped></style>
