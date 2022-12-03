import { MongoClient, ServerApiVersion } from "mongodb";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lmgyoex.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

const fun = async () => {
  client.connect(async (err) => {
    const collection = client
      .db("sample_airbnb")
      .collection("listingsAndReviews");
    // perform actions on the collection object
    const data = await collection.findOne(
      { name: "Ribeira Charming Duplex" },
      {
        projection: { _id: 0, listing_url: 1, name: 1, property_type: 1 },
      }
    );
    console.log({ data });
    client.close();
  });
};
