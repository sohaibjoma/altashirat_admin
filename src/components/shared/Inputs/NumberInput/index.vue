<template>
  <div class="ms-4 mt-8 mb-2 font-weight-bold">
    {{ label }}
  </div>
  <v-text-field
    v-model="internalValue"
    :error="!!errorMessage"
    :error-messages="errorMessage"
    variant="outlined"
    :type="number"
    :hint="hint"
    persistent-hint
    class="ms-5 me-5"
    @blur="validateOnImmediate"
  ></v-text-field>
</template>

<script setup>
import { useField } from "vee-validate";
import { computed } from "vue";

const props = defineProps({
  rules: [Array, Function],
  hint: String,
  name: String,
  type: String,
  label: String,
  modelValue: [String, Number],
});

const emit = defineEmits(["update:modelValue"]);

const { value, errorMessage, setTouched, validate } = useField(
  props.name,
  props.rules
);

const internalValue = computed({
  get: () => props.modelValue?.toString() || '',
  set: (newValue) => {
    const numericValue = newValue === '' ? null : Number(newValue);
    value.value = numericValue;
    emit("update:modelValue", numericValue);
  },
});

const validateOnImmediate = () => {
  setTouched(true);
  validate();
};
</script>