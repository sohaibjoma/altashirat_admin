<template>
  <div>
    <div v-if="label" class="ms-4 mt-8 mb-2 font-weight-bold">
      {{ label }}
    </div>
    <v-date-input
      v-model="dateModel"
      prepend-icon=""
      prepend-inner-icon="$calendar"
      :error="!!errorMessage"
      :error-messages="errorMessage"
      :hint="hint"
      persistent-hint
      variant="outlined"
      class="ms-5 me-5"
      :menu-props="{ contentClass: 'date-picker-menu' }"
      @blur="validateOnImmediate"
      @update:model-value="updateDate"
      open-on-click
    ></v-date-input>
  </div>
</template>

<script setup>
import { useField } from "vee-validate";
import { computed, ref, watch } from "vue";

const props = defineProps({
  rules: {
    type: [Array, Function, String],
    default: () => [],
  },
  hint: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Date, Number, null],
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

const { value, errorMessage, setTouched, validate } = useField(
  props.name,
  props.rules
);

const internalDate = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    internalDate.value = newVal;
  },
  { immediate: true }
);

const dateModel = computed({
  get: () => {
    return internalDate.value;
  },
  set: (newValue) => {
    internalDate.value = newValue;
  },
});

const updateDate = (newDate) => {
  value.value = newDate;
  emit("update:modelValue", newDate);
};

const validateOnImmediate = () => {
  setTouched(true);
  validate();
};
</script>

<style>
</style>
