<template>
  <div class="text-center">
    <v-dialog max-width="500" transition="dialog-bottom-transition">
      <template v-slot:activator="{ props: activatorProps }">
        <img
          src="../../../assets/imgs/delete.png"
          alt="Delete"
          class="ma-2 cursor-pointer"
          style="width: 30px; height: 30px"
          v-bind="activatorProps"
        />
      </template>

      <template v-slot:default="{ isActive }">
        <v-card :loading="loading" elevation="8" rounded="lg">
          <v-card-title class="bg-red-darken-2 white--text py-4 px-6">
            <v-icon color="white" class="mr-2">mdi-delete</v-icon>
            {{ t("deleteDialog.title") || "Confirm Deletion" }}
          </v-card-title>
          <v-card-text class="pt-6 px-6 text-grey-darken-1 text-body-1">
            {{
              t("deleteDialog.title") ||
              "Are you sure you want to delete this item?"
            }}
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <OutlinedButton
              color="grey"
              width="100"
              height="40"
              rounded
              @click="isActive.value = false"
              class="mx-2"
            >
              {{ t("actions.cancel") || "Cancel" }}
            </OutlinedButton>
            <MainButton
              color="error"
              variant="flat"
              width="100"
              height="40"
              rounded
              @click="deleteRecord(isActive)"
              :loading="loading"
              class="mx-2"
            >
              {{ t("actions.delete") || "Delete" }}
            </MainButton>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script setup>
import { inject, ref } from "vue";
import { useApi } from "../../../composables/api";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const loading = ref(false);

const props = defineProps({
  record: {
    type: Object,
    required: true,
  },
  resource: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["item-deleted"]);

const emitter = inject("emitter");
const { DELETE } = useApi();

async function deleteRecord(isActive) {
  loading.value = true;
  try {
    await DELETE(`/admin-panel/${props.resource}/${props.record.id}`);
    isActive.value = false;
    emitter.emit("reload");
    emit("item-deleted");
  } catch (error) {
    console.error(`Error deleting ${props.resource}:`, error);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.cursor-pointer:hover {
  transform: scale(1.1);
}
</style>
