<script setup lang="ts">
  import type { WithId } from 'mongodb';
  import { ref, onMounted, type Ref } from 'vue';

  const props = defineProps<{
    bookId: string;
  }>();

  const allowBtn = ref(true);
  const modal = ref<HTMLDialogElement>();
  const lists: Ref<WithId<listDoc>[]> = ref([]);
  const error = ref('');

  async function addToTbr(listId: string) {
    const response = await fetch('/api/list/addBook', {
      method: 'POST',
      body: JSON.stringify({
        listId: listId,
        bookId: props.bookId,
      }),
    });

    if (response.status !== 201) {
      error.value = 'Something went wrong';
      return;
    }

    modal.value?.close();
  }

  onMounted(async () => {
    const uidResponse = await fetch('/api/auth/verifyUser/none');
    if (uidResponse.status !== 200) return;

    allowBtn.value = false;

    const tbrResponse = await fetch('/api/list/getMany');
    if (tbrResponse.status === 200) lists.value = await tbrResponse.json();
  });
</script>

<template>
  <div>
    <dialog ref="modal" class="w-full space-y-3 rounded-md bg-Woodsmoke-900 px-4 py-3 text-SpringWood-50 drop-shadow-Modal backdrop:bg-Woodsmoke-950/60 backdrop:backdrop-blur-[1px] md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-5/12">
      <section class="flex items-center justify-between border-b border-b-SpringWood-50/50 px-4">
        <span class="text-xl tracking-tight md:text-4xl">Add Book</span>
        <button @click="() => modal?.close()" class="group relative flex items-center justify-center space-x-2 p-1.5 transition-transform ease-in hover:scale-110">
          <i class="fa-light fa-xmark h-6 w-6 transition-colors ease-in group-hover:text-MonteCarlo-300 md:h-8 md:w-8"></i>
          <span class="absolute right-1/2 top-[3.5rem] origin-center translate-x-1/2 scale-0 rounded border border-SpringWood-50/50 bg-Woodsmoke-800 object-center px-0.5 font-Playpen text-[10px] font-thin transition-transform delay-150 duration-100 ease-linear group-hover:scale-100 group-hover:delay-700">{text}</span>
        </button>
      </section>
      <ul class="grid space-x-2 space-y-4">
        <li v-for="list in lists" class="flex w-fit items-center space-x-2 rounded-md bg-Woodsmoke-950/30 px-2 py-0.5 shadow-md shadow-SpringWood-300/15">
          <button @click="() => addToTbr(list._id.toString())" class="group flex transition-transform ease-in hover:scale-110">
            <i class="fa-light fa-plus h-6 w-6 transition-colors ease-in group-hover:text-MonteCarlo-300"></i>
          </button>
          <div class="border-l border-l-SpringWood-50/25 pl-2">
            <span class="font-Playpen text-xl font-light italic tracking-wide">{{ list.name }}</span>
            <span class="text-xl">: </span>
            <span class="text-lg">{{ list.books.length }}</span>
          </div>
        </li>
      </ul>
      <div class="flex w-full justify-center">
        <span v-if="error != ''" class="font-medium text-red-500">{{ error }}</span>
      </div>
    </dialog>
    <button @click="() => modal?.showModal()" :disabled="allowBtn" class="group relative space-x-2 rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out enabled:hover:border-MonteCarlo-500 enabled:hover:shadow-MonteCarlo-300/30 disabled:cursor-not-allowed disabled:opacity-60">
      <i class="fa-light fa-plus"></i>
      <span class="text-xl">Add</span>
      <!-- <span class="font-thin font-Playpen text-[10px] bg-Woodsmoke-800 px-0.5 rounded absolute origin-center object-center top-[3.5rem] right-1/2 scale-0 group-hover:scale-100 transition-transform ease-linear duration-100 delay-150 group-hover:delay-700 translate-x-1/2 border-SpringWood-50/50 border">{text}</span> -->
    </button>
  </div>
</template>
