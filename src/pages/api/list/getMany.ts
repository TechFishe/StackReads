import type { APIRoute } from 'astro';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const { verify, decode } = jwt;

export const GET: APIRoute = async ({ cookies }) => {
  if (!cookies.has('refresh') || !cookies.has('user')) {
    return new Response(null, {
      status: 400,
    });
  }

  const jwtPass = import.meta.env.JWT_REFRESH_PASS;
  //@ts-expect-error
  const tempUid: string | null = verify(cookies.get('refresh')?.value, jwtPass, (err, decoded) => {
    if (err) return null;

    //@ts-expect-error
    return decoded.uid as string;
  });

  if (!tempUid)
    return new Response(null, {
      status: 400,
    });

  //@ts-expect-error
  const user = decode(cookies.get('user')?.value) as WithId<PublicUserDoc>;

  if (tempUid !== user._id)
    return new Response(null, {
      status: 400,
    });

  try {
    const uid = new ObjectId(tempUid);
    const mongoPass = import.meta.env.MONGO_DB_GENERAL_PASS;
    const mongo = new MongoClient(`mongodb+srv://general:${mongoPass}@main.zc2oijy.mongodb.net/?retryWrites=true&w=majority&appName=Main`);
    const listDb = mongo.db('Public').collection<listDoc>('lists');
    const lists = await listDb
      .find({
        userId: uid,
      })
      .toArray();

    return new Response(JSON.stringify(lists), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 500,
    });
  }
};
