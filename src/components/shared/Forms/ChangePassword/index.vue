<template>
  <Form v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(formSubmitting)">
      <Password
        v-model="data.old_password"
        rules="required|password"
        :label="$t('profile.old_password')"
        :hint="$t('inputs.password.hint')"
        name="old_password"
      />

      <Password
        v-model="data.new_password"
        rules="required|password"
        :label="$t('profile.new_password')"
        :hint="$t('inputs.password.newPassword')"
        name="new_password"
      />

      <ConfirmPassword
        v-model="data.new_password_confirmation"
        :label="$t('profile.confirm_password')"
        :hint="$t('inputs.password.hint')"
        name="new_password_confirmation"
        targetField="new_password"
      />

      <div class="text-end mt-8 ps-8">
        <MainButton
          color="secondary"
          width="135px"
          class="me-5"
          type="submit"
          :loading="loading"
        >
          {{ $t("save") }}
        </MainButton>
      </div>
    </form>
  </Form>
</template>

<script setup>
import { Form } from "vee-validate";
import { reactive, ref } from "vue";

const loading = ref(false);
const data = reactive({
  old_password: "",
  new_password: "",
  new_password_confirmation: "",
});

const emit = defineEmits(["submit"]);

async function formSubmitting(values, { setErrors }) {
  try {
    loading.value = true;
    emit("submit", values, setErrors);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
