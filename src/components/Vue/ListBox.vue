<script setup lang="ts">
  import type { WithId } from 'mongodb';
  import { onMounted, ref, type Ref } from 'vue';

  const props = defineProps<{
    baseUrl: string;
  }>();

  const lists: Ref<WithId<listDoc[]> | undefined> = ref();
  const fetchDone = ref(false);

  onMounted(async () => {
    const response = await fetch('/api/list/getMany');
    if (response.status !== 200) {
      window.location.assign(new URL('/signin', props.baseUrl));
      return;
    }

    const tempLists: WithId<listDoc[]> = await response.json();
    if (tempLists.length === 0) return;

    lists.value = tempLists;
    fetchDone.value = true;
  });
</script>

<template>
  <div class="mt-3">
    <ul v-if="lists" class="flex h-full space-x-4">
      <li v-for="list in lists" :style="{ borderColor: list.color }" class="flex h-72 w-48 flex-col rounded border-2 py-0.5">
        <span class="truncate px-2 pb-1 font-Playpen text-2xl font-light tracking-wide">{{ list.name }}</span>
        <ul class="border-y border-y-SpringWood-50/35 px-2 py-1">
          <li class="flex items-center">
            <i class="fa-solid fa-sharp fa-heart text-BiFlag-Pink h-4 w-4"></i>
            <span>: {{ list.likes }}</span>
          </li>
          <li class="flex items-center justify-between py-1">
            <div class="flex items-center">
              <i class="fa-light fa-eye h-4 w-4"></i>
              <span>: {{ list.views }}</span>
            </div>
            <div>
              <span v-if="list.public">(Public)</span>
              <span v-else>(Private)</span>
            </div>
          </li>
          <li class="flex items-center">
            <i class="fa-solid fa-books h-4 w-4"></i>
            <span>: {{ list.books.length }}</span>
          </li>
        </ul>
        <menu class="grid grow grid-cols-2 grid-rows-2">
          <li class="flex items-center justify-center">
            <a :href="`/list/${list._id}`" class="flex items-center justify-center p-1.5 transition-all ease-in hover:scale-110 hover:text-MonteCarlo-300">
              <i class="fa-light fa-arrow-up-right-from-square h-8 w-8"></i>
            </a>
          </li>
          <li class="flex items-center justify-center">
            <button disabled class="flex cursor-not-allowed items-center justify-center p-1.5 opacity-60">
              <i class="fa-light fa-edit h-8 w-8"></i>
            </button>
          </li>
          <li class="flex items-center justify-center">
            <button disabled class="flex cursor-not-allowed items-center justify-center p-1.5 opacity-60">
              <i class="fa-light fa-share-nodes h-8 w-8"></i>
            </button>
          </li>
          <li class="flex items-center justify-center">
            <button disabled class="flex cursor-not-allowed items-center justify-center p-1.5 opacity-60">
              <i class="fa-light fa-trash h-8 w-8"></i>
            </button>
          </li>
        </menu>
      </li>
    </ul>
    <p v-if="fetchDone && !lists" class="text-xl">You don't have any lists! Create one with the "<span class="text-MonteCarlo-300">New</span>" button!</p>
  </div>
</template>
