<template>
  <div class="pa-4 pr-3-4">
    <v-card class="mb-6 py-2 px-2 elevation-2">
      <v-card-title
        class="text-h5 font-weight-bold text-align-center justify-center"
      >
        {{ $t("tourism_visa.details") }}
      </v-card-title>
      <v-card-text>
        <div class="d-flex flex-column mx-2">
          <v-row v-if="isLoading">
            <v-col cols="12" class="text-center">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
              <div class="mt-2">Loading tourism visa data...</div>
            </v-col>
          </v-row>

          <v-row v-else-if="!hasData">
            <v-col cols="12" class="text-center">
              <div class="text-subtitle-1">
                No data available or failed to load data.
              </div>
              <custom-button
                color="primary"
                width="150px"
                height="40px"
                fontSize="14px"
                class="mt-4"
                @click="retryFetch"
              >
                {{ $t("common.retry") }}
              </custom-button>
            </v-col>
          </v-row>

          <v-row v-else>
            <!-- Personal Information Section -->
            <v-col cols="12">
              <div class="text-subtitle-1 font-weight-bold mb-3 primary--text">
                {{ $t("tourism_visa.personal_info") }}
              </div>
            </v-col>

            <v-col cols="12" sm="6">
              <v-row>
                <v-col cols="12" md="6" class="py-2">
                  <div class="text-subtitle-2 font-weight-medium">
                    {{ $t("tourism_visa.firstname") }}
                  </div>
                  <div>
                    {{
                      tourismVisaData.firstname || $t("common.not_available")
                    }}
                  </div>
                </v-col>

                <v-col cols="12" md="6" class="py-2">
                  <div class="text-subtitle-2 font-weight-medium">
                    {{ $t("tourism_visa.middlename") }}
                  </div>
                  <div>
                    {{
                      tourismVisaData.middlename || $t("common.not_available")
                    }}
                  </div>
                </v-col>

                <v-col cols="12" md="6" class="py-2">
                  <div class="text-subtitle-2 font-weight-medium">
                    {{ $t("tourism_visa.birthdate") }}
                  </div>
                  <div>
                    {{
                      tourismVisaData.birthdate || $t("common.not_available")
                    }}
                  </div>
                </v-col>

                <v-col cols="12" md="6" class="py-2">
                  <div class="text-subtitle-2 font-weight-medium">
                    {{ $t("tourism_visa.gender") }}
                  </div>
                  <div>
                    {{
                      getGenderText(tourismVisaData.gender) ||
                      $t("common.not_available")
                    }}
                  </div>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" sm="6">
              <v-row>
                <v-col cols="12" md="6" class="py-2">
                  <div class="text-subtitle-2 font-weight-medium">
                    {{ $t("tourism_visa.lastname") }}
                  </div>
                  <div>
                    {{ tourismVisaData.lastname || $t("common.not_available") }}
                  </div>
                </v-col>
                <v-col cols="12" md="6" class="py-2">
                  <div class="text-subtitle-2 font-weight-medium">
                    {{ $t("tourism_visa.nationality") }}
                  </div>
                  <div>
                    {{
                      tourismVisaData.nationality?.name ||
                      $t("common.not_available")
                    }}
                  </div>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-divider class="my-4"></v-divider>
            </v-col>

            <!-- Passport Information Section -->
            <v-col cols="12">
              <div class="text-subtitle-1 font-weight-bold mb-3 primary--text">
                {{ $t("tourism_visa.passport_info") }}
              </div>
            </v-col>

            <v-col cols="12" md="3" class="py-2">
              <v-row>
                <v-col cols="12" class="py-2">
                  <div class="text-subtitle-2 font-weight-medium">
                    {{ $t("tourism_visa.passport_number") }}
                  </div>
                  <div>
                    {{
                      tourismVisaData.passport_number ||
                      $t("common.not_available")
                    }}
                  </div>
                </v-col>
              </v-row>
            </v-col>

            <!-- Vertically Aligned Field (Passport Image) -->
            <v-col cols="12" sm="6">
              <v-row>
                <v-col cols="12" class="py-2">
                  <div class="text-subtitle-2 font-weight-medium">
                    {{ $t("tourism_visa.passport_image") }}
                  </div>
                  <div
                    v-if="
                      tourismVisaData.passport_images &&
                      tourismVisaData.passport_images.length > 0
                    "
                    class="mt-2"
                  >
                    <v-img
                      :src="tourismVisaData.passport_images[0].path"
                      height="80"
                      max-width="120"
                      contain
                      class="grey lighten-2 rounded"
                    ></v-img>
                  </div>
                  <div v-else class="text-body-2 grey--text">
                    {{ $t("tourism_visa.no_passport_image") }}
                  </div>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-divider class="my-4"></v-divider>
            </v-col>

            <!-- Contact Information Section -->
            <v-col cols="12">
              <div class="text-subtitle-1 font-weight-bold mb-3 primary--text">
                {{ $t("tourism_visa.contact_info") }}
              </div>
            </v-col>

            <v-col cols="12" md="3" class="py-2" sm="6">
              <v-row>
                <v-col cols="12" class="py-2">
                  <div class="text-subtitle-2 font-weight-medium">
                    {{ $t("tourism_visa.email") }}
                  </div>
                  <div>
                    {{
                      tourismVisaData.contact_email ||
                      $t("common.not_available")
                    }}
                  </div>
                </v-col>
              </v-row>
            </v-col>

            <!-- Vertically Aligned Field (Phone Number) -->
            <v-col cols="12" sm="6">
              <v-row>
                <v-col cols="12" class="py-2">
                  <div class="text-subtitle-2 font-weight-medium">
                    {{ $t("tourism_visa.phone") }}
                  </div>
                  <div>
                    {{
                      formatPhoneNumber(tourismVisaData.phone) ||
                      $t("common.not_available")
                    }}
                  </div>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <v-divider class="my-4"></v-divider>
            </v-col>

            <!-- Visit Information Section -->
            <v-col cols="12">
              <div class="text-subtitle-1 font-weight-bold mb-3 primary--text">
                {{ $t("tourism_visa.visit_info") }}
              </div>
            </v-col>

            <v-col cols="12" md="3" class="py-2">
              <div class="text-subtitle-2 font-weight-medium">
                {{ $t("tourism_visa.purpose_of_visit") }}
              </div>
              <div>
                {{
                  tourismVisaData.purpose_of_visit || $t("common.not_available")
                }}
              </div>
            </v-col>

            <v-col cols="12" md="3" class="py-2">
              <div class="text-subtitle-2 font-weight-medium">
                {{ $t("tourism_visa.adults_count") }}
              </div>
              <div>
                {{ tourismVisaData.adults_count || $t("common.not_available") }}
              </div>
            </v-col>

            <v-col cols="12" md="3" class="py-2">
              <div class="text-subtitle-2 font-weight-medium">
                {{ $t("tourism_visa.children_count") }}
              </div>
              <div>
                {{
                  tourismVisaData.children_count || $t("common.not_available")
                }}
              </div>
            </v-col>

            <v-col cols="12" md="2" class="py-2">
              <div class="text-subtitle-2 font-weight-medium">
                {{ $t("tourism_visa.destination_country") }}
              </div>
              <div>
                {{
                  tourismVisaData.destination_country?.name ||
                  $t("common.not_available")
                }}
              </div>
            </v-col>

            <v-col cols="12" md="4" class="py-2">
              <div class="text-subtitle-2 font-weight-medium">
                {{ $t("tourism_visa.message") }}
              </div>
              <div class="mt-1 pa-2 rounded bg-grey-lighten-4">
                {{ tourismVisaData.message || $t("common.no_message") }}
              </div>
            </v-col>
            <v-col cols="12">
              <v-divider class="my-4"></v-divider>
            </v-col>

            <!-- Status Section -->
            <v-col cols="12">
              <div class="text-subtitle-1 font-weight-bold mb-3 primary--text">
                {{ $t("tourism_visa.status") }}
              </div>
            </v-col>

            <v-col cols="12" sm="6" class="py-2">
              <div class="text-subtitle-2 font-weight-medium">
                {{ $t("tourism_visa.current_status") }}
              </div>
              <v-chip
                v-if="activeStatus"
                :color="activeStatus.color"
                text-color="white"
                small
                class="mt-1"
              >
                {{ activeStatus.name }}
              </v-chip>
              <div v-else class="text-body-2 grey--text">
                {{ $t("common.not_available") }}
              </div>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
      <v-card>
        <v-card-title>{{ $t("tourism_visa.update_status") }}</v-card-title>
        <v-card-text>
          <Select
            v-model="status"
            :label="$t('visible')"
            :placeholder="$t('selectVisibility')"
            :items="[
              { text: $t('visible'), value: 1 },
              { text: $t('hidden'), value: 0 },
            ]"
            name="visible"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- <custom-button color="secondary"
            width="120px" height="40px" fontSize="14px" @click="statusDialog =
            false">
            {{ $t("common.cancel") }}
        
          </custom-button>
          <custom-button
            v-if="tourismVisaData.can_update_status"
            color="success"
            width="150px"
            height="40px"
            fontSize="14px"
            @click="openStatusUpdateDialog"
            :disabled="isUpdating || !tourismVisaData.can_update_status"
          >
            {{ $t("common.update_status") }}
          </custom-button>  -->

          <MainButton
            type="submit"
            color="secondary"
            width="120"
            height="40"
            class="mx-2"
            :loading="loading"
          >
            {{ t("actions.update_status") }}
          </MainButton>
        </v-card-actions>
      </v-card>
    </v-card>

    <div class="d-flex justify-end flex-wrap gap-2">
      <!-- <custom-button
        color="primary"
        width="120px"
        height="40px"
        fontSize="14px"
        @click="goBack"
      >
       
      </custom-button> -->
      <custom-button
        v-if="tourismVisaData.can_update_status"
        color="success"
        width="150px"
        height="40px"
        fontSize="14px"
        @click="openStatusUpdateDialog"
        :disabled="isUpdating || !tourismVisaData.can_update_status"
      >
        {{ $t("common.update_status") }}
      </custom-button>
    </div>

    
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, computed, onMounted } from "vue";
import { useEventBus } from "../../../composables/eventBus";
import { useNotificationStore } from "../../../stores/notification";
import { useI18n } from "vue-i18n";
import { useApi } from "../../../composables/api";
const status = ref("");
const route = useRoute();
const router = useRouter();
const tourismVisaData = ref({});
const notificationStore = useNotificationStore();
const eventBus = useEventBus();
const { t } = useI18n();
const { GET, PUT } = useApi();

