<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://cn.vuejs.org/api/sfc-script-setup.html#script-setup
// import { nextTick, ref, watchEffect } from 'vue';
import UserManagement from './components/UserManagement.vue';

// const count = ref<number>(0);
// const count2 = ref<number>(0);


// watchEffect(() => {
//   if(!count.value){
//     return;
//   }

//   console.log(count.value);
//   console.log(count2.value);
//   setTimeout(() => {
//     count2.value++;
//   }, 1000);
// });

// count.value++;
</script>

<template>
  <Suspense>
    <a-space direction="vertical">
      <UserManagement />
    </a-space>
  </Suspense>
</template>

<style>
body {
  padding: 15px;
}
</style>
