<template>
  <div class="ms-4 mt-8 font-weight-bold">
    {{ label }}
  </div>
  <v-textarea
    v-model="internalValue"
    :error="!!errorMessage"
    :error-messages="errorMessage"
    variant="outlined"
    :hint="hint"
    persistent-hint
    @blur="validateOnImmediate"
    rows="4"
    auto-grow
  ></v-textarea>
</template>
<script setup>
import { useField } from "vee-validate";
import { computed } from "vue";
const props = defineProps({
  rules: [Array, Function],
  hint: String,
  name: String,
  label: String,
  modelValue: String,
});
const emit = defineEmits(["update:modelValue"]);
const { value, errorMessage, setTouched, validate } = useField(
  props.name,
  props.rules
);
const internalValue = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    value.value = newValue;
    emit("update:modelValue", newValue);
  },
});
const validateOnImmediate = () => {
  setTouched(true);
  validate();
};
</script>