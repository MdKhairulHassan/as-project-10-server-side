const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const app = express();
const port = process.env.PORT || 3000;

// console.log(process.env);

// ===================================================================================
// for firebase-admin old version:
// const admin = require('firebase-admin');
// const serviceAccount = require('./finease-finance-management-firebase-admin-key.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// ===================================================================================
const serviceAccount = require('./finease-finance-management-firebase-admin-key.json');

initializeApp({
  credential: cert(serviceAccount),
});

// ===================================================================================
// middleware use in everywhere
app.use(cors());
app.use(express.json());

// middleware use in only a specific function
const logger = (req, res, next) => {
  console.log('logging information');
  next();
};

// ===================================================================================
// for firebase-admin old version:
// const verifyFireBaseToken = async (req, res, next) => {
//   console.log('in the verify middleware', req.headers.authorization);
//   if (!req.headers.authorization) {
//     // do not allow to go
//     return res.status(401).send({ message: 'unauthorized access' });
//   }
//   const token = req.headers.authorization.split(' ')[1];
//   if (!token) {
//     return res.status(401).send({ message: 'unauthorized access' });
//   }

//   try {
//     const userInfo = await admin.auth().verifyIdToken(token);
//     console.log('after token validation', userInfo);
//     // verify token
//     next();
//   } catch {
//     return res.status(401).send({ message: 'unauthorized access' });
//   }
//   // next();
// };

// ===================================================================================
// console.log('service', serviceAccount);
// console.log('admin', admin);
// console.log('admin credential', admin.credential);

// ===================================================================================
// for firebase admin version 14
const verifyFireBaseToken = async (req, res, next) => {
  // console.log('in the verify middleware', req.headers.authorization);
  if (!req.headers.authorization) {
    return res.status(401).send({
      message: 'Unauthorized access',
    });
  }

  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' });
  }

  try {
    const decoded = await getAuth().verifyIdToken(token);
    // console.log('after token validation', decoded);
    req.token_email = decoded.email;

    next();
  } catch (err) {
    console.log('invalid token');
    return res.status(401).send({
      message: 'Unauthorized access',
    });
  }
};
// ===================================================================================
// already created in old project name and password:
// personalfmUser
// RvYrAGqMqWo0cIGb;

// const uri =
//   'mongodb+srv://personalfmUser:RvYrAGqMqWo0cIGb@cluster0.1daujou.mongodb.net/?appName=Cluster0';

// ===================================================================================
// const uri = `mongodb+srv://${process.env.PFM_USER}:${process.env.PFM_PASS}@cluster0.if3njeq.mongodb.net/?appName=Cluster0`;

// const uri = `mongodb://${process.env.PFM_USER}:${process.env.PFM_PASS}@ac-uxcxunb-shard-00-00.if3njeq.mongodb.net:27017,ac-uxcxunb-shard-00-01.if3njeq.mongodb.net:27017,ac-uxcxunb-shard-00-02.if3njeq.mongodb.net:27017/?tls=true&replicaSet=atlas-7xhikn-shard-0&authSource=admin&appName=Cluster0`;

// const uri = process.env.MONGODB_URI;

// ================================
// console.log('server uri:', uri);

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// ===================================================================================
let client;

async function connectMongo() {
  const uris = [process.env.MONGODB_URI_SRV, process.env.MONGODB_URI_STANDARD];

  for (const uri of uris) {
    try {
      const tempClient = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });

      await tempClient.connect();

      console.log(
        `Connected using ${uri.startsWith('mongodb+srv') ? 'SRV' : 'Standard'} URI`,
      );

      client = tempClient;
      return;
    } catch (err) {
      console.log(
        `Failed using ${uri.startsWith('mongodb+srv') ? 'SRV' : 'Standard'} URI`,
      );
      console.log(err.code || err.message);
    }
  }

  throw new Error('Could not connect to MongoDB.');
}

// ===================================================================================
app.get('/', (req, res) => {
  res.send('personal finance management Server is running');
});

async function run() {
  try {
    // await client.connect();
    await connectMongo();

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

    // ===================================================================================
    // transaction related apis
    app.get('/transactions', logger, verifyFireBaseToken, async (req, res) => {
      // console.log('headers', req);
      const email = req.query.email;
      const query = {};
      if (email) {
        if (email !== req.token_email) {
          return res.status(403).send({ message: 'forbidden access' });
        }
        query.email = email;
      }
      const cursor = transactionsCollection.find(query).sort({ createdAt: -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    // ===================================================================================
    // app.post('/transactions', async (req, res) => {
    //   const newTransaction = req.body;
    //   const result = await transactionsCollection.insertOne(newTransaction);
    //   res.send(result);
    // });

    // ===================================================================================
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

    // ===================================================================================
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

    // ===================================================================================
    app.delete('/transactions/:id', async (req, res) => {
      const id = req.params.id;

      const result = await transactionsCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });

    // ===================================================================================
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

// ===================================================================================
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
