<template>
  <img
    src="../../../assets/imgs/rename.png"
    alt="Edit"
    class=" me-2 cursor-pointer mt-3"
    @click="editRecord(props.record.id)"
  />
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  record: {
    type: Object,
    required: true,
  },
  resource: {
    type: String,
    required: true,
    default: "titles",
  },
});

function editRecord(id) {
  router.push(`/${props.resource}/${id}/edit`);
}
</script>
