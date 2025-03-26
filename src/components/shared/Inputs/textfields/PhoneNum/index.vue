<template>
  <div>
    {{ label }}
  </div>
  <v-text-field
    v-model="internalValue"
    :error="!!errorMessage"
    :error-messages="errorMessage"
    variant="outlined"
    type="text"
    :hint="hint"
    class="ms-5 w-75"
    persistent-hint
    @blur="validateOnImmediate"
  ></v-text-field>
</template>

<script setup>
import { useField } from "vee-validate";
import { computed, watch } from "vue";

const props = defineProps({
  rules: [Array, Function],
  hint: String,
  name: String,
  label: String,
  modelValue: [String, Number],
});

const emit = defineEmits(["update:modelValue"]);

const { value, errorMessage, setTouched, validate } = useField(
  props.name,
  props.rules,
  {
    validateOnValueUpdate: false, // Don't validate on value changes
    validateOnMount: false        // Don't validate on component mount
  }
);

const internalValue = computed({
  get: () => props.modelValue || value.value,
  set: (newValue) => {
    value.value = newValue;
    emit("update:modelValue", newValue);
  },
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== undefined && newVal !== value.value) {
      value.value = newVal;
    }
  },
  { immediate: true }
);

const validateOnImmediate = () => {
  setTouched(true);
  validate();
};
</script>
