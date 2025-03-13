<template>
  <div class="ms-4 mt-8 mb-4 font-weight-bold">
    {{ label }}
  </div>
  <Field :name="name" :rules="rules" v-slot="{ field, errors }">
    <v-text-field
      v-bind="field"
      :error-messages="[...errors.map((error) => $t(error)), ...backendErrors]"
      :label="hint"
      class="ms-5 me-5"
      variant="outlined"
      type="number"
      :min="min"
      :max="max"
      :step="step"
      :model-value="modelValue"
      @update:modelValue="onUpdate"
    ></v-text-field>
  </Field>
</template>

<script setup>
import { Field } from "vee-validate";
import { computed, watch } from "vue";
import { useErrorStore } from "../../../../stores/errors";

const errorStore = useErrorStore();
const backendErrors = computed(() => errorStore.getErrorsForField(props.name));

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: Number,
  rules: String,
  label: String,
  hint: String,
  name: String,
  min: Number,
  max: Number,
  step: Number,
});

const onUpdate = (value) => {
  emit("update:modelValue", Number(value));
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== undefined && newVal !== Number(props.modelValue)) {
      emit("update:modelValue", newVal);
    }
  }
);
</script>