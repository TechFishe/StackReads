import { defineMiddleware } from 'astro:middleware';
import type { APIContext } from 'astro';

import { app } from '@firebase/server';
import { getAuth } from 'firebase-admin/auth';

interface MiddlewareReturn {
  redirect: boolean;
  url?: string;
}

export const onRequest = defineMiddleware(async (context, next) => {
  switch (context.url.pathname) {
    case '/user':
      const response = await CheckAuth(context);
      if (response.redirect && response.url) return context.redirect(response.url);

      return next();
    default:
      return next();
  }
});

async function CheckAuth(context: APIContext): Promise<MiddlewareReturn> {
  const auth = getAuth(app);
  let output: MiddlewareReturn = { redirect: false };

  if (!context.cookies.has('__session')) {
    output.redirect = true;
    output.url = '/signin';
    return output;
  }

  //@ts-expect-error Thinks that the object might be undefined -_-
  const cookie = context.cookies.get('__session').value;
  try {
    const parsedCookie = await auth.verifySessionCookie(cookie);
    if (parsedCookie) return output;
  } catch {
    output.redirect = true;
    output.url = '/signin';
    return output;
  }

  return output;
}
