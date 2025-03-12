<template>
    <div class="ms-4 mt-8 font-weight-bold">
    {{ label }}
  </div>
  <Field 
    :name="name" 
    :rules="rules" 
    v-slot="{ field, errors }"
  >
    <v-select
      v-bind="field"
      :error-messages="[
        ...errors.map((error) => $t(error)),
        ...backendErrors,
      ]"
      variant="outlined"
      :placeholder="defaultDisplay"
      :items="items"
      :hint="hint"
      persistent-hint
      item-value="val"
      item-title="text"
      class="mt-5 me-2 ms-5 me-5"
      base-color="primary"
      @update:model-value="handleLocaleChange"
      :model-value="modelValue"
    >
      <template #prepend-inner>
        <div class="d-flex align-center">
          <Image
            name="locale.svg"
            alt="localization-icon"
            class="v-toolbar__avatar"
          />
        </div>
      </template>
    </v-select>
  </Field>
</template>

<script setup>
import { Field } from "vee-validate";
import { useLocaleStore } from "../../../../store/locale";
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useErrorStore } from "../../../../../stores/errors";

const errorStore = useErrorStore();
const { t } = useI18n();
const localeStore = useLocaleStore();

const backendErrors = computed(() => errorStore.getErrorsForField(props.name));

// Initialize display based on stored locale
const defaultDisplay = ref(
  localStorage.getItem("locale") === "ar" ? t("languages.ar") : t("languages.en")
);

const emit = defineEmits(["update:modelValue"]);

const items = ref([
  { val: "en", text: t("languages.en") },
  { val: "ar", text: t("languages.ar") },
]);

// Handle locale change
const handleLocaleChange = (newLocale) => {
  localeStore.setLocale(newLocale); 
  emit("update:modelValue", newLocale); 
};

defineProps({
  hint: String,
  name: String,
  modelValue: String,
  rules: String,
  label: String
});
</script>
