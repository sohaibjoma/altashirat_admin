<template>
  <div class="mx-8">
    <v-card class="mb-6 py-2 elevation-2">
      <v-card-title
        class="font-weight-bold text-align-center pink-border justify-center"
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
          <v-row>
            <!-- Personal Information Section -->
            <v-col cols="12">
              <h3 class="font-weight-bold mb-3">
                {{ $t("tourism_visa.personal_info") }}
              </h3>
            </v-col>

            <v-col cols="12" sm="6">
              <v-row>
                <v-col cols="12" md="6" class="py-2">
                  <div class="font-weight-medium">
                    {{ $t("tourism_visa.firstname") }}
                  </div>
                  <div>
                    {{
                      tourismVisaData.firstname || $t("common.not_available")
                    }}
                  </div>
                </v-col>

                <v-col cols="12" md="6" class="py-2">
                  <div class="font-weight-medium">
                    {{ $t("tourism_visa.middlename") }}
                  </div>
                  <div>
                    {{
                      tourismVisaData.middlename || $t("common.not_available")
                    }}
                  </div>
                </v-col>

                <v-col cols="12" md="6" class="py-2">
                  <div class="font-weight-medium">
                    {{ $t("tourism_visa.birthdate") }}
                  </div>
                  <div>
                    {{
                      tourismVisaData.birthdate || $t("common.not_available")
                    }}
                  </div>
                </v-col>

                <v-col cols="12" md="6" class="py-2">
                  <div class="font-weight-medium">
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
                  <div class="font-weight-medium">
                    {{ $t("tourism_visa.lastname") }}
                  </div>
                  <div>
                    {{ tourismVisaData.lastname || $t("common.not_available") }}
                  </div>
                </v-col>
                <v-col cols="12" md="6" class="py-2">
                  <div class="font-weight-medium">
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
              <h3 class="font-weight-bold mb-3">
                {{ $t("tourism_visa.passport_info") }}
              </h3>
            </v-col>

            <v-col cols="12" md="3" class="py-2">
              <v-row>
                <v-col cols="12" class="py-2">
                  <div class="font-weight-medium">
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
                  <div class="font-weight-medium">
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
                  <div v-else class="text-gray-3">
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
              <h3 class="font-weight-bold mb-3">
                {{ $t("tourism_visa.contact_info") }}
              </h3>
            </v-col>

            <v-col cols="12" md="3" class="py-2" sm="6">
              <v-row>
                <v-col cols="12" class="py-2">
                  <div class="font-weight-medium">
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
                  <div class="font-weight-medium">
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
              <h3 class="font-weight-bold mb-3">
                {{ $t("tourism_visa.visit_info") }}
              </h3>
            </v-col>

            <v-col cols="12" md="3" class="py-2">
              <div class="font-weight-medium">
                {{ $t("tourism_visa.purpose_of_visit") }}
              </div>
              <div>
                {{
                  tourismVisaData.purpose_of_visit || $t("common.not_available")
                }}
              </div>
            </v-col>

            <v-col cols="12" md="3" class="py-2">
              <div class="font-weight-medium">
                {{ $t("tourism_visa.adults_count") }}
              </div>
              <div>
                {{ tourismVisaData.adults_count || $t("common.not_available") }}
              </div>
            </v-col>

            <v-col cols="12" md="3" class="py-2">
              <div class="font-weight-medium">
                {{ $t("tourism_visa.children_count") }}
              </div>
              <div>
                {{
                  tourismVisaData.children_count || $t("common.not_available")
                }}
              </div>
            </v-col>

            <v-col cols="12" md="2" class="py-2">
              <div class="font-weight-medium">
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
              <div class="font-weight-medium">
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
              <h3 class="font-weight-bold">
                {{ $t("tourism_visa.status") }}
              </h3>
            </v-col>

            <v-col cols="12" sm="4" class="py-2">
              <div class="font-weight-medium">
                {{ $t("tourism_visa.current_status") }}
              </div>
              <v-chip
                v-if="latestStatus"
                color="gray"
                text-color="white"
                small
                class="mt-1"
              >
                {{ latestStatus }}
              </v-chip>
              <div v-else class="text-gray-3">
                {{ $t("common.not_available") }}
              </div>
            </v-col>
            <v-col cols="12" md="8">
              <v-card class="pa-4">
                <v-card-title>{{
                  $t("tourism_visa.update_status")
                }}</v-card-title>
                <v-card-text>
                  <Form
                    v-slot="{ handleSubmit }"
                    :initial-values="formValues"
                    ref="form"
                  >
                    <v-form @submit.prevent="handleSubmit(updateStatus)">
                      <Select
                        v-model="selectedStatus"
                        :label="$t('visible')"
                        :items="[
                          { text: $t('Statuses.Pending'), value: '1' },
                          { text: $t('Statuses.Reviewing'), value: '2' },
                          { text: $t('Statuses.Accepted'), value: '3' },
                          { text: $t('Statuses.Rejected'), value: '4' },
                        ]"
                        name="status"
                      />
                      <div class="d-flex justify-end px-10">
                        <MainButton
                          type="submit"
                          color="primary"
                          width="150px"
                          height="40px"
                          fontSize="14px"
                          :disabled="
                            isUpdating || !tourismVisaData.can_update_status
                          "
                        >
                          {{ $t("common.update_status") }}
                        </MainButton>
                      </div>
                    </v-form>
                  </Form>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { Form } from "vee-validate";

