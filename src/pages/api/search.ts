import type { APIRoute } from 'astro';

import { MongoClient } from 'mongodb';

export const POST: APIRoute = async ({ request }) => {
  const pass = import.meta.env.MONGO_DB_SEARCH_PASS;

  const data = (await request.json()) as { title: string; author: string };

  const mongo = new MongoClient(`mongodb+srv://search:${pass}@main.zc2oijy.mongodb.net/?retryWrites=true&w=majority&appName=Main`);
  const searchDb = mongo.db('Gen').collection<SearchDoc>('searches');

  await searchDb
    .insertOne({
      timestamp: new Date(),
      knownUser: false,
      title: data.title,
      author: data.author,
    })
    .catch((err) => {
      console.error(err);
      mongo.close();
      return new Response(null, err);
    });

  mongo.close();

  return new Response(null, {
    status: 200,
    statusText: 'Ok',
  });
};
