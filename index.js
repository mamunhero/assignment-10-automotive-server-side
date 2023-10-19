const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER_BRAND}:${process.env.DB_PASS_BRAND}@cluster0.clf7ui5.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Connect to the "brandDB" database and access its "brandCollection" collection
    const database = client.db("brandDB");
    const brandCollection = database.collection("brand");

    // post
    app.post("/brand", async(req, res)=> {
      const brandInfo = req.body;
      // console.log(brandInfo);
      const result = await brandCollection.insertOne(brandInfo);
      res.send(result);
      // console.log(result);
    })
    // get
    app.get("/brand", async(req, res)=> {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
      console.log(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get("/", (req, res)=> {
  res.send("Brand automotive server is running")
});

app.listen(port, ()=> {
  console.log(`Brand server is running port:${5000}`)
});