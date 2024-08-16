<script setup lang="ts">
  import type { WithId } from 'mongodb';
  import { onMounted, ref, type Ref } from 'vue';

  const props = defineProps<{
    baseUrl: string;
  }>();

  const lists: Ref<WithId<listDoc[]> | undefined> = ref();

  onMounted(async () => {
    const response = await fetch('/api/list/getMany');
    if (response.status !== 200) {
      window.location.assign(new URL('/signin', props.baseUrl));
      return;
    }

    lists.value = await response.json();
    console.log(lists.value);
  });
</script>

<template>
  <ul v-if="lists" class="mt-3 flex h-full space-x-4">
    <li v-for="list in lists" :style="{ borderColor: list.color }" class="flex aspect-[2/3] h-full w-36 flex-col rounded border-2 py-0.5">
      <span class="truncate border-b border-b-SpringWood-50/35 px-2 pb-1 font-Playpen text-2xl font-light tracking-wide">{{ list.name }}</span>
      <div class="px-2 pt-1">
        <i class="fa-solid fa-sharp fa-heart text-BiFlag-Pink h-4 w-4"></i>
        <span>: {{ list.likes }}</span>
      </div>
      <div class="px-2 pt-1">
        <i class="fa-light fa-eye h-4 w-4"></i>
        <span>: {{ list.views }}</span>
      </div>
      <div class="px-2 pt-1">
        <i class="fa-solid fa-books h-4 w-4"></i>
        <span>: {{ list.books.length }}</span>
      </div>
    </li>
  </ul>
</template>