const isLoading = ref(false);
const isUpdating = ref(false);
const statusDialog = ref(false);
const selectedStatus = ref(null);
const fetchError = ref(null);
const showDebug = ref(true); // Set to false in production

// Computed property to check if we have data
const hasData = computed(() => {
  return tourismVisaData.value && Object.keys(tourismVisaData.value).length > 0;
});

// Get the active status from the statuses array
const activeStatus = computed(() => {
  if (!tourismVisaData.value || !tourismVisaData.value.statuses) return null;
  return tourismVisaData.value.statuses.find(
    (status) => status.active === true
  );
});

// Status options dynamically generated from the response
const statusOptions = computed(() => {
  if (!tourismVisaData.value || !tourismVisaData.value.statuses) return [];
  return tourismVisaData.value.statuses;
});

const latestStatus = computed(() => {
  if (!tourismVisaData.value || !tourismVisaData.value.statuses || tourismVisaData.value.statuses.length === 0) {
    return null;
  }
  
  // Filter active statuses
  const activeStatuses = tourismVisaData.value.statuses.filter(status => status.active === true);
  
  if (activeStatuses.length === 0) {
    // If no active status, return first status (or null)
    return tourismVisaData.value.statuses[0]?.id || null;
  }
  
  if (activeStatuses.length === 1) {
    // If only one active status, return it
    return activeStatuses[0].id;
  }
  
  // Multiple active statuses - sort by activated_at timestamp (most recent first)
  const sortedByDate = [...activeStatuses].sort((a, b) => {
    // Handle null activated_at values
    if (!a.activated_at) return 1;
    if (!b.activated_at) return -1;
    
    // Compare dates (newer first)
    return new Date(b.activated_at) - new Date(a.activated_at);
  });
  
  // Return the most recently activated status ID
  return sortedByDate[0].id;
});

