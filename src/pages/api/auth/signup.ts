import type { APIRoute } from 'astro';

import { app } from '@firebase/server';
import { getAuth } from 'firebase-admin/auth';
import { Timestamp, getFirestore } from 'firebase-admin/firestore';

export const POST: APIRoute = async ({ request, redirect }) => {
  const auth = getAuth(app);
  let user: SignUpData = {
    email: '',
    phone: '',
    pass: '',
    username: '',
    age: -1,
    gender: '',
    animal: '',
  };

  await request
    .json()
    .then((data) => {
      user = data as SignUpData;
    })
    .catch((error) => {
      return new Response('Error parsing user data', error);
    });

  await auth
    .createUser({
      email: user.email,
      emailVerified: true,
      password: user.pass,
      displayName: user.username,
    })
    .catch((error) => {
      return new Response('Error creating user', error);
    });

  await getFirestore(app)
    .collection('users')
    .add({
      email: user.email,
      phone: user.phone,
      username: user.username,
      age: user.age,
      gender: user.gender,
      animal: user.animal,
      joinedAt: Timestamp.now(),
      lastSignedIn: null,
    })
    .catch((error) => {
      return new Response('Error creating user doc', error);
    });

  return redirect('/signin');
};
