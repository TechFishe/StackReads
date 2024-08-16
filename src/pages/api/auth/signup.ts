import type { APIRoute } from 'astro';

import { MongoClient } from 'mongodb';
import { hash } from 'bcrypt';

export const POST: APIRoute = async ({ request, redirect }) => {
  const pass = import.meta.env.MONGO_DB_SIGNIN_PASS;

  const data = (await request.json()) as SignUpData;

  const mongo = new MongoClient(`mongodb+srv://signin:${pass}@main.zc2oijy.mongodb.net/?retryWrites=false&w=majority&appName=Main`);
  const userDb = mongo.db('Private').collection<PrivateUserDoc>('users');

  try {
    let newUser: PrivateUserDoc = {
      createdAt: new Date(),
      lastSignedIn: null,
      ...data,
    };
    let tempPass: string = await hash(data.pass, 12);
    newUser.pass = tempPass.slice(7, tempPass.length);

    const userId = (await userDb.insertOne(newUser)).insertedId;

    // const listDb = mongo.db('Public').collection<listDoc>('tbr');
    // await listDb.insertOne({
    //   createdAt: new Date(),
    //   updatedAt: null,
    //   userId: userId,
    //   name: 'Reads',
    //   likes: 0,
    //   books: [],
    //   public: false,
    // });
  } catch (err: any) {
    console.error(err);
    return new Response(null, {
      status: 500,
      statusText: 'Unable to sign up',
    });
  } finally {
    await mongo.close();
  }

  return redirect('/signin');
};
