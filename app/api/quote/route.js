import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://dmbdz31:fla4AJXoQ7oddmB8@cluster0.cd1zfma.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export async function POST(request) {
  try {
    const data = await request.json();
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    await client.connect();
    const db = client.db("car_imports"); // nom de la base, tu peux changer
    const collection = db.collection("quotes"); // nom de la collection, tu peux changer
    await collection.insertOne({
      ...data,
      createdAt: new Date()
    });
    await client.close();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
} 