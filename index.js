const express=require('express')
const cors=require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const app=express();
const port=process.env.PORT || 5000;


//middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.juc5u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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

    const coffeeCollection = client.db("coffeeDB").collection('coffee');
     

    //2 show data client side
    app.get('/coffee',async(req,res) =>{
        const cursur=coffeeCollection.find();
        const result=await cursur.toArray();
        res.send(result)
    })

     
    //1 recive data client
    app.post('/coffee', async(req,res)=>{
        const newCoffee=req.body;
        console.log(newCoffee)
        const result=await coffeeCollection.insertOne(newCoffee)
        res.send(result)
    })

    //3 delete
    app.delete('/coffee/:id',async(req,res) =>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
        const result=await coffeeCollection.deleteOne(query)
        res.send(result)
    })

    //4 updata data
    app.get('/coffee/:id',async(req,res) =>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result=await coffeeCollection.findOne(query)
      res.send(result)
})

//5 update client side
app.put('/coffee/:id',async(req,res) =>{
  const id=req.params.id;
  const updateCoffee=req.body;
  
  const filter={_id: new ObjectId(id)}
  const options={upsert: true}
  const coffee={
    $set:{
      name:updateCoffee.name,
      details: updateCoffee.details,
      photo: updateCoffee.photo,
       chef:updateCoffee.chef,
        supplier:updateCoffee.supplier,
         taste:updateCoffee.taste,
          category:updateCoffee.category,
     
      
    }
  }
  const result=await coffeeCollection.updateOne(filter,coffee,options)
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


app.get('/', (req,res) =>{
    res.send('user  server is runing')
})


app.listen(port, ()=>{
    console.log(`server is running on port ${port}`)
})
