const express = require('express')
const cors = require('cors');
const app = express()
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 3000
require('dotenv').config()

// middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://job-portal-d07d2.web.app'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const logger = (req, res, next) => {
  console.log("Inside  the logger middleware")
  next()
}

// verify the token validity time here 
const verifyToken = (req, res, next) => {
  const token = req?.cookies.token;
  console.log("Cookie in the middlewear",token)

  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' })
  }

  // verify token accesscibilit  and expired Date
  jwt.verify(token , process.env.JWT_ACCESS_SECRET , (err , decoded)=>{
    if(err){
      return res.status(401).send({message : 'unAthorized Access'})
    }
    req.decoded = decoded
    // console.log(decoded)
     next()
  })

}

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

    // jwt Token related APi 
    app.post('/jwt', (req, res) => {
      const userData = req.body;
      const token = jwt.sign(userData, process.env.JWT_ACCESS_SECRET, { expiresIn: '2d' })

      // set the token in the cookies 
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,

      })
      res.send({ successfully: true });
      res.send(token)
    })


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
    app.get('/applications', logger, verifyToken, async (req, res) => {
      const email = req.query.email;

      // Cookies realated concept 
      // console.log("In side the application API " ,req.cookies)
      
      // If my email addess is verified i will get the data other wise i can not get the data from, the storage 
     if(email !== req.decoded.email){
      return res.status(403).send({message : 'Forbidden access'})
     }

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
    app.get('/applications/job/:job_id', async (req, res) => {
      const job_id = req.params.job_id;
      console.log(job_id)
      const query = { jobId: job_id }
      const result = await applicationCollection.find(query).toArray()
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  finally {

  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Job app server running  on port ${port}`)
})


app.get('/', (req, res) => {
  res.send('Job portal server side code is running here 24 Hours....')
})