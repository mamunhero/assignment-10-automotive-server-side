const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const productCollection = database.collection("product");
    const cartCollection = database.collection("cart");
    // brand post
    app.post("/brand", async(req, res)=> {
      const brandInfo = req.body;
      // console.log(brandInfo);
      const result = await brandCollection.insertOne(brandInfo);
      res.send(result);
      // console.log(result);
    })
    // brand get read
    app.get("/brand", async(req, res)=> {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
      console.log(result);
    })
    // get when brand update
    app.get("/brand/:brandname", async (req, res) => {
      const brandname = req.params.brandname;
      const cursor = { name: brandname }; 
      const result = await brandCollection.find(cursor).toArray();
      res.send(result);
      console.log(result);
    });

    // post addproducts
    app.post("/addProduct", async(req, res)=>{
      const newProduct = req.body
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
      console.log(result);
    })

    // get addproduct
    app.get("/addProduct", async(req, res)=> {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
      console.log(result);
    })

    // get addproduct for update
    app.get("/addProduct/:id", async(req, res)=> {
      const id = req.params.id;
      const query = {_id:new ObjectId(id)};
      const result = await productCollection.findOne(query);
      res.send(result);
      console.log(result);
    })

    // put addproduct for update from
    app.put("/addProduct/:id", async(req, res)=> {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updatedProduct = req.body;
      const newUpdatedProduct = {
        $set:{
          name:updatedProduct.name,
          productname:updatedProduct.productname,
          image:updatedProduct.image,
          type:updatedProduct.type,
          price:updatedProduct.price,
          rating:updatedProduct.rating
        }
      }
      const result = await productCollection.updateOne(filter, newUpdatedProduct, options);
      res.send(result);
      console.log(result);
    })
  // finished put

   // get for detailes
   app.get("/addProduct/details/:id", async(req, res)=> {
    const id = req.params.id;
    const query = {_id:new ObjectId(id)};
    const result = await productCollection.findOne(query);
    res.send(result);
    console.log(result);
  })
  // finish detailes 

  // start cartcolection post
  app.post("/addToCart", async(req, res)=> {
    const cart = req.body;
    console.log(cart);
    const result = await cartCollection.insertOne(cart)
    res.send(result);
    console.log(result);
  })
  // finished catCollection post
  // start cartCollection get
  app.get("/addToCart", async(req, res)=> {
    const cursor = cartCollection.find();
    const result = await cursor.toArray();
    res.send(result);
    console.log(result);
  })
  // finished cartColection get
  // start cartCollection delete
  app.delete("/addToCart/:id", async(req, res)=> {
    const id = req.params.id;
    const query = {_id:new ObjectId(id)};
    const result = await cartCollection.deleteOne(query);
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