const getGenderText = (genderCode) => {
  switch (genderCode) {
    case 0:
      return t("gender.male");
    case 1:
      return t("gender.female");
    case 2:
      return t("gender.other");
    default:
      return t("common.not_available");
  }
};

const formatPhoneNumber = (phoneObj) => {
  if (!phoneObj?.country_code || !phoneObj?.number) return null;
  return `${phoneObj.country_code} ${phoneObj.number}`;
};

const fetchTourismVisa = async () => {
  isLoading.value = true;
  fetchError.value = null;

  try {
    console.log("Fetching tourism visa data for ID:", route.params.id);
    const response = await GET(`/admin-panel/tourism-visa/${route.params.id}`);

    console.log("API Response:", response);

    if (response && response.data && response.data.tourism_visa) {
      console.log("Tourism visa data received:", response.data.tourism_visa);
      tourismVisaData.value = response.data.tourism_visa;
      console.log("Processed tourism visa data:", tourismVisaData.value);

      // Set the selected status to the active one
      if (activeStatus.value) {
        selectedStatus.value = activeStatus.value.id;
      }
    } else {
      console.error("No tourism_visa data in response");
      fetchError.value = "No tourism_visa data returned from API";
      showError("notifications.tourism_visa_load_error");
    }
  } catch (error) {
    console.error("Error fetching tourism visa:", error);
    fetchError.value = error.message || "Error fetching data";
    showError("notifications.tourism_visa_load_error");
  } finally {
    isLoading.value = false;
  }
};

