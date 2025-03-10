<script setup>
import {useNotificationStore} from "./stores/notification";
const notificationStore = useNotificationStore();

</script>

<template>
<ErrorNotify v-if="notificationStore.visible && notificationStore.isError"></ErrorNotify>  
<SuccessNotify v-if="notificationStore.visible && notificationStore.isSuccess"></SuccessNotify>
<router-view></router-view>
</template>

<style scoped>

</style>
