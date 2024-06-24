<script setup lang="ts">
  import { ref, type Ref } from 'vue';

  const props = defineProps<{
    url: string;
  }>();

  const title: Ref<string> = ref('');
  const author: Ref<string> = ref('');
  const error: Ref<string> = ref('');

  const currBooks: Ref<any[]> = ref([]);

  async function queryBooks() {
    if (title.value === '' && author.value === '') {
      error.value = 'You must fill out one of the provided fields';
      return;
    }

    currBooks.value = await getBooks(0);
  }

  async function getBooks(startIndex: number): Promise<any[]> {
    error.value = '';

    let query: string = 'https://www.googleapis.com/books/v1/volumes?q=';
    if (title.value !== '') {
      query += `intitle:${title.value}`;
    }
    if (author.value !== '') {
      query += `inauthor:${author.value}`;
    }

    query += `&printType=books&startIndex=${startIndex}&maxResults=40&key=${import.meta.env.PUBLIC_BOOK_API}`;

    const response = await fetch(query);
    const data = await response.json();
    let books: any[] = data.items;
    books = books.filter((book: any) => book.saleInfo.saleability !== 'NOT_FOR_SALE');

    while (books.length > 10) {
      books.pop();
    }

    return books;
  }
</script>

<template>
  <div class="flex h-3/4 w-5/6 flex-col items-center justify-center space-y-12">
    <article class="flex w-5/6 flex-col items-center justify-center space-y-4 rounded-md bg-Woodsmoke-900/60 px-4 py-1 lg:w-3/4 xl:w-2/3 2xl:w-1/2">
      <h1 class="w-full border-b border-b-SpringWood-50/25 pb-1 text-center font-Playpen text-5xl font-light">Search</h1>
      <form @submit.prevent="queryBooks" method="get" class="flex w-full flex-col items-center justify-center space-y-4 pb-1">
        <section class="flex w-full flex-col items-center space-y-4 px-4 md:flex-row md:space-x-4 md:space-y-0 lg:px-8">
          <input v-model="title" type="text" autocomplete="off" name="title" id="title" placeholder="Title" class="w-full rounded-md bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-0 placeholder:text-base placeholder:italic" />
          <input v-model="author" type="text" autocomplete="off" name="author" id="author" placeholder="Author" class="w-full rounded-md bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-0 placeholder:text-base placeholder:italic" />
        </section>
        <span v-if="error != ''" class="font-medium text-red-500">{{ error }}</span>
        <button type="submit" class="rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out hover:border-green-500 hover:text-green-500 hover:shadow-green-300/30">Submit</button>
      </form>
    </article>
    <article class="w-full">
      <ul class="flex w-full items-center justify-between">
        <li v-for="book in currBooks" class="group h-52 bg-Woodsmoke-950 shadow-lg shadow-transparent transition-all ease-out hover:scale-105 hover:opacity-80 hover:shadow-MonteCarlo-300/40">
          <a :href="props.url + `/books/${book.id}`" class="transition-opacity ease-out group-hover:opacity-90">
            <img :src="book.volumeInfo.imageLinks.thumbnail" alt="Book cover" class="h-full rounded-sm" />
          </a>
        </li>
      </ul>
    </article>
  </div>
</template>