import { useRoute } from "vue-router";
import { ref, computed, onMounted } from "vue";

import { useEventBus } from "../../../composables/eventBus";
import { useNotificationStore } from "../../../stores/notification";
import { useI18n } from "vue-i18n";
import { useApi } from "../../../composables/api";

const notificationStore = useNotificationStore();
const eventBus = useEventBus();
const { t } = useI18n();
const { GET, POST } = useApi();

const route = useRoute();
const tourismVisaData = ref({});

const isLoading = ref(false);
const isUpdating = ref(false);
const selectedStatus = ref("");

const latestStatus = computed(() => {
  if (
    !tourismVisaData.value ||
    !tourismVisaData.value.statuses ||
    tourismVisaData.value.statuses.length === 0
  ) {
    return null;
  }

  const activeStatuses = tourismVisaData.value.statuses.filter(
    (status) => status.active === true
  );

  if (activeStatuses.length === 0) {
    // If no active status, return first status (or null)
    return tourismVisaData.value.statuses[0]?.name || null;
  }

  if (activeStatuses.length === 1) {
    // If only one active status, return it
    return activeStatuses[0].name;
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
  return sortedByDate[0].name;
});
//form data formating start
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
// form data formatting end

const fetchTourismVisa = async () => {
  isLoading.value = true;

  try {
    const response = await GET(`/admin-panel/tourism-visa/${route.params.id}`);

    if (response && response.data && response.data.tourism_visa) {
      tourismVisaData.value = response.data.tourism_visa;

      // Set the selected status after the data is available
      if (latestStatus.value) {
        selectedStatus.value = latestStatus.value;
      }
    } else {
      console.error("No tourism_visa data in response");
    }
  } catch (error) {
    console.error("Error fetching tourism visa:", error);
  } finally {
    isLoading.value = false;
  }
};

const TourismFormData = () => {
  const formData = new FormData();
  formData.append("status", selectedStatus.value);
  formData.append("_method", "patch");
  return formData;
};

const updateStatus = async () => {
  isUpdating.value = true;

  try {
    await POST(
      `/admin-panel/tourism-visa/${route.params.id}`,
      TourismFormData()
    );
    await fetchTourismVisa();

    notificationStore.setNotification(
      t("notifications.tourism_visa_updated"),
      "success"
    );
    eventBus.emit("tourism-visa-updated");
  } catch (error) {
    console.log("error posting data");
  } finally {
    isUpdating.value = false;
  }
};

onMounted(() => {
  fetchTourismVisa();
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
  .gap-2 {
    gap: 8px !important;
  }
}
</style>
