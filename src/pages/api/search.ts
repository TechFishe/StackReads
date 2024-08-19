import type { APIRoute } from 'astro';

import { MongoClient, ObjectId } from 'mongodb';

interface requestData {
  title: string;
  author: string;
  uid: string | null;
}

export const POST: APIRoute = async ({ request }) => {
  const pass = import.meta.env.MONGO_DB_GENERAL_PASS;

  const data = (await request.json()) as requestData;

  const mongo = new MongoClient(`mongodb+srv://general:${pass}@main.zc2oijy.mongodb.net/?retryWrites=true&w=majority&appName=Main`);
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
    status: 201,
    statusText: 'Created',
  });
};
