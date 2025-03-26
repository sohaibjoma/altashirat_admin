<template>
  <div>
    <Field
      :name="name"
      :rules="rules"
      v-slot="{ field, errorMessage }"
      :validateOnInput="true"
    >
      <v-checkbox
        v-bind="field"
        :model-value="modelValue"
        @update:modelValue="handleInput"
        color="secondary"
        :label="label"
        hide-details
        :true-value="1"
        :false-value="0"
      ></v-checkbox>
      <span v-if="errorMessage || apiError" class="error-message">
        {{ errorMessage || backendErrors[0] }}
      </span>
    </Field>
    <p class="input__description">{{ inputDescription }}</p>
  </div>
</template>

<script setup>
import { Field } from "vee-validate";
import { computed } from "vue";
import { useErrorStore } from "../../../../stores/errors";

const errorStore = useErrorStore();

const props = defineProps({
  id: String,
  label: String,
  inputDescription: String,
  name: {
    type: String,
    required: true,
  },
  rules: {
    type: String,
  },
  modelValue: {
    type: [Number],
    default: 0,
  },
});

const emit = defineEmits(["update:modelValue"]);

const backendErrors = computed(() => errorStore.getErrorsForField(props.name));

const handleInput = (value) => {
  emit("update:modelValue", value);
};
</script>