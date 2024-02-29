<script setup lang="ts">
  useHead({
    title: "Books",
  });

  const books: Ref<Book[]> = ref([]);

  async function getBooks() {
    let response = await fetch("https://www.googleapis.com/books/v1/volumes?q=inauthor:riordan&startIndex=0&key=AIzaSyADRoFYECCfBXXRetXWxDapzVcYFhvtqpA");
    let data = await response.json();

    for (let i = 0; i < data.items.length; i++) {
      let tempData: Book = data.items[i].volumeInfo;

      if (tempData.imageLinks != undefined) books.value.push(tempData);
    }
  }

  onMounted(() => {
    getBooks();
  });
</script>

<template>
  <main class="flex min-h-fullscreen w-full flex-col">
    <article class="my-2 h-hero border-b-2 border-snow/45">
      <span class="h-16 font-handlee text-5xl font-semibold tracking-tight">Recommended</span>
      <ul id="noScrollbar" class="h-book flex w-full flex-row items-center space-x-4 overflow-x-scroll">
        <li v-for="book in books" class="aspect-auto h-full">
          <!-- Ignore error -->
          <NuxtImg :src="book.imageLinks.thumbnail" class="aspect-auto h-full" />
        </li>
      </ul>
    </article>
    <article class="my-2 h-hero border-b-2 border-snow/45">
      <span class="h-16 font-handlee text-5xl font-semibold tracking-tight">Past reads</span>
    </article>
    <article class="my-2 h-hero border-b-2 border-snow/45">
      <span class="h-16 font-handlee text-5xl font-semibold tracking-tight">Current reads</span>
    </article>
    <article class="mt-2 h-hero">
      <span class="h-16 font-handlee text-5xl font-semibold tracking-tight">To be read</span>
    </article>
  </main>
</template>

<style scoped>
  #noScrollbar::-webkit-scrollbar {
    display: none;
  }
</style>
