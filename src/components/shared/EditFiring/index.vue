<template>
  <img
    src="../../../assets/imgs/rename.png"
    alt=""
    class="v-toolbar__avatar me-2 cursor-pointer mt-3"
    @click="editTitle(title.id)"
  />
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  title: Object,
});

function editTitle(id) {
  router.push(`/titles/${id}/edit`);
}
</script>
