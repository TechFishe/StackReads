import type { APIRoute } from 'astro';
import { MongoClient, type Filter } from 'mongodb';

export const GET: APIRoute = async ({ params }) => {
  const { email, phone } = params;

  const pass = import.meta.env.MONGO_DB_SIGNIN_PASS;
  const mongo = new MongoClient(`mongodb+srv://signin:${pass}@main.zc2oijy.mongodb.net/?retryWrites=false&w=majority&appName=Main`);
  const userDb = mongo.db('Private').collection<PrivateUserDoc>('users');

  const duplicateQuery: Filter<PrivateUserDoc> = {
    $or: [{ email: email }, { phone: phone }],
  };
  const matches = await userDb.find(duplicateQuery).toArray();

  if (matches.length !== 0) {
    return new Response(
      JSON.stringify({
        text: 'Email/phone already in use',
      } as ErrorInfo),
      {
        status: 409,
      }
    );
  }

  return new Response(null, {
    status: 200,
  });
};
