<template>
  <Form v-slot="{ handleSubmit }" :initial-values="initialFormData">
    <form @submit.prevent="handleSubmit(formSubmitting)">
      <!-- Edit Profile Fields -->
      <TextInput
        v-model="formData.firstname"
        rules="required|alpha"
        :label="$t('profile.firstname')"
        :hint="$t('inputs.names.firstHint')"
        name="firstname"
      />

      <TextInput
        v-model="formData.middlename"
        rules="required|alpha"
        :label="$t('profile.middlename')"
        :hint="$t('inputs.names.middleHint')"
        name="middlename"
      />

      <TextInput
        v-model="formData.lastname"
        rules="required|alpha"
        :label="$t('profile.lastname')"
        :hint="$t('inputs.names.lastHint')"
        name="lastname"
      />

      <TextInput
        v-model="formData.email"
        rules="required|email"
        :label="$t('profile.email')"
        :hint="$t('inputs.email')"
        name="email"
      />

      <DateInput
        v-model="formData.birthdate"
        :label="$t('profile.birthDate')"
        name="birth_date"
        :hint="$t('inputs.birthdate.hint')"
      />

      <div class="ms-4 mt-8 font-weight-bold">
        {{ $t("login.phone") }}
      </div>

      <div class="d-flex gap-0">
        <PhoneNum
          v-model="formData.phoneNumber"
          rules="required|phoneno"
          :hint="$t('inputs.phoneno.hint')"
          name="phone.number"
        />
        <PhoneCode
          v-model="formData.phoneCode"
          rules="required"
          name="phone[country_code]"
        />
      </div>

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
import { reactive, computed, watch, ref } from "vue";
import { useAuthStore } from "../../../../stores/auth";

const authStore = useAuthStore();
const userData = computed(() => authStore.user);
const loading = ref(false);

const formData = reactive({
  firstname: "",
  middlename: "",
  lastname: "",
  email: "",
  phoneNumber: "",
  phoneCode: "",
  birthdate: null,
});

const initialFormData = computed(() => {
  const user = userData.value?.user || userData.value || {};
  const birthdate = user.birthdate ? new Date(user.birthdate) : null;

  return {
    firstname: user.firstname || "",
    middlename: user.middlename || "",
    lastname: user.lastname || "",
    email: user.email || "",
    "phone.number": user.phone?.number || "",
    "phone[country_code]": user.phone?.country_code || "",
    birthdate: birthdate,
  };
});

watch(
  () => userData.value,
  (newUserData) => {
    if (newUserData) {
      const user = newUserData.user || newUserData;
      const birthdate = user.birthdate ? new Date(user.birthdate) : null;

      formData.firstname = user.firstname || "";
      formData.middlename = user.middlename || "";
      formData.lastname = user.lastname || "";
      formData.email = user.email || "";
      formData.phoneNumber = user.phone?.number || "";
      formData.phoneCode = user.phone?.country_code || "";
      formData.birthdate = birthdate;
    }
  },
  { immediate: true }
);

const emit = defineEmits(["submit"]);

const retrievedData = () => {
  let formattedBirthdate = formData.birthdate;

  if (formData.birthdate instanceof Date) {
    formattedBirthdate = formData.birthdate.toISOString().split("T")[0];
  }

  return {
    firstname: formData.firstname,
    middlename: formData.middlename,
    lastname: formData.lastname,
    email: formData.email,
    phone: {
      number: formData.phoneNumber,
      country_code: formData.phoneCode,
    },
    birthdate: formattedBirthdate,
  };
};

async function formSubmitting(values, { setErrors }) {
  loading.value = true;
  try {
    const payload = retrievedData();
    console.log("Payload:", payload);
    emit("submit", payload, setErrors);
  } catch (error) {
    console.error("Form submission error:", error);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
