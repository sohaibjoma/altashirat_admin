<template>
  <Field :name="name" :rules="rules" v-slot="{ field, errors }">
    <v-select
      v-bind="field"
      :model-value="selectedCountry"
      @update:model-value="handleCountryCodeUpdate"
      variant="outlined"
      :items="itemsArr"
      item-title="text"
      item-value="value"
      class="custom-select me-5 rounded-e-lg"
      :error="errors.length"
      :error-messages="errors"
    >
      <!-- Format selected item -->
      <template v-slot:selection="{ item }">
        <div class="d-flex align-center">
          <i :class="`fi fi-${getCountryCode(item)}`" class="w-10 me-1" />
          <span>(+{{ item.value }})</span>
        </div>
      </template>

      <!-- Format dropdown items -->
      <template v-slot:item="{ props, item }">
        <v-list-item v-bind="props" class="dropdown-item">
          <template v-slot:prepend>
            <div class="d-flex align-center">
              <i :class="`fi fi-${getCountryCode(item)}`" class="me-1" />
              <span class="me-2">(+{{ item.value }})</span>
            </div>
          </template>
          <v-list-item-title>
            {{ item.text }}
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-select>
  </Field>
</template>

<script setup>
import { Field } from "vee-validate";
import { ref, computed, onMounted, watch } from "vue";
import { useCountriesStore } from "../../../../../stores/countries";

const props = defineProps({
  modelValue: { type: [String, Number], default: "" },
  rules: { type: String, default: "" },
  name: { type: String, required: true },
});

const emit = defineEmits(["update:modelValue"]);

const countriesStore = useCountriesStore();
const itemsArr = ref([]);

onMounted(async () => {
  await countriesStore.fetchAllCountries();
  itemsArr.value = countriesStore.getCountryCodes();
  
  // Set default value to the first country code if modelValue is empty
  if (!props.modelValue && itemsArr.value.length > 0) {
    const firstCountryCode = itemsArr.value[0].value;
    const formattedValue = `00${firstCountryCode}`;
    emit("update:modelValue", formattedValue);
  }
});

const getCountryCode = (item) => {
  if (item && item.code) {
    return item.code;
  }
  if (item && item.raw && item.raw.code) {
    return item.raw.code;
  }
  return "";
};

const getNumericPart = (code) => {
  return code?.replace(/^\+|^00/, "") || "";
};

const selectedCountry = computed(() => {
  const numericPart = getNumericPart(props.modelValue);
  return numericPart;
});

const handleCountryCodeUpdate = (value) => {
  const numericValue = getNumericPart(value);
  const formattedValue = numericValue ? `00${numericValue}` : "";
  emit("update:modelValue", formattedValue);
};
</script>

<style scoped>
.v-select :deep(.v-input__control) {
  background-color: var(--primary);
  border-radius: inherit;
  color: white;
}
</style>
