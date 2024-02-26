<script setup lang="ts">
  defineProps<{
    url: string;
    icon: string;
  }>();
</script>

<template>
  <NuxtLink :to="url" class="hover:drop-shadow-navBtn drop-shadow-none transition-all duration-200 ease-out hover:scale-[1.15] hover:text-tiff-200">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-10 w-10">
      <path stroke-linecap="round" stroke-linejoin="round" :d="icon" />
    </svg>
  </NuxtLink>
</template>