const retryFetch = () => {
  fetchTourismVisa();
};

const openStatusUpdateDialog = () => {
  if (activeStatus.value) {
    selectedStatus.value = activeStatus.value.id;
  }
  statusDialog.value = true;
};

const updateStatus = async () => {
  statusDialog.value = false;
  isUpdating.value = true;

  try {
    await PUT(`/admin-panel/tourism-visa/${route.params.id}/status`, {
      status_id: selectedStatus.value,
    });

    // Refresh the data to get the updated status
    await fetchTourismVisa();

    notificationStore.setNotification(
      t("notifications.tourism_visa_updated"),
      "success"
    );
    eventBus.emit("tourism-visa-updated");
  } catch (error) {
    showError("notifications.tourism_visa_update_error");
  } finally {
    isUpdating.value = false;
  }
};

const goBack = () => {
  router.push({ name: "tourism-visa-list" }); // Adjust the route name according to your route configuration
};

const showError = (messageKey) => {
  notificationStore.setNotification(t(messageKey), "error");
};

onMounted(() => {
  console.log("Component mounted");

  if (route.params.id) {
    console.log("Route ID found:", route.params.id);
    fetchTourismVisa();
  } else {
    console.warn("No route ID parameter found");
  }
});
</script>

<style scoped>
/* Enhance responsiveness for smaller screens */
@media (max-width: 600px) {
  .pa-4 {
    padding: 8px !important;
  }
  .v-card-title {
    font-size: 1.25rem !important;
  }
  .v-btn {
    width: 100% !important;
    margin-bottom: 8px;
  }
  .gap-2 {
    gap: 8px !important;
  }
}
</style>
