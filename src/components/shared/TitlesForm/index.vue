<template>
  <v-layout class="d-flex align-center bg-gray">
    <v-container class="mt-16">
      <v-card class="mt-64 pt-8 pb-8 w-75 ms-auto me-auto">
        <h1 class="text-start border-s-xl ps-3 text-h4 border-secondary">
          {{ $t("titles.title") }}
        </h1>

        <Form v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(generateData)">
            <textInput
              v-model="data.title"
              :label="$t('titles.title')"
              :rules="[(value) => !!value || 'alpha']"
              :hint="$t('titles.titleHint')"
              type="text"
              name="title"
               @input="console.log('Title input:', data.title)"
            />
            <visible
              v-model="data.visible"
              rules="required"
              :label="$t('titles.visible')"
              :hint="$t('titles.visiblityiHint')"
            ></visible>
            <div v-if="isEdit" class="ms-4 mt-8 font-weight-bold">
              {{ $t("actions.language") }}
            </div>
            <localeSelector
              v-if="isEdit"
              v-model="data.locale"
            ></localeSelector>

            <div class="text-end mt-8 ps-8">
              <mainButton
                color="primary"
                width="135px"
                class="me-5"
                type="submit"
              >
                {{ isEdit ? $t("titles.edit") : $t("titles.create") }}
              </mainButton>
            </div>
          </form>
        </Form>
      </v-card>
    </v-container>
  </v-layout>
</template>

<script setup>
import { Form } from "vee-validate";
import { useRouter, useRoute } from "vue-router";
import { useApi } from "../../../composables/api";
import { ref, onMounted } from "vue";

const { POST, PUT, GET } = useApi();
const router = useRouter();
const route = useRoute();
const isEdit = ref(false);
const id = ref(route.params.id);

const data = ref({
  title: "",
  visible: false, // Visibility
  locale: "en", // Language selection
});


onMounted(async () => {
  console.log(route.params.id);
  if (id.value) {
    isEdit.value = true;
    try {
      const response = await GET(`/admin-panel/titles/${id.value}`);
      console.log("Fetched Data:", response.data);

      // Ensure reactive update
      Object.assign(data.value, {
        title: response.data.name || "",
        visible: response.data.visible === "1" || response.data.visible === true, 
        locale: response.data.locale || "en",
      });

      console.log("Updated Data in Reactive State:", data.value);
    } catch (error) {
      console.error("Error fetching title:", error);
    }
  }
});


// Prepare form data
const createFormData = () => {
  const formData = new FormData();
  formData.append("name", data.value.title);
  formData.append("visible", data.value.visible ? "1" : "0");
  formData.append("locale", "en");
  return formData;
};


const updateFormData = () => {
  const formData = new FormData();
  formData.append("name", data.value.title);
  formData.append("visible", data.value.visible ? "1" : "0");
  formData.append("locale", data.value.locale);
  formData.append("_method", "put");
  return formData;
};

const generateData = async () => {
  try {
    console.log(data.value);
    if (isEdit.value) {
      await POST(`/admin-panel/titles/${id.value}`, updateFormData());
    } else {
      await POST("/admin-panel/titles", createFormData());
    }
    router.push("/titles");
  } catch (error) {
    console.error("Error creating entry:", error);
  }
};
</script>
