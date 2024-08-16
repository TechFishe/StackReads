import type { APIRoute } from 'astro';
import { MongoClient, ObjectId, type Filter } from 'mongodb';

interface requestData {
  listId: string;
  bookId: string;
}

export const POST: APIRoute = async ({ request }) => {
  const data = (await request.json()) as requestData;

  const pass = import.meta.env.MONGO_DB_GENERAL_PASS;
  const mongo = new MongoClient(`mongodb+srv://general:${pass}@main.zc2oijy.mongodb.net/?retryWrites=true&w=majority&appName=Main`);
  const listDb = mongo.db('Public').collection<listDoc>('lists');

  try {
    await listDb.updateOne(
      {
        _id: new ObjectId(data.listId),
      },
      { $push: { books: data.bookId } }
    );
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 500,
    });
  } finally {
    mongo.close();
    return new Response(null, {
      status: 201,
    });
  }
};
