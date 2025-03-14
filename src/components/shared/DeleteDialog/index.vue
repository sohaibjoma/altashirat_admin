<template>
  <div class="text-center">
    <v-dialog max-width="800">
      <template v-slot:activator="{ props: activatorProps }">
        <img
          src="../../../assets/imgs/delete.png"
          alt="Delete"
          class="v-toolbar__avatar me-2 cursor-pointer p-0"
          v-bind="activatorProps"
          text="Open Dialog"
        />
      </template>

      <template v-slot:default="{ isActive }">
        <v-card title="Are you sure you want to delete this item?">
          <template v-slot:text> </template>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text="Cancel"
              variant="text"
              @click="isActive.value = false"
            ></v-btn>

            <v-btn
              color="error-text"
              text="Delete"
              variant="flat"
              @click="deleteRecord"
              :loading="loading"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script setup>
import { inject, ref } from "vue";
import { useApi } from "../../../composables/api";

const isActive = ref(false);

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

const emitter = inject("emitter");
const { DELETE } = useApi();

async function deleteRecord() {
  try {
    await DELETE(`/admin-panel/${props.resource}/${props.record.id}`);
    isActive.value = false;
    emitter.emit("reload");
  } catch (error) {
    console.error(`Error deleting ${props.resource}:`, error);
  }
}
</script>
