<script setup lang="ts">
  import { ref } from 'vue';
  import { getAuth, inMemoryPersistence, signInWithEmailAndPassword } from 'firebase/auth';
  import { app } from '@firebase/client';

  const email = ref('');
  const pass = ref('');
  const error = ref('');

  async function signIn() {
    error.value = '';

    const auth = getAuth(app);
    auth.setPersistence(inMemoryPersistence);

    if (email.value === '' || pass.value === '') {
      error.value = 'You must fill out one of the provided fields';
      return;
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, email.value, pass.value);
      const token = await userCred.user.getIdToken();
      const response = await fetch('/api/auth/signin', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: 'true',
      });

      if (response.redirected) {
        window.location.assign(response.url);
      }
    } catch {
      error.value = 'Unable to sign in';
      return;
    }
  }
</script>

<template>
  <div class="flex w-5/6 items-center justify-center">
    <article class="flex w-full flex-col items-center justify-center space-y-4 rounded-md bg-Woodsmoke-900/60 px-4 py-1 md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-5/12">
      <h1 class="w-full border-b border-b-SpringWood-50/25 pb-1 text-center font-Playpen text-5xl font-light">Sign in</h1>
      <form @submit.prevent="signIn" method="post" class="flex w-full flex-col items-center justify-center space-y-4 pb-1">
        <section class="flex w-full flex-col items-center space-y-4 px-4 md:flex-row md:space-x-4 md:space-y-0 lg:px-8">
          <input v-model="email" type="email" name="email" id="email" placeholder="Email" autocomplete="email" class="w-full rounded-md bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-0 placeholder:text-base placeholder:italic" />
          <input v-model="pass" type="password" name="pass" id="pass" placeholder="Password" autocomplete="current-password" class="w-full rounded-md bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-0 placeholder:text-base placeholder:italic" />
        </section>
        <div class="flex flex-col items-center">
          <span v-if="error != ''" class="font-medium text-red-500">{{ error }}</span>
          <p class="text-center text-base">
            New to StackReads? <br class="md:hidden" />
            Sign up <a href="/signup" class="underline transition-colors duration-100 ease-linear hover:text-MonteCarlo-300">here</a>.
          </p>
        </div>
        <button type="submit" class="rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out hover:border-green-500 hover:text-green-500 hover:shadow-green-300/30">Submit</button>
      </form>
    </article>
  </div>
</template>
