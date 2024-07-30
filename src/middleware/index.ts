import type { APIContext } from 'astro';

import { defineMiddleware } from 'astro:middleware';
import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId, type WithId } from 'mongodb';

const { verify } = jwt;

interface MiddlewareReturn {
  redirect: boolean;
  url: string;
}

export const onRequest = defineMiddleware(async (context, next) => {
  switch (context.url.pathname) {
    default:
      next();
  }
});
