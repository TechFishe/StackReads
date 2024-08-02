import type { APIRoute, AstroCookieSetOptions } from 'astro';

import { MongoClient, ObjectId, type Filter } from 'mongodb';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

const { sign } = jwt;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const pass = import.meta.env.MONGO_DB_SIGNIN_PASS;

  const data = (await request.json()) as SignInData;

  const mongo = new MongoClient(`mongodb+srv://signin:${pass}@main.zc2oijy.mongodb.net/?retryWrites=true&w=majority&appName=Main`);
  const userDb = mongo.db('Gen').collection<UserDoc>('users');

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

    let refreshToken: string = '';
    if (data.remember) refreshToken = sign({ uid: user._id }, import.meta.env.JWT_REFRESH_PASS, { expiresIn: '14d' });
    else refreshToken = sign({ uid: user._id }, import.meta.env.JWT_REFRESH_PASS, { expiresIn: '1d' });

    const userToken = sign(
      {
        createdAt: user.createdAt,
        lastSignedIn: user.lastSignedIn,
        email: user.email,
        phone: user.phone,
        pass: user.pass,
        username: user.username,
        age: user.age,
        gender: user.gender,
        animal: user.animal,
        pfp: user.pfp,
      },
      import.meta.env.JWT_PASS,
      { expiresIn: '10m' }
    );
    const options: AstroCookieSetOptions = {
      path: '/',
    };

    cookies.set('user', userToken, options);
    cookies.set('refresh', refreshToken, options);

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

  return redirect('/user');
};
