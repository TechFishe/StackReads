<script setup lang="ts">
  import { ref } from 'vue';

  const modal = ref<HTMLDialogElement>();
  const isPublic = ref(false);
  const listName = ref('');
  //const color = ref((((1 << 24) * Math.random()) | 0).toString(16).padStart(6, '0'));
  const error = ref('');

  async function addList() {
    error.value = '';

    if (listName.value === '') {
      error.value = 'No name provided';
      return;
    }

    const response = await fetch('/api/list', {
      method: 'post',
      body: JSON.stringify({
        name: listName.value,
        public: isPublic.value,
        color: '#' + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, '0'),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 201) {
      error.value = 'Something when wrong';
      return;
    }

    modal.value?.close();
    window.location.reload();
  }
</script>

<template>
  <div>
    <dialog ref="modal" class="w-full rounded-md bg-Woodsmoke-900/60 py-3 text-SpringWood-50 drop-shadow-Modal backdrop:bg-Woodsmoke-950/60 backdrop:backdrop-blur-[1px] md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-5/12">
      <section class="flex items-center justify-between border-b border-b-SpringWood-50/50 px-4">
        <span class="text-xl tracking-tight md:text-4xl">New list</span>
        <button @click="() => modal?.close()" class="group relative flex items-center justify-center space-x-2 p-1.5 transition-transform ease-in hover:scale-110">
          <i class="fa-light fa-xmark h-6 w-6 transition-colors ease-in group-hover:text-MonteCarlo-300 md:h-8 md:w-8"></i>
          <span class="absolute right-1/2 top-[3.5rem] origin-center translate-x-1/2 scale-0 rounded border border-SpringWood-50/50 bg-Woodsmoke-800 object-center px-0.5 font-Playpen text-[10px] font-thin transition-transform delay-150 duration-100 ease-linear group-hover:scale-100 group-hover:delay-700">{text}</span>
        </button>
      </section>
      <form @submit.prevent="addList" method="post" class="flex flex-col items-center justify-center px-4 pt-3">
        <section class="flex w-full flex-col items-center justify-center space-y-1 pb-3">
          <div class="flex w-full justify-center space-x-4">
            <input v-model="listName" type="text" name="name" id="name" placeholder="Name" autocomplete="off" class="w-1/2 rounded-md border-none bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-none placeholder:text-base placeholder:italic" />
            <!-- <div class="flex w-1/2 items-center space-x-2">
              <input v-model="color" type="text" name="color" id="color" placeholder="Color" autocomplete="off" class="h-full rounded-md border-none bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-none placeholder:text-base placeholder:italic" />
              <a :href="`https://nekocolor.com/#${color}`" target="_blank" rel="noopener noreferrer" class="rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out hover:border-MonteCarlo-500 hover:text-MonteCarlo-500 hover:shadow-MonteCarlo-300/30"><i class="fa-light fa-eye-dropper" /></a>
              <button class="group relative rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out hover:border-MonteCarlo-500 hover:text-MonteCarlo-500 hover:shadow-MonteCarlo-300/30">
                <i class="fa-light fa-dice" />
                <span class="absolute right-1/2 top-[3.5rem] origin-center translate-x-1/2 scale-0 rounded border border-SpringWood-50/50 bg-Woodsmoke-800 object-center px-0.5 font-Playpen text-[10px] font-thin transition-transform delay-150 duration-100 ease-linear group-hover:scale-100 group-hover:delay-700">{text}</span>
              </button>
            </div> -->
          </div>
          <article class="flex w-1/2 items-center justify-center space-x-2">
            <label for="remember" class="cursor-text text-base font-thin">Public?</label>
            <div class="relative flex">
              <input v-model="isPublic" type="checkbox" name="public" id="public" class="peer relative h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-sm bg-Woodsmoke-900/80 transition-colors duration-100 ease-linear checked:bg-MonteCarlo-500" />
              <div class="pointer-events-none absolute top-0 hidden peer-checked:block">
                <i class="fa-light fa-check" />
              </div>
            </div>
          </article>
        </section>
        <span v-if="error != ''" class="pb-1 font-medium text-red-500">{{ error }}</span>
        <button type="submit" class="rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out hover:border-green-500 hover:text-green-500 hover:shadow-green-300/30">Submit</button>
      </form>
    </dialog>
    <button @click="() => modal?.showModal()" class="group relative space-x-2 rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out enabled:hover:border-MonteCarlo-500 enabled:hover:shadow-MonteCarlo-300/30 disabled:cursor-not-allowed disabled:opacity-60">
      <i class="fa-light fa-plus"></i>
      <span class="text-xl">New</span>
      <!-- <span class="font-thin font-Playpen text-[10px] bg-Woodsmoke-800 px-0.5 rounded absolute origin-center object-center top-[3.5rem] right-1/2 scale-0 group-hover:scale-100 transition-transform ease-linear duration-100 delay-150 group-hover:delay-700 translate-x-1/2 border-SpringWood-50/50 border">{text}</span> -->
    </button>
  </div>
</template>
