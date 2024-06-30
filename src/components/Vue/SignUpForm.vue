<script setup lang="ts">
  import { ref } from 'vue';

  const email = ref('');
  const pass = ref('');
  const error = ref('');
</script>

<template>
  <div class="flex w-5/6 items-center justify-center">
    <article class="flex w-full flex-col items-center justify-center space-y-4 rounded-md bg-Woodsmoke-900/60 px-4 py-1 md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-5/12">
      <h1 class="w-full border-b border-b-SpringWood-50/25 pb-1 text-center font-Playpen text-5xl font-light">Sign up</h1>
      <form method="post" class="flex w-full flex-col items-center justify-center space-y-4 pb-1">
        <section class="flex w-full flex-col items-center space-y-4 px-4 md:grid md:grid-flow-row md:grid-cols-2 md:gap-4 md:space-y-0 lg:px-8">
          <input v-model="email" type="email" name="email" id="email" placeholder="Email" class="w-full rounded-md bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-0 placeholder:text-base placeholder:italic" />
          <input type="text" name="username" id="username" placeholder="Username" class="w-full rounded-md bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-0 placeholder:text-base placeholder:italic" />
          <input v-model="pass" type="password" name="pass" id="pass" placeholder="Password" class="w-full rounded-md bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-0 placeholder:text-base placeholder:italic" />
          <input type="number" name="age" id="age" placeholder="Age" class="w-full rounded-md bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-0 placeholder:text-base placeholder:italic" />
          <input type="password" name="passTwo" id="passTwo" placeholder="Confirm password" class="w-full rounded-md bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-0 placeholder:text-base placeholder:italic" />
          <input type="text" name="gender" id="gender" placeholder="Gender" class="w-full rounded-md bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-0 placeholder:text-base placeholder:italic" />
        </section>
        <span v-if="error != ''" class="font-medium text-red-500">{{ error }}</span>
        <button type="submit" class="rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out hover:border-green-500 hover:text-green-500 hover:shadow-green-300/30">Submit</button>
      </form>
    </article>
  </div>
</template>
