const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const admin = require("firebase-admin");

const decoded = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf8')
const serviceAccount = JSON.parse(decoded);

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DbAdmin}:${process.env.DbPassword}@sajjadjim15.ac97xgz.mongodb.net/?retryWrites=true&w=majority&appName=SajjadJim15`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const verifyFireBaseToken = async (req, res, next) => {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'unauthorized access' })
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        console.log('decoded token', decoded);
        req.decoded = decoded;
        next();
    }

    catch (error) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
}


async function run() {
    try {

        const itemsCollection = client.db("itemsLostAndFound").collection("itemsAll");

        //-----------------------------------------------------------------------------------------------------------
        // Get all items Lost And Found Items
        app.get('/itemsAll', async (req, res) => {
            const email = req.query.email
            const query = {};
            if (email) {
                query.email = email
            }
            const cursor = itemsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);

        })


        //----------------------------------------------------------------------------------------------------------
        // single Lost and Found users  Card Details Taken From Databse
        app.get('/itemsAll/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await itemsCollection.findOne(query)
            res.send(result)
        })

        //----------------------------------------------------------------------------------------------------------
        // User Add the Lost / Found new Items That Code Here 
        app.post('/itemsAll', async (req, res) => {
            const items = req.body;
            const result = await itemsCollection.insertOne(items);
            res.send(result);
        })
        //----------------------------------------------------------------------------------------------------------
        // Update The Lost and Found Data in single row ------------------------------------
        // ------------------------------------------------------------------------
        app.put('/itemsAll/:id', async (req, res) => {
            const id = req.params.id
            const filterData = { _id: new ObjectId(id) }
            const options = { upsert: true };
            // Full object Taken Here 
            const updatedItem = req.body

            const updatedDoc = {
                $set: updatedItem
            }
            const result = await itemsCollection.updateOne(filterData, updatedDoc, options)
            res.send(result)
        })
        //Delete Items
        app.delete('/itemsAll/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await itemsCollection.deleteOne(query)
            res.send(result)
        })


        // Here the recover Items Part Doing --------------------------------------------
        const recoverItemsCollection = client.db("itemsLostAndFound").collection("recoverItems");
        // Get all items Lost And Found Items
        app.get('/recoverItems',verifyFireBaseToken, async (req, res) => {
            const email = req.query.email

            if (email !== req.decoded.email) {
                return res.status(403).send({ message: 'forbidden access' })
            }

            const query = {};
            if (email) {
                query.userEmail = email
            }
            const cursor = recoverItemsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        //----------------------------------------------------------------------------------------------------------
        // User Add the Lost / Found new Items That Code Here 
        app.post('/recoverItems', async (req, res) => {
            const items = req.body;
            const result = await recoverItemsCollection.insertOne(items);
            res.send(result);
        })


        // Id  password using user Data store the data base on the code 
        //----------------------------------------------------------------------------------------------------------
        const usersCollection = client.db("itemsLostAndFound").collection("users");
        // Id password user information store here 
        app.get('/users',verifyFireBaseToken, async (req, res) => {
            const email = req.query.email
            const query = {};
            if (email) {
                query.email = email
            }
            const cursor = usersCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
        //----------------------------------------------------------------------------------------------------------
        // User Add the Lost / Found new Items That Code Here 
        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await usersCollection.insertOne(users);
            res.send(result);
        })

        const collectionFeedback = client.db('itemsLostAndFound').collection('feedback')
        // Feedback collect from user  
        app.post('/feedback', async (req, res) => {
            const feedback = req.body;
            const result = await collectionFeedback.insertOne(feedback);
            res.send(result);
        })

        app.get('/feedback', async (req, res) => {
            const cursor = collectionFeedback.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Job app server running  on port ${port}`)
})


app.get('/', (req, res) => {
    res.send('Items Lost and Found Portal portal server side code is running here 24 Hours....')
})