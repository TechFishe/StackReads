import type { APIRoute } from 'astro';

import { app } from '@firebase/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const auth = getAuth(app);

  const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
  let staySignedIn = true;

  if (!idToken) {
    return new Response('No token found', { status: 401 });
  }

  await auth.verifyIdToken(idToken).catch((error) => {
    console.error(error);
    return new Response('Invalid token', error);
  });

  let timer: number = 6 * 60 * 60 * 1000;
  if (staySignedIn) {
    timer *= 28;
  }

  let cookie: string = '';
  await auth
    .createSessionCookie(idToken, {
      expiresIn: timer,
    })
    .then((_cookie) => {
      cookie = _cookie;
    })
    .catch((error) => {
      console.error(error);
      return new Response('Could not create cookie', error);
    });

  cookies.set('__session', cookie, {
    path: '/',
  });

  let uid: string = '';
  await auth
    .verifySessionCookie(cookie)
    .then((data) => {
      uid = data.uid;
    })
    .catch((error) => {
      console.error(error);
      return new Response('Something when wrong', error);
    });

  await getFirestore(app)
    .collection('users')
    .doc(uid)
    .update({ lastSignedIn: Timestamp.now() })
    .catch((error) => {
      console.error(error);
      return new Response('Unable to sign in', error);
    });

  return redirect('/user');
};
