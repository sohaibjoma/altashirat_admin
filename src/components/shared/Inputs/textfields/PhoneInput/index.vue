<template>
  <div>
    <div v-if="label" class="mb-2 ms-4 mt-8 font-weight-bold text-text">
      {{ label }}
    </div>
    <div class="phone-input-container">
      <v-text-field
        :model-value="internalPhoneValue"
        @update:model-value="handlePhoneNumberUpdate"
        :error="!!phoneErrorMessage"
        :error-messages="phoneErrorMessage"
        variant="outlined"
        type="text"
        :placeholder="placeholder"
        :hint="hint"
        persistent-hint
        class="phone-field"
        @blur="validatePhoneOnImmediate"
      >
      </v-text-field>
      
      <div :class="locale==='ar'? 'country-code-container' : 'country-code-container-en'">
        <v-select
          :model-value="selectedCountry"
          @update:model-value="handleCountryCodeUpdate"
          :items="itemsArr"
          item-title="text"
          item-value="value"
          class="country-code-select"
          hide-details
          variant="outlined"
          :error="!!countryCodeErrorMessage"
          :error-messages="countryCodeErrorMessage"
        >
          <!-- Format selected item -->
          <template v-slot:selection="{ item }">
            <div class="d-flex align-center">
              <span>(+{{ item.value }})</span>
              <span v-if="useFlags" class="ms-1">
                <i :class="`fi fi-${getCountryCode(item)}`" class="w-10 me-1" />
              </span>
              <span v-else class="ms-1 flag-emoji">{{
                getFlagEmoji(getCountryCode(item))
              }}</span>
            </div>
          </template>

          <!-- Format dropdown items -->
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" class="dropdown-item">
              <template v-slot:prepend>
                <div class="d-flex align-center">
                  <span v-if="useFlags">
                    <i :class="`fi fi-${getCountryCode(item)}`" class="me-1" />
                  </span>
                  <span v-else class="flag-emoji me-1">{{
                    getFlagEmoji(getCountryCode(item))
                  }}</span>
                  <span class="me-2">(+{{ item.value }})</span>
                </div>
              </template>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useField } from "vee-validate";
import { ref, computed, onMounted, watch } from "vue";
import { useCountriesStore } from "../../../../../stores/countries"; // Adjust the path as needed

const locale = ref(localStorage.getItem("locale")||"en");


const props = defineProps({
  // Phone number props
  phoneNumberModelValue: { type: [String, Number], default: "" },
  phoneNumberName: { type: String, required: true },
  phoneNumberRules: { type: String, default: "" },

  // Country code props
  countryCodeModelValue: { type: [String, Number], default: "" },
  countryCodeName: { type: String, required: true },
  countryCodeRules: { type: String, default: "" },

  // Common props
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  hint: { type: String, default: "" },
  useFlags: { type: Boolean, default: true }, // Set to false to use emoji flags instead of flag-icons
});

const emit = defineEmits([
  "update:phoneNumberModelValue",
  "update:countryCodeModelValue",
]);

// Countries store for country codes
const countriesStore = useCountriesStore();
const itemsArr = ref([]);

// Set up validation for phone number using useField
const {
  value: phoneValue,
  errorMessage: phoneErrorMessage,
  setTouched: setPhoneTouched,
  validate: validatePhone,
} = useField(props.phoneNumberName, props.phoneNumberRules, {
  validateOnValueUpdate: false,
  validateOnMount: false,
});

// Set up validation for country code using useField
const {
  value: countryCodeValue,
  errorMessage: countryCodeErrorMessage,
  setTouched: setCountryCodeTouched,
  validate: validateCountryCode,
} = useField(props.countryCodeName, props.countryCodeRules, {
  validateOnValueUpdate: false,
  validateOnMount: false,
});

// Internal value for the phone number
const internalPhoneValue = computed({
  get: () => props.phoneNumberModelValue || phoneValue.value,
  set: (newValue) => {
    phoneValue.value = newValue;
    emit("update:phoneNumberModelValue", newValue);
  },
});

// Watch for phone number model value changes
watch(
  () => props.phoneNumberModelValue,
  (newVal) => {
    if (newVal !== undefined && newVal !== phoneValue.value) {
      phoneValue.value = newVal;
    }
  },
  { immediate: true }
);

// Handle phone number update
const handlePhoneNumberUpdate = (value) => {
  internalPhoneValue.value = value;
};

// Validate phone number on blur
const validatePhoneOnImmediate = () => {
  setPhoneTouched(true);
  validatePhone();
};

// Country code handling
onMounted(async () => {
  await countriesStore.fetchAllCountries();
  itemsArr.value = countriesStore.getCountryCodes();

  // Set default value to the first country code if modelValue is empty
  if (!props.countryCodeModelValue && itemsArr.value.length > 0) {
    const firstCountryCode = itemsArr.value[0].value;
    const formattedValue = `00${firstCountryCode}`;
    countryCodeValue.value = formattedValue; // Set initial value for country code
    emit("update:countryCodeModelValue", formattedValue);
  }
});

// Selected country code for v-select
const selectedCountry = computed({
  get: () => {
    const numericPart = getNumericPart(props.countryCodeModelValue);
    return numericPart;
  },
  set: (newValue) => {
    const formattedValue = newValue ? `00${newValue}` : "";
    countryCodeValue.value = formattedValue;
    emit("update:countryCodeModelValue", formattedValue);
  },
});

// Handle country code update
const handleCountryCodeUpdate = (value) => {
  selectedCountry.value = value;
  setCountryCodeTouched(true); // Mark as touched for validation
  validateCountryCode(); // Trigger validation
};

// Helper functions
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

const getFlagEmoji = (countryCode) => {
  if (!countryCode) return "";
  return String.fromCodePoint(
    ...countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt())
  );
};
</script>

<style scoped>
</style>