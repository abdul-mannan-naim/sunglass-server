const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1zdgrcr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri)

async function run() {

  try {
    const availableCollection = client.db("sunglass").collection("available");
    const cardCollection = client.db("sunglass").collection("card");



    app.post('/card', async (req, res) => {
      const query = req.body;
      const result = await cardCollection.insertOne(query)
      res.send(result)
    })
    app.get('/card', async (req, res) => {
      const query = {}
      const result = await cardCollection.find(query).limit(4).toArray()
      res.send(result)
    })
    app.delete('/delete', async (req, res) => {
      const query = {}
      const result = await cardCollection.deleteMany(query)
      res.send(result)
    })
    app.delete('/delete/:id', async (req, res) => {
      const id = new ObjectId(req.params.id);
      const query = { _id: id };
      const result = await cardCollection.deleteOne(query)
      res.send(result)
    })

    app.post('/randomCard', async (req, res) => {
      const query = req.body;
      const skip = await cardCollection.deleteMany({})
      if (skip) {
        const result = await cardCollection.insertOne(query)
        res.send( result  )
      } 
    })

    // -----------------------------------

    app.post('/addItem', async (req, res) => {
      const query = req.body;
      const result = await availableCollection.insertOne(query)
      res.send(result)
    })
    app.get('/items', async (req, res) => {
      const query = {}
      const result = await availableCollection.find(query).toArray()
      res.send(result)
    })


  }
  finally {

  }

}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})











