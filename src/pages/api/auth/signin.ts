import type { APIRoute } from 'astro';

import { MongoClient, ObjectId, type Filter } from 'mongodb';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

const { sign } = jwt;

export const POST: APIRoute = async ({ request }) => {
  const pass = import.meta.env.MONGO_DB_SIGNIN_PASS;

  const data = (await request.json()) as SignInData;

  const mongo = new MongoClient(`mongodb+srv://signin:${pass}@main.zc2oijy.mongodb.net/?retryWrites=true&w=majority&appName=Main`);
  const userDb = mongo.db('Gen').collection<UserDoc>('users');

  let uidToken: string = '';

  try {
    const duplicateQuery: Filter<UserDoc> = {
      email: data.email,
    };

    const matches = await userDb.find(duplicateQuery).toArray();
    if (matches.length === 0)
      return new Response(
        JSON.stringify({
          text: 'Invalid email',
        } as ErrorInfo),
        {
          status: 404,
        }
      );

    const user = matches[0];
    const passMatch = await compare(data.pass, '$2b$12$' + user.pass);
    if (!passMatch)
      return new Response(
        JSON.stringify({
          text: 'Invalid password',
        } as ErrorInfo),
        {
          status: 401,
        }
      );

    const refreshToken = sign(user._id.toString(), import.meta.env.JWT_REFRESH_PASS);
    const tokenDb = mongo.db('Gen').collection<TokenDoc>('tokens');
    await tokenDb.insertOne({
      createdAt: new Date(),
      uid: user._id,
      token: refreshToken,
    });

    if (data.remember) {
      uidToken = sign({ uid: user._id }, import.meta.env.JWT_UID_PASS);
    } else {
      uidToken = sign({ uid: user._id }, import.meta.env.JWT_UID_PASS, { expiresIn: '1h' });
    }

    await userDb.updateOne({ _id: user._id }, { $set: { lastSignedIn: new Date() } });
  } catch (err: any) {
    console.error(err);
    return new Response(
      JSON.stringify({
        text: 'Unable to sign in',
      } as ErrorInfo),
      {
        status: 500,
      }
    );
  } finally {
    await mongo.close();
  }

  return new Response(
    JSON.stringify({
      uidToken: uidToken,
    }),
    {
      status: 201,
    }
  );
};
