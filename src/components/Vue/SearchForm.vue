<script setup lang="ts">
  import { ref, type Ref } from 'vue';

  const props = defineProps<{
    url: string;
  }>();

  const title = ref('');
  const author = ref('');
  const error = ref('');

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

    let books: any[] = [];
    try {
      const response = await fetch(query);
      const data = await response.json();
      books = data.items;
      books = books.filter((book: any) => book.saleInfo.saleability !== 'NOT_FOR_SALE');
    } catch {
      error.value = 'Unable to preform a search search';
      return [];
    }

    const response = await fetch('/api/auth/verifyUser/uid');

    let uid: string | null = null;
    if (response.status === 200) {
      uid = await response.json().then((data) => {
        return data.uid as string;
      });
    }

    await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({
        title: title.value,
        author: author.value,
        uid: uid,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (books.length === 0) {
      error.value = 'No books found for that search';
      return [];
    }
    while (books.length > 8) {
      books.pop();
    }

    return books;
  }
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center">
    <div class="flex w-5/6 items-center justify-center">
      <article class="flex w-full flex-col items-center justify-center space-y-4 rounded-md bg-Woodsmoke-900/60 px-4 py-1 md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-5/12">
        <h1 class="w-full border-b border-b-SpringWood-50/25 pb-1 text-center font-Playpen text-5xl font-light">Search</h1>
        <form @submit.prevent="queryBooks" method="get" class="flex w-full flex-col items-center justify-center space-y-4 pb-1">
          <section class="flex w-full flex-col items-center space-y-4 px-4 md:flex-row md:space-x-4 md:space-y-0 lg:px-8">
            <input v-model="title" type="text" autocomplete="off" name="title" id="title" placeholder="Title" class="w-full rounded-md bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-0 placeholder:text-base placeholder:italic" />
            <input v-model="author" type="text" autocomplete="off" name="author" id="author" placeholder="Author" class="w-full rounded-md bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-0 placeholder:text-base placeholder:italic" />
          </section>
          <span v-if="error != ''" class="font-medium text-red-500">{{ error }}</span>
          <button type="submit" class="rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out hover:border-green-500 hover:shadow-green-300/30">Submit</button>
        </form>
      </article>
    </div>
    <article v-if="currBooks.length !== 0" class="mt-8 w-11/12">
      <ul class="grid w-full grid-cols-2 grid-rows-4 items-end justify-evenly justify-items-center space-y-6 md:grid-cols-4 md:grid-rows-2 2xl:grid-cols-8 2xl:grid-rows-1 2xl:space-y-0">
        <li v-for="book in currBooks" class="group h-60 w-40 bg-Woodsmoke-950 shadow-lg shadow-transparent transition-all ease-out hover:scale-105 hover:opacity-80 hover:shadow-MonteCarlo-300/40 md:h-[16.5rem] md:w-44 2xl:h-72 2xl:w-48">
          <a :href="props.url + `/book/${book.id}`" class="transition-opacity ease-out group-hover:opacity-90">
            <img :src="book.volumeInfo.imageLinks.thumbnail" alt="Book cover" class="h-full w-full rounded-sm" />
          </a>
        </li>
      </ul>
    </article>
  </div>
</template>
