const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000


app.use(cors())
app.use(express.json());

// user: coffee_server
// password :zSUMjmOzDeU2hpvc


const uri = `mongodb+srv://coffee_server:zSUMjmOzDeU2hpvc@sajjadjim15.ac97xgz.mongodb.net/?retryWrites=true&w=majority&appName=SajjadJim15`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version---
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
    // await client.connect();

    const coffeesCollection = client.db('coffeeDB').collection('coffees')

    // Add Coffee Data new here Logic Write 
    app.post('/coffees', async (req, res) => {
      const newCoffee = req.body
      console.log(newCoffee)
      const result = await coffeesCollection.insertOne(newCoffee)
      res.send(result)
    })
   
    // Update coffee Data in single row ------------------------------------
    // ------------------------------------------------------------------------
    app.put('/coffees/:id' , async(req, res)=>{
      const id = req.params.id
      const filterData = {_id : new ObjectId(id)}
      const options = { upsert : true};
      // Full object Taken Here 
      const updatedCoffee = req.body

      const updatedDoc = {
        $set : updatedCoffee
      } 
      const result = await coffeesCollection.updateOne(filterData ,updatedDoc , options)
      res.send(result)
    })
// ----------------------------------------------------------------------------------------------------------
    //  ALL Data taken from Database 
    app.get('/coffees', async (req, res) => {
      const result = await coffeesCollection.find().toArray();
      res.send(result)
    })

    //  single items Find here __________________________
    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await coffeesCollection.findOne(query)
      res.send(result)
    })


    //Delte Items
    app.delete('/coffees/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await coffeesCollection.deleteOne(query)
      res.send(result)
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


app.get('/', (req, res) => {
  res.send('Coffee is hoster than server !!!')
})

app.listen(port, () => {
  console.log(`Coffee server is running on port ${port}`)
})
