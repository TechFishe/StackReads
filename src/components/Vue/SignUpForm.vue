<script setup lang="ts">
  import { onMounted, ref } from 'vue';

  type Dir = 'left' | 'right';

  const email = ref('');
  const phone = ref('');
  const passOne = ref('');
  const passTwo = ref('');
  const username = ref('');
  const age = ref('');
  const gender = ref('');
  const animal = ref('');
  const pfp = ref('https://api.dicebear.com/9.x/adventurer-neutral/svg?size=64&glassesProbability=0');
  const color = ref((((1 << 24) * Math.random()) | 0).toString(16).padStart(6, '0'));

  const error = ref('');
  const screen = ref(0);

  const eyebrows = ref(Math.floor(Math.random() * 15));
  const eyes = ref(Math.floor(Math.random() * 26));
  const mouth = ref(Math.floor(Math.random() * 30));

  async function checkScreenOne() {
    error.value = '';

    if (email.value === '' || phone.value === '' || passOne.value === '' || passTwo.value === '') {
      error.value = 'Missing form data';
      return;
    }

    if (passOne.value !== passTwo.value) {
      error.value = 'Passwords do not match';
      return;
    }

    const response = await fetch(`/api/auth/duplication/${email.value}/${phone.value}.ts`);

    if (response.status !== 200) {
      const _error = (await response.json()) as ErrorInfo;
      error.value = _error.text;
      return;
    }

    screen.value = 1;
  }

  function checkScreenTwo() {
    error.value = '';

    if (username.value === '' || age.value === '' || gender.value === '' || animal.value === '') {
      error.value = 'Missing form data';
      return;
    }

    screen.value = 2;
  }

  function setPfp() {
    const regex = /^[a-fA-F0-9]{6}$/;

    let tempColor = color.value.split('');
    if (tempColor[0] === '#') {
      tempColor = tempColor.slice(1);
      color.value = '';
      tempColor.forEach((char) => {
        color.value += char;
      });
    }

    pfp.value = `https://api.dicebear.com/9.x/adventurer-neutral/svg?size=64&glassesProbability=0&eyebrows=variant${eyebrows.value < 10 ? '0' : ''}${eyebrows.value}&eyes=variant${eyes.value < 10 ? '0' : ''}${eyes.value}&mouth=variant${mouth.value < 10 ? '0' : ''}${mouth.value}${color.value !== '' && regex.test(color.value) ? `&backgroundColor=${color.value}` : ''}`;
  }

  function cycleEyebrows(dir: Dir) {
    if (dir === 'left') {
      eyebrows.value--;
      if (eyebrows.value < 1) eyebrows.value = 15;
    }

    if (dir === 'right') {
      eyebrows.value++;
      if (eyebrows.value > 15) eyebrows.value = 1;
    }

    setPfp();
  }

  function cycleEyes(dir: Dir) {
    if (dir === 'left') {
      eyes.value--;
      if (eyes.value < 1) eyes.value = 26;
    }

    if (dir === 'right') {
      eyes.value++;
      if (eyes.value > 26) eyes.value = 1;
    }

    setPfp();
  }

  function cycleMouth(dir: Dir) {
    if (dir === 'left') {
      mouth.value--;
      if (mouth.value < 1) mouth.value = 30;
    }

    if (dir === 'right') {
      mouth.value++;
      if (mouth.value > 30) mouth.value = 1;
    }

    setPfp();
  }

  async function signUp() {
    error.value = '';

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
        pfp: pfp.value,
      } as SignUpData),
    });

    if (response.redirected) {
      window.location.assign(response.url);
    } else {
      const _error = (await response.json()) as ErrorInfo;
      error.value = _error.text;
      return;
    }
  }

  onMounted(setPfp);
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
        <section v-if="screen === 2" class="flex w-full flex-col items-center space-y-4 px-4 md:grid md:grid-cols-2 md:grid-rows-5 md:gap-4 md:space-y-0 lg:px-8">
          <img :src="pfp" alt="Preview pfp" class="h-24 w-24 rounded-lg subpixel-antialiased md:col-span-1 md:row-span-5 md:h-full md:w-full" />
          <div class="flex w-full items-center justify-between justify-self-center">
            <button @click="cycleEyebrows('left')" type="button" class="rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out hover:border-MonteCarlo-500 hover:text-MonteCarlo-500 hover:shadow-MonteCarlo-300/30"><i class="fa-light fa-chevron-left" /></button>
            <span class="text-lg">Eyebrows ({{ eyebrows }})</span>
            <button @click="cycleEyebrows('right')" type="button" class="rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out hover:border-MonteCarlo-500 hover:text-MonteCarlo-500 hover:shadow-MonteCarlo-300/30"><i class="fa-light fa-chevron-right" /></button>
          </div>
          <div class="flex w-full items-center justify-between justify-self-center">
            <button @click="cycleEyes('left')" type="button" class="rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out hover:border-MonteCarlo-500 hover:text-MonteCarlo-500 hover:shadow-MonteCarlo-300/30"><i class="fa-light fa-chevron-left" /></button>
            <span class="text-lg">Eyes ({{ eyes }})</span>
            <button @click="cycleEyes('right')" type="button" class="rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out hover:border-MonteCarlo-500 hover:text-MonteCarlo-500 hover:shadow-MonteCarlo-300/30"><i class="fa-light fa-chevron-right" /></button>
          </div>
          <div class="flex w-full items-center justify-between justify-self-center">
            <button @click="cycleMouth('left')" type="button" class="rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out hover:border-MonteCarlo-500 hover:text-MonteCarlo-500 hover:shadow-MonteCarlo-300/30"><i class="fa-light fa-chevron-left" /></button>
            <span class="text-lg">Mouth ({{ mouth }})</span>
            <button @click="cycleMouth('right')" type="button" class="rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out hover:border-MonteCarlo-500 hover:text-MonteCarlo-500 hover:shadow-MonteCarlo-300/30"><i class="fa-light fa-chevron-right" /></button>
          </div>
          <div class="flex w-full items-center space-x-2 justify-self-center">
            <input v-model="color" @input="setPfp" type="text" name="color" id="color" placeholder="Background color" autocomplete="off" class="w-full rounded-md bg-Woodsmoke-900/80 px-2 py-0.5 text-lg outline-0 placeholder:text-base placeholder:italic" />
            <a href="https://nekocolor.com/" target="_blank" rel="noopener noreferrer" class="rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out hover:border-MonteCarlo-500 hover:text-MonteCarlo-500 hover:shadow-MonteCarlo-300/30"><i class="fa-light fa-eye-dropper" /></a>
          </div>
          <button type="submit" class="w-fit justify-self-center rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out hover:border-green-500 hover:text-green-500 hover:shadow-green-300/30">Submit</button>
        </section>
        <span v-if="error != ''" class="font-medium text-red-500">{{ error }}</span>
        <button v-if="screen === 0" @click="checkScreenOne" type="button" class="rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out hover:border-MonteCarlo-500 hover:text-MonteCarlo-500 hover:shadow-MonteCarlo-300/30">Next</button>
        <button v-if="screen === 1" @click="checkScreenTwo" type="button" class="rounded-md border px-4 py-1 text-xl shadow-md shadow-transparent transition-all ease-out hover:border-MonteCarlo-500 hover:text-MonteCarlo-500 hover:shadow-MonteCarlo-300/30">Next</button>
      </form>
    </article>
  </div>
</template>
