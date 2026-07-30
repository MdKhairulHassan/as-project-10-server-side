const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// console.log(process.env);

// middleware
app.use(cors());
app.use(express.json());

// =====================================================================
// already created in old project name and password:
// personalfmUser
// RvYrAGqMqWo0cIGb;

// const uri =
//   'mongodb+srv://personalfmUser:RvYrAGqMqWo0cIGb@cluster0.1daujou.mongodb.net/?appName=Cluster0';

// =====================================================================
const uri = `mongodb+srv://${process.env.PFM_USER}:${process.env.PFM_PASS}@cluster0.if3njeq.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get('/', (req, res) => {
  res.send('personal finance management Server is running');
});

async function run() {
  try {
    await client.connect();

    const db = client.db('personal_fm');
    const transactionsCollection = db.collection('transactions');
    const usersCollection = db.collection('users');
    // const balanceCollection = db.collection('balanceOverview');

    // USERS APIs
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const email = req.body.email;
      const query = { email: email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        res.send({
          message: 'user already exit. do not need to insert him again',
        });
      } else {
        const result = await usersCollection.insertOne(newUser);
        res.send(result);
      }
    });

    // BALANCE APIs
    // app.get('/balance', async (req, res) => {
    //   // const projectField = { _id: 0, title: 1, amount: 1 };
    //   // const cursor = balanceCollection
    //   //   .find()
    //   //   .sort({ amount: -1 })
    //   //   .skip(2)
    //   //   .limit(2)
    //   //   .project(projectField);

    //   console.log(req.query);
    //   const email = req.query.email;
    //   const query = {};
    //   if (email) {
    //     query.email = email;
    //   }

    //   const cursor = balanceCollection.find(query).limit(3);
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });

    // app.get('/latest-balance', async (req, res) => {
    //   const cursor = balanceCollection.find().sort({ amount: 1 });
    //   const result = await cursor.toArray();
    //   res.send(result);

    //   // =========================================
    //   // const email = req.query.email;
    //   // const query = {};
    //   // if (email) {
    //   //   query.email = email;
    //   // }
    //   // const cursor = balanceCollection.find(query);
    //   // const result = await cursor.toArray();
    //   // res.send(result);
    // });

    // app.get('/balance/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await balanceCollection.findOne(query);
    //   res.send(result);
    // });

    // app.post('/balance', async (req, res) => {
    //   const newBalance = req.body;
    //   const result = await balanceCollection.insertOne(newBalance);
    //   res.send(result);
    // });

    // app.patch('/balance/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const updatedBalance = req.body;
    //   const query = { _id: new ObjectId(id) };
    //   const update = {
    //     // $set: updatedBalance,
    //     $set: {
    //       name: updatedBalance.name,
    //       amount: updatedBalance.amount,
    //     },
    //   };
    //   const result = await balanceCollection.updateOne(query, update);
    //   res.send(result);
    // });

    // app.delete('/balance/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id) };
    //   const result = await balanceCollection.deleteOne(query);
    //   res.send(result);
    // });

    // transaction related apis
    app.get('/transactions', async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }
      const cursor = transactionsCollection.find(query).sort({ createdAt: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    // app.post('/transactions', async (req, res) => {
    //   const newTransaction = req.body;
    //   const result = await transactionsCollection.insertOne(newTransaction);
    //   res.send(result);
    // });

    app.post('/transactions', async (req, res) => {
      // const transaction = req.body;

      // // Convert string into real MongoDB Date
      // transaction.date = new Date(transaction.date);

      // transaction.createdAt = new Date();

      const transaction = {
        ...req.body,
        date: new Date(req.body.date),
        createdAt: new Date(),
      };

      const result = await transactionsCollection.insertOne(transaction);

      res.send(result);
    });

    // ============================================================
    app.patch('/transactions/:id', async (req, res) => {
      const id = req.params.id;

      const updated = req.body;

      const query = {
        _id: new ObjectId(id),
      };

      const update = {
        $set: updated,
      };

      const result = await transactionsCollection.updateOne(
        query,

        update,
      );

      res.send(result);
    });

    // ============================================================
    app.delete('/transactions/:id', async (req, res) => {
      const id = req.params.id;

      const result = await transactionsCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });

    // ============================================================
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!',
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`personal finance management server is running on port: ${port}`);
});

// ====================================================
// client
//   .connect()
//   .then(() => {
//     app.listen(port, () => {
//       console.log(
//         `personal finance management server is running now on port: ${port}`,
//       );
//     });
//   })
//   .catch(console.dir);
