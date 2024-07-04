import type { APIRoute } from 'astro';

import { app } from '@firebase/server';
import { UserRecord, getAuth } from 'firebase-admin/auth';
import { Timestamp, getFirestore } from 'firebase-admin/firestore';

export const POST: APIRoute = async ({ request, redirect }) => {
  const auth = getAuth(app);
  let user: SignUpData = {
    uid: '',
    email: '',
    phone: '',
    pass: '',
    username: '',
    age: -1,
    gender: '',
    animal: '',
    pfp: '',
  };

  await request
    .json()
    .then((data) => {
      user = data as SignUpData;
    })
    .catch((error) => {
      console.error(error);
      return new Response('Error parsing user data', error);
    });

  await auth
    .createUser({
      email: user.email,
      emailVerified: true,
      password: user.pass,
      displayName: user.username,
      photoURL: user.pfp,
    })
    .then((data: UserRecord) => {
      user.uid = data.uid;
    })
    .catch((error) => {
      console.error(error);
      return new Response('Error creating user', error);
    });

  await getFirestore(app)
    .collection('users')
    .doc(user.uid)
    .set({
      email: user.email,
      phone: user.phone,
      username: user.username,
      age: user.age,
      gender: user.gender,
      animal: user.animal,
      pfp: user.pfp,
      joinedAt: Timestamp.now(),
      lastSignedIn: null,
    })
    .catch((error) => {
      console.error(error);
      return new Response('Error creating user doc', error);
    });

  return redirect('/signin');
};
