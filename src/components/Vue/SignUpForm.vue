<script setup lang="ts">
  import { ref } from 'vue';

  const email = ref('');
  const phone = ref('');
  const passOne = ref('');
  const passTwo = ref('');
  const username = ref('');
  const age = ref('');
  const gender = ref('');
  const animal = ref('');

  const error = ref('');
  const screen = ref(0);

  function checkScreenOne() {
    error.value = '';

    if (email.value === '' || phone.value === '' || passOne.value === '' || passTwo.value === '') {
      error.value = 'Missing form data';
      return;
    }

    if (passOne.value !== passTwo.value) {
      error.value = 'Passwords do not match';
      return;
    }

    screen.value = 1;
  }

  async function signUp() {
    error.value = '';

    if (username.value === '' || age.value === '' || gender.value === '' || animal.value === '') {
      error.value = 'Missing form data';
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: email.value,
          phone: phone.value,
          pass: passOne.value,
          username: username.value,
          age: parseInt(age.value),
          gender: gender.value,
          animal: animal.value,
        } as SignUpData),
      });

      if (response.redirected) {
        window.location.assign(response.url);
      }
    } catch {
      error.value = 'Unable to sign up';
      return;
    }
  }
</script>

<template>
  <div class="flex w-5/6 items-center justify-center">
    <article class="flex w-full flex-col items-center justify-center space-y-4 rounded-md bg-Woodsmoke-900/60 px-4 py-1 md:w-3/4 lg:w-2/3 xl:w-1/2 2xl:w-5/12">
      <h1 class="w-full border-b border-b-SpringWood-50/25 pb-1 text-center font-Playpen text-5xl font-light">Sign up</h1>
      <form @submit.prevent="signUp" method="post" class="flex w-full flex-col items-center justify-center space-y-4 pb-1">
        <section v-if="screen === 0" class="flex w-full flex-col items-center space-y-4 px-4 md:grid md:grid-cols-2 md:grid-rows-2 md:gap-4 md:space-y-0 lg:px-8">
          <input v-model="email" type="email" name="email" id="email" placeholder="Email" autocomplete="email" class="w-full rounded-md bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-0 placeholder:text-base placeholder:italic" />
          <input v-model="phone" type="tel" name="phone" id="phone" placeholder="Phone number" autocomplete="tel" class="w-full rounded-md bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-0 placeholder:text-base placeholder:italic" />
          <input v-model="passOne" type="password" name="passOne" id="passOne" placeholder="Password" autocomplete="off" class="w-full rounded-md bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-0 placeholder:text-base placeholder:italic" />
          <input v-model="passTwo" type="password" name="passTwo" id="passTwo" placeholder="Confirm password" autocomplete="off" class="w-full rounded-md bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-0 placeholder:text-base placeholder:italic" />
        </section>
        <section v-if="screen === 1" class="flex w-full flex-col items-center space-y-4 px-4 md:grid md:grid-flow-row md:grid-cols-2 md:gap-4 md:space-y-0 lg:px-8">
          <input v-model="username" type="text" name="username" id="username" placeholder="Name" autocomplete="username" class="w-full rounded-md bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-0 placeholder:text-base placeholder:italic" />
          <input v-model="age" type="number" name="age" id="age" placeholder="Age" autocomplete="off" class="w-full rounded-md bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-0 placeholder:text-base placeholder:italic" />
          <input v-model="gender" type="text" name="gender" id="gender" placeholder="Gender" autocomplete="sex" class="w-full rounded-md bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-0 placeholder:text-base placeholder:italic" />
          <input v-model="animal" type="text" name="animal" id="animal" placeholder="Favorite animal" autocomplete="off" class="w-full rounded-md bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-0 placeholder:text-base placeholder:italic" />
        </section>
        <span v-if="error != ''" class="font-medium text-red-500">{{ error }}</span>
        <button v-if="screen === 0" @click="checkScreenOne" type="button" class="rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out hover:border-MonteCarlo-500 hover:text-MonteCarlo-500 hover:shadow-MonteCarlo-300/30">Next</button>
        <button v-if="screen === 1" type="submit" class="rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out hover:border-green-500 hover:text-green-500 hover:shadow-green-300/30">Submit</button>
      </form>
    </article>
  </div>
</template>
