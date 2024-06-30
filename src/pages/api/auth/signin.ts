import type { APIRoute } from 'astro';
import { app } from '@firebase/server';
import { getAuth } from 'firebase-admin/auth';

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const auth = getAuth(app);

  const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
  const staySignedIn = request.text.toString();

  if (!idToken) {
    return new Response('No token found', { status: 401 });
  }

  try {
    await auth.verifyIdToken(idToken);
  } catch (error) {
    return new Response('Invalid token', { status: 401 });
  }

  let timer: number = 6 * 60 * 60 * 1000;
  if (staySignedIn === 'true') {
    timer *= 28;
  }

  try {
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: timer,
    });

    cookies.set('__session', sessionCookie, {
      path: '/',
    });
  } catch {
    return new Response('Could not create cookie', { status: 401 });
  }

  return redirect('/user');
};
