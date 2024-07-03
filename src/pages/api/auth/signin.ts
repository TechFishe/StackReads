import type { APIRoute } from 'astro';

import { app } from '@firebase/server';
import { getAuth } from 'firebase-admin/auth';

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const auth = getAuth(app);

  const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
  let staySignedIn: boolean = true;

  if (!idToken) {
    return new Response('No token found', { status: 401 });
  }

  await auth.verifyIdToken(idToken).catch((error) => {
    return new Response('Invalid token', error);
  });

  let timer: number = 6 * 60 * 60 * 1000;
  if (staySignedIn) {
    timer *= 28;
  }

  await auth
    .createSessionCookie(idToken, {
      expiresIn: timer,
    })
    .then((cookie) => {
      cookies.set('__session', cookie, {
        path: '/',
      });
    })
    .catch((error) => {
      return new Response('Could not create cookie', error);
    });

  return redirect('/user');
};
