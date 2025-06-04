const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000
require('dotenv').config()

app.use(cors());
app.use(express.json());


// job_Admin
// vgHrvvxno3IVwj5k

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sajjadjim15.ac97xgz.mongodb.net/?retryWrites=true&w=majority&appName=SajjadJim15`;

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
    // await client.connect();

    // ALL Data Fetch From Database
    const jobsCollection = client.db('CrrearCode').collection('jobs')
    // Jobs API 
    app.get('/jobs', async (req, res) => {

      // search a specefic uwer by the customs parameter 
      const email = req.query.email
      const query = {};
      if (email) {
        query.hr_email = email
      }

      const currsor = jobsCollection.find(query);
      const result = await currsor.toArray()
      res.send(result)
    })

    // single Job Card Details Taken From Databse
    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await jobsCollection.findOne(query)
      res.send(result)
    })


    // Application for Job That code here write here------------------------------- 


    app.post('/jobs', async (req, res) => {
      const newJob = req.body;
      console.log(newJob)
      const result = await jobsCollection.insertOne(newJob)
      res.send(result)
    })

    // find the Data collection email base selection find 
    app.get('/applications', async (req, res) => {
      const email = req.query.email;
      const query = {
        email: email
      }
      const result = await applicationCollection.find(query).toArray();

      for (const application of result) {
        const jobId = application.jobId;
        const jobQuery = { _id: new ObjectId(jobId) };
        const job = await jobsCollection.findOne(jobQuery);
        application.job = job;
      }
      res.send(result);
    })

    const applicationCollection = client.db('CrrearCode').collection('applications');
    app.post('/applications', async (req, res) => {
      const application = req.body;
      const result = await applicationCollection.insertOne(application);
      res.send(result);
    })

    // find the job particular single by , How many application are submit in one JOB 
    app.get('/applications/job/:job_id' , async(req , res)=>{
      const job_id = req.params.job_id;
    console.log(job_id)
      const query = {jobId : job_id}
      const result = await applicationCollection.find(query).toArray()
      res.send(result);
    })

    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  finally {

  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


app.get('/', (req, res) => {
  res.send('Job portal server side code is running here 24 Hours....')
})