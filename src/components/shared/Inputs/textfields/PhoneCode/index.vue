<template>
  <Field :name="name" :rules=rules v-slot="{ field, errors }">
    <v-select
      v-bind="field"
      v-model="phoneCode"
      @update:modelValue="emit('update:modelValue', $event)"
      variant="outlined"
      :items="itemsArr"
      item-title="code" 
      item-value="code"
      class="custom-select me-5 rounded-e-lg"
      :error="errors.length"
      :error-messages="errors"
    >
      <!-- Format selected item (Only show the flag) -->
      <template v-slot:selection="{ item }">
        <span>{{ item.raw.code || "966 SA" }}</span>
        <span class="phone__flag">{{ item.raw.flag }}</span>
      </template>

      <template v-slot:item="{ props, item }">
        <v-list-item v-bind="props" class="dropdown-item">
          <template v-slot:append>
            <span class="phone__flag">{{ item.raw.flag }}</span>
          </template>
        </v-list-item>
      </template>
    </v-select>
  </Field>
</template>

<script setup>
import { Field } from "vee-validate";
import { ref, defineProps, defineEmits, onMounted,computed, inject } from "vue";
import { useCountriesStore } from "../../../../../stores/countries"; // Adjust path if needed


const props = defineProps([
  "modelValue",
  "rules",
  "name"
]);
const emit = defineEmits(["update:modelValue"]);

// Fetch countries and set itemsArr
onMounted(async () => {
  await countriesStore.fetchAllCountries();
  itemsArr.value = countriesStore.getCountryCodes(); // ✅ Correctly structured
});

// Initialize phone code with default value
const phoneCode = ref(props.modelValue || "SA 966");

// Pinia store
const countriesStore = useCountriesStore();
const itemsArr = ref([]);

</script>

<style scoped>
/* Target only the select input field */
.v-select :deep(.v-input__control) {
  background-color: var(--primary);
  border-radius: inherit;
  color: white;
}

/* Ensure the text inside the dropdown stays white */
.v-select :deep(.v-select-list) {
  color: white;
}

/* Style the selected item text */
.v-select :deep(.v-input__control) input {
  color: white;
}

.v-select :deep(.v-field) {
  border-radius: 10px 0 0 10px !important;
}

/* Adjust the outline to match the border-radius */
.v-select :deep(.v-field__outline) {
  border-radius: 10px 0 0 10px !important;
}
</style>
