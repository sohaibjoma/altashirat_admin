<template>
  <div>
    <div v-if="title" class="mb-2">
      {{ $t(title) }}
    </div>

    <Field v-slot="{ field, errors }" :name="name" :rules="rules">
      <v-select
        v-bind="field"
        :model-value="modelValue"
        :items="items"
        :placeholder="$t(placeholder)"
        :error-messages="[
          ...errors.map((error) => $t(error)),
          ...backendErrors,
        ]"
        variant="outlined"
        persistent-hint
        item-title="text"
        item-value="value"
        @update:model-value="emit('update:modelValue', $event)"
      >
        <template v-slot:selection="slotProps" v-if="$slots.selection">
          <slot name="selection" v-bind="slotProps"></slot>
        </template>
      </v-select>
    </Field>
  </div>
</template>

<script setup>
import { Field } from "vee-validate";
import { computed } from "vue";
import { useErrorStore } from "../../../../stores/errors";

const props = defineProps({
  title: { type: String, default: "" },
  label: { type: String, required: true },
  placeholder: { type: String, default: "" },
  hint: { type: String, default: "" },
  modelValue: { type: [String, Number], default: "" },
  items: { type: Array, default: () => [] },
  name: { type: String, required: true },
  rules: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);

const errorStore = useErrorStore();
const backendErrors = computed(() => errorStore.getErrorsForField(props.name));
</script>

<style scoped></style>
