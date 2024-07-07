<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue';

  const showNav = ref(true);
  let prevPos = 0;

  function onScoll() {
    const currPos = window.scrollY;

    if (prevPos < currPos) {
      showNav.value = false;
    } else if (prevPos > currPos) {
      showNav.value = true;
    }

    if (currPos <= 32) {
      showNav.value = true;
    } else if (document.body.scrollHeight - currPos <= window.innerHeight + 32) {
      showNav.value = false;
    }

    prevPos = currPos;
  }

  onMounted(() => {
    window.addEventListener('scroll', onScoll);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', onScoll);
  });
</script>

<template>
  <Transition name="fade">
    <nav v-if="showNav" class="fixed bottom-0 left-1/2 right-1/2 mb-4 flex w-fit -translate-x-1/2 items-center justify-center space-x-6 rounded-lg bg-Woodsmoke-900/80 px-8 py-1 sm:space-x-8 sm:px-12 md:hidden">
      <slot />
    </nav>
  </Transition>
</template>

<style>
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-to,
  .fade-leave-from {
    opacity: 100;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition-property: opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
  }
</style>
