import type { APIRoute } from 'astro';

import { MongoClient, ObjectId } from 'mongodb';

export const POST: APIRoute = async ({ request }) => {
  const pass = import.meta.env.MONGO_DB_SEARCH_PASS;

  const data = (await request.json()) as SearchData;

  const mongo = new MongoClient(`mongodb+srv://search:${pass}@main.zc2oijy.mongodb.net/?retryWrites=true&w=majority&appName=Main`);
  const searchDb = mongo.db('Private').collection<SearchDoc>('searches');

  let uid: ObjectId | null = null;
  let knownUser = false;
  if (data.uid) {
    knownUser = true;
    uid = new ObjectId(data.uid);
  }

  await searchDb
    .insertOne({
      timestamp: new Date(),
      knownUser: knownUser,
      title: data.title,
      author: data.author,
      uid: uid,
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
