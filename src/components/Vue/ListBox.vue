<script setup lang="ts">
  import type { WithId } from 'mongodb';
  import { onMounted, ref } from 'vue';

  const props = defineProps<{
    baseUrl: string;
  }>();

  const lists = ref<WithId<listDoc>[]>([]);
  const fetchDone = ref(false);
  const modal = ref<HTMLDialogElement>();
  const listToDelete = ref<WithId<listDoc>>();
  const error = ref('');

  async function deleteList() {
    if (!listToDelete.value || !modal.value) {
      error.value = 'No list found';
      return;
    }

    const response = await fetch('/api/list', {
      method: 'delete',
      body: JSON.stringify({
        listId: listToDelete.value._id.toString(),
      }),
    });

    if (response.status !== 200) {
      error.value = 'Something went wrong';
      return;
    }

    modal.value.close();
    window.location.reload();
  }

  onMounted(async () => {
    const response = await fetch('/api/list/getMany');
    if (response.status !== 200) {
      window.location.assign(new URL('/signin', props.baseUrl));
      return;
    }

    const tempLists: WithId<listDoc>[] = await response.json();

    lists.value = tempLists;
    fetchDone.value = true;
  });
</script>

<template>
  <div class="mt-3">
    <dialog ref="modal" class="w-full space-y-3 rounded-md bg-Woodsmoke-900 px-4 py-3 text-SpringWood-50 drop-shadow-Modal backdrop:bg-Woodsmoke-950/60 backdrop:backdrop-blur-[1px] md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-5/12">
      <section class="flex items-center justify-between border-b border-b-SpringWood-50/50 px-4">
        <p class="text-xl tracking-tight md:text-4xl">
          <span>Delete list: </span>
          <span class="font-Playpen italic text-MonteCarlo-300">{{ listToDelete?.name }}</span>
        </p>
        <button @click="() => modal?.close()" class="group relative flex items-center justify-center space-x-2 p-1.5 transition-transform ease-in hover:scale-110">
          <i class="fa-light fa-xmark h-6 w-6 transition-colors ease-in group-hover:text-MonteCarlo-300 md:h-8 md:w-8"></i>
          <span class="absolute right-1/2 top-[3.5rem] origin-center translate-x-1/2 scale-0 rounded border border-SpringWood-50/50 bg-Woodsmoke-800 object-center px-0.5 font-Playpen text-[10px] font-thin transition-transform delay-150 duration-100 ease-linear group-hover:scale-100 group-hover:delay-700">{text}</span>
        </button>
      </section>
      <p class="w-full text-center">Are you sure you want to delete this list for good?<br />There is no getting it back once it's deleted.</p>
      <section class="flex w-full items-center justify-center space-x-4">
        <button @click="() => modal?.close" class="group relative space-x-2 rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out hover:border-green-500 hover:shadow-green-300/30">
          <span class="text-xl">No save it</span>
        </button>
        <button @click="deleteList" class="group relative space-x-2 rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out hover:border-red-500 hover:shadow-red-300/30">
          <span class="text-xl">Yes delete it</span>
        </button>
      </section>
    </dialog>
    <ul class="grid w-full grid-cols-2 grid-rows-5 items-end justify-evenly justify-items-center space-y-6 md:grid-cols-5 md:grid-rows-2 2xl:grid-cols-8 2xl:grid-rows-1 2xl:space-y-0">
      <li v-for="list in lists" :style="{ borderColor: list.color }" class="flex h-60 w-40 flex-col rounded border-2 py-0.5 md:h-[16.5rem] md:w-44 2xl:h-72 2xl:w-48">
        <span class="truncate px-2 pb-1 font-Playpen text-2xl font-light tracking-wide">{{ list.name }}</span>
        <ul class="border-y border-y-SpringWood-50/35 px-2 py-1">
          <li class="flex items-center">
            <i class="fa-solid fa-sharp fa-heart h-4 w-4 text-BiFlag-Pink"></i>
            <span>: {{ list.likes }}</span>
          </li>
          <li class="flex items-center justify-between py-1">
            <div class="flex items-center">
              <i class="fa-light fa-eye h-4 w-4"></i>
              <span>: {{ list.views }}</span>
            </div>
            <div>
              <span v-if="list.public" class="text-xs md:text-sm">(Public)</span>
              <span v-else class="text-xs md:text-sm">(Private)</span>
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
            <button
              @click="
                () => {
                  listToDelete = list;
                  modal?.showModal();
                }
              "
              class="flex items-center justify-center p-1.5 transition-all ease-in hover:scale-110 hover:text-red-500">
              <i class="fa-light fa-trash h-8 w-8"></i>
            </button>
          </li>
        </menu>
      </li>
    </ul>
    <p v-if="fetchDone && lists.length === 0" class="text-xl">You don't have any lists! Create one with the "<span class="text-MonteCarlo-300">New</span>" button!</p>
  </div>
</template>
