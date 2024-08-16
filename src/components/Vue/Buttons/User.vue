<script setup lang="ts">
  import type { WithId } from 'mongodb';
  import { onMounted, ref, type Ref } from 'vue';

  const user: Ref<WithId<PublicUserDoc> | null> = ref(null);

  onMounted(async () => {
    const response = await fetch('/api/auth/verifyUser/all');
    if (response.status !== 200) return;

    user.value = await response.json();
  });
</script>

<template>
  <a href="/user" class="group relative ml-6 flex items-center justify-center space-x-2 p-1.5 transition-transform ease-in hover:scale-110 sm:ml-8">
    <i v-if="!user" class="fa-light fa-user h-8 w-8 transition-colors ease-in group-hover:text-MonteCarlo-300 md:h-[2.5rem] md:w-[2.5rem]"></i>
    <img v-else :src="user.pfp.uri" alt="Profile pic" class="h-8 w-8 rounded-md md:h-[2.5rem] md:w-[2.5rem]" />
    <span class="absolute right-1/2 top-[3.5rem] origin-center translate-x-1/2 scale-0 rounded border border-SpringWood-50/50 bg-Woodsmoke-800 object-center px-0.5 font-Playpen text-[10px] font-thin transition-transform delay-150 duration-100 ease-linear group-hover:scale-100 group-hover:delay-700">User</span>
  </a>
</template>
