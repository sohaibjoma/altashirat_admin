<template>
  <div>
    <OutlinedButton icon color="primary" variant="text" @click="openDialog">
      <v-icon>mdi-account-box-outline</v-icon>
    </OutlinedButton>

    <v-dialog
      v-model="dialog"
      max-width="800px"
      transition="dialog-bottom-transition"
    >
      <v-card class="profile-card">
        <div class="profile-header-wrapper">
          <div class="profile-header-bg"></div>
          <v-card-title class="profile-header text-center pa-0">
            <OutlinedButton
              icon
              variant="text"
              color="white"
              class="profile-close-btn"
              @click="dialog = false"
              :aria-label="t('users.close')"
            >
              <v-icon>mdi-close</v-icon>
            </OutlinedButton>

            <v-avatar size="100" color="primary" class="profile-avatar">
              <span class="white--text text-h4 font-weight-bold">
                {{ getInitial(userData?.username) }}
              </span>
            </v-avatar>

            <h2 class="text-white">
              {{ userData?.username || t("users.profile_title") }}
            </h2>

            <div v-if="userData?.roles?.length">
              <v-chip
                v-for="(role, i) in visibleRoles"
                :key="i"
                size="small"
                color="white"
                class="ma-1"
              >
                <v-icon start size="x-small">mdi-shield</v-icon>
                {{ role.name }}
              </v-chip>
              <v-chip
                v-if="additionalRolesCount > 0"
                size="small"
                color="grey-lighten-3"
                text-color="primary"
                class="ma-1"
              >
                +{{ additionalRolesCount }}
              </v-chip>
            </div>
          </v-card-title>
        </div>

        <v-card-text class="profile-body pt-2 pb-0">
          <div v-if="loading" class="profile-loader">
            <div class="loader-animation">
              <div class="loader-circle"></div>
              <div class="loader-circle"></div>
              <div class="loader-circle"></div>
            </div>
            <p class="mt-4 text-body-1 text-medium-emphasis">
              {{ t("users.loading_profile") }}
            </p>
          </div>

          <div v-else-if="userData">
            <!-- Personal Info Section -->
            <div class="profile-section">
              <div class="d-flex align-center mt-2 mb-2">
                <v-icon color="primary" class="me-1"
                  >mdi-account-details</v-icon
                >
                <h4 class="text-primary">{{ t("users.personal_info") }}</h4>
              </div>

              <div class="profile-data-grid">
                <!-- Full Name -->
                <div class="pa-3">
                  <div class="d-flex align-center">
                    <v-icon size="small" color="primary" class="me-1"
                      >mdi-account</v-icon
                    >
                    {{ t("actions.fullName") }}
                  </div>
                  <div class="d-flex align-center">
                    <span>{{ fullName }}</span>
                    <v-chip
                      v-if="userData.full_name"
                      :color="
                        userData.full_name_verified ? 'success' : 'warning'
                      "
                      size="small"
                      class="mx-2"
                    >
                      <v-icon size="small" class="me-1">
                        {{
                          userData.full_name_verified
                            ? "mdi-check-circle"
                            : "mdi-alert-circle"
                        }}
                      </v-icon>
                      {{
                        userData.full_name_verified
                          ? t("users.verified")
                          : t("users.not_verified")
                      }}
                    </v-chip>
                  </div>
                </div>

                <!-- Email -->
                <div class="pa-3">
                  <div class="d-flex align-center">
                    <v-icon size="small" color="primary" class="me-1"
                      >mdi-email</v-icon
                    >
                    {{ t("actions.email") }}
                  </div>
                  <div class="d-flex align-center">
                    <span>{{ userData.email || "—" }}</span>
                    <v-chip
                      v-if="userData.email"
                      :color="userData.email_verified ? 'success' : 'warning'"
                      size="small"
                      class="mx-2"
                    >
                      <v-icon size="small" class="me-1">
                        {{
                          userData.email_verified
                            ? "mdi-check-circle"
                            : "mdi-alert-circle"
                        }}
                      </v-icon>
                      {{
                        userData.email_verified
                          ? t("users.verified")
                          : t("users.not_verified")
                      }}
                    </v-chip>
                  </div>
                </div>

                <!-- Phone -->
                <div class="pa-3">
                  <div class="d-flex align-center">
                    <v-icon size="small" color="primary" class="me-1"
                      >mdi-phone</v-icon
                    >
                    {{ t("actions.phoneno") }}
                  </div>
                  <div class="d-flex align-center">
                    <span>{{ formattedPhone }}</span>
                    <v-chip
                      v-if="userData.phone"
                      :color="userData.phone_verified ? 'success' : 'warning'"
                      size="small"
                      class="mx-2"
                    >
                      <v-icon size="small" class="me-1">
                        {{
                          userData.phone_verified
                            ? "mdi-check-circle"
                            : "mdi-alert-circle"
                        }}
                      </v-icon>
                      {{
                        userData.phone_verified
                          ? t("users.verified")
                          : t("users.not_verified")
                      }}
                    </v-chip>
                  </div>
                </div>

                <!-- Country -->
                <div class="pa-3">
                  <div class="d-flex align-center">
                    <v-icon size="small" color="primary" class="me-1"
                      >mdi-flag</v-icon
                    >
                    {{ t("users.country") }}
                  </div>
                  <div class="d-flex align-center">
                    <span v-if="userData.country" class="country-value">
                      <span class="country-flag me-1">{{
                        userData.country.flag
                      }}</span>
                      {{ userData.country.name }}
                    </span>
                    <span v-else>—</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Roles Section -->
            <div
              v-if="userData.roles?.length"
              class="profile-section roles-section mt-6"
            >
              <div class="d-flex align-center mt-2 mb-2">
                <v-icon color="primary" class="me-1">mdi-shield-account</v-icon>
                <h4 class="text-primary">{{ t("users.roles") }}</h4>
              </div>
              <div class="roles-container">
                <v-chip
                  v-for="(role, i) in userData.roles"
                  :key="i"
                  color="primary"
                  variant="flat"
                  class="role-chip ma-1"
                  size="small"
                >
                  <v-icon start size="small">mdi-shield</v-icon>
                  {{ role.name }}
                </v-chip>
              </div>
            </div>

            <!-- Account Status Section -->
            <div class="profile-section status-section mt-6">
              <div class="d-flex align-center mt-2 mb-2">
                <v-icon color="primary" class="me-1">mdi-account-cog</v-icon>
                <h4 class="text-primary">{{ t("users.account_status") }}</h4>
              </div>
              <div class="status-container">
                <div
                  class="status-box"
                  :class="userData.blocked ? 'blocked' : 'active'"
                >
                  <v-icon
                    :color="userData.blocked ? 'error' : 'success'"
                    size="large"
                    class="me-1"
                  >
                    {{
                      userData.blocked
                        ? "mdi-account-lock"
                        : "mdi-account-check"
                    }}
                  </v-icon>
                  <div>
                    {{
                      userData.blocked ? t("users.blocked") : t("users.active")
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="profile-empty-state">
            <v-icon size="80" color="grey-lighten-1"
              >mdi-account-question</v-icon
            >
            <h3 class="text-h6 mt-4 mb-2">{{ t("users.no_data_title") }}</h3>
            <p class="text-body-1 text-medium-emphasis">
              {{ t("users.no_data") }}
            </p>
          </div>
        </v-card-text>

        <v-card-actions class="profile-actions pa-4">
          <v-spacer></v-spacer>
          <OutlinedButton
            color="primary"
            rounded
            width="120"
            @click="dialog = false"
            class="close-button"
          >
            {{ t("users.close") }}
          </OutlinedButton>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useApi } from "../../../composables/api";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  userId: { type: [Number, String], required: true },
  preload: { type: Boolean, default: false },
});

const { GET, loading } = useApi();
const dialog = ref(false);
const userData = ref(null);

const visibleRoles = computed(() => userData.value?.roles?.slice(0, 2) || []);
const additionalRolesCount = computed(() =>
  userData.value?.roles?.length > 2 ? userData.value.roles.length - 2 : 0
);
const fullName = computed(() => {
  if (!userData.value) return "—";
  return (
    `${userData.value.firstname || ""} ${userData.value.middlename || ""} ${
      userData.value.lastname || ""
    }`.trim() || "—"
  );
});
const formattedPhone = computed(() => {
  if (!userData.value?.phone) return "—";
  return `${userData.value.phone.country_code} ${userData.value.phone.number}`;
});

const getInitial = (username) => username?.charAt(0).toUpperCase() || "?";

const openDialog = async () => {
  dialog.value = true;
  if (!userData.value) await fetchUserData();
};

const fetchUserData = async () => {
  try {
    const response = await GET(`/admin-panel/users/${props.userId}`);
    userData.value = response?.data?.user;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

onMounted(() => {
  if (props.preload) fetchUserData();
});
</script>
