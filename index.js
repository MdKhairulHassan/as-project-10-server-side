// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// // for JWT token
// // const jwt = require('jsonwebtoken');
// // const token = jwt.sign({ foo: 'bar' }, 'shhhhh');

// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// const { initializeApp, cert } = require('firebase-admin/app');
// const { getAuth } = require('firebase-admin/auth');

// const app = express();
// const port = process.env.PORT || 3000;

// // console.log(process.env);

// // ===================================================================================
// // for firebase-admin old version:
// // const admin = require('firebase-admin');
// // const serviceAccount = require('./finease-finance-management-firebase-admin-key.json');
// // admin.initializeApp({
// //   credential: admin.credential.cert(serviceAccount),
// // });

// // ===================================================================================
// const serviceAccount = require('./finease-finance-management-firebase-admin-key.json');

// initializeApp({
//   credential: cert(serviceAccount),
// });

// // ===================================================================================
// // middleware use in everywhere
// app.use(cors());

// // =========
// // app.use(express.json());
// app.use(express.json({ limit: '10kb' }));

// // ===================================================================================
// // middleware use in only a specific function
// // const logger = (req, res, next) => {
// //   console.log('logging information');
// //   next();
// // };

// // ===================================================================================
// // for firebase-admin old version:
// // const verifyFireBaseToken = async (req, res, next) => {
// //   console.log('in the verify middleware', req.headers.authorization);
// //   if (!req.headers.authorization) {
// //     // do not allow to go
// //     return res.status(401).send({ message: 'unauthorized access' });
// //   }
// //   const token = req.headers.authorization.split(' ')[1];
// //   if (!token) {
// //     return res.status(401).send({ message: 'unauthorized access' });
// //   }

// //   try {
// //     const userInfo = await admin.auth().verifyIdToken(token);
// //     console.log('after token validation', userInfo);
// //     // verify token
// //     next();
// //   } catch {
// //     return res.status(401).send({ message: 'unauthorized access' });
// //   }
// //   // next();
// // };

// // ===================================================================================
// // console.log('service', serviceAccount);
// // console.log('admin', admin);
// // console.log('admin credential', admin.credential);

// // ===================================================================================
// // for firebase admin version 14
// const verifyFireBaseToken = async (req, res, next) => {
//   // console.log('in the verify middleware', req.headers.authorization);

//   const authorization = req.headers.authorization;

//   // ========================================== not better for secure ----- 'Bearer ' and token
//   if (!authorization) {
//     return res.status(401).send({
//       message: 'Unauthorized access',
//     });
//   }

//   // const token = authorization.slice(7).trim();

//   // ========================================== better for secure ----- 'Bearer ' and token
//   if (!authorization?.startsWith('Bearer ')) {
//     return res.status(401).send({
//       message: 'Unauthorized access',
//     });
//   }

//   const token = authorization.split(' ')[1];

//   // ==========================================
//   if (!token) {
//     return res.status(401).send({ message: 'unauthorized access' });
//   }

//   try {
//     const decoded = await getAuth().verifyIdToken(token);

//     if (!decoded.email) {
//       return res.status(401).send({
//         // message: 'Authenticated user has no email',
//         message: 'Unauthorized access',
//       });
//     }

//     req.token_email = decoded.email;
//     // console.log('after token validation', decoded);

//     next();
//   } catch (err) {
//     console.log('invalid token');
//     return res.status(401).send({
//       message: 'Unauthorized access',
//     });
//   }
// };

// // ===================================================================================
// // const verifyJWTToken = async (req, res, next) => {
// //   // console.log('in the JWT verify middleware', req.headers);
// //   if (!req.headers.authorization) {
// //     return res.status(401).send({
// //       message: 'Unauthorized access',
// //     });
// //   }

// //   const token = req.headers.authorization.split(' ')[1];

// //   if (!token) {
// //     return res.status(401).send({ message: 'unauthorized access' });
// //   }

// //   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
// //     if (err) {
// //       return res.status(401).send({ message: 'unauthorized access' });
// //     }
// //     console.log('after decoded', decoded);
// //     req.token_email = decoded.email;
// //     next();
// //   });
// // };

// // ===================================================================================
// // already created in old project name and password:
// // personalfmUser
// // RvYrAGqMqWo0cIGb;

// // const uri =
// //   'mongodb+srv://personalfmUser:RvYrAGqMqWo0cIGb@cluster0.1daujou.mongodb.net/?appName=Cluster0';

// // ===================================================================================
// // const uri = `mongodb+srv://${process.env.PFM_USER}:${process.env.PFM_PASS}@cluster0.if3njeq.mongodb.net/?appName=Cluster0`;

// // const uri = `mongodb://${process.env.PFM_USER}:${process.env.PFM_PASS}@ac-uxcxunb-shard-00-00.if3njeq.mongodb.net:27017,ac-uxcxunb-shard-00-01.if3njeq.mongodb.net:27017,ac-uxcxunb-shard-00-02.if3njeq.mongodb.net:27017/?tls=true&replicaSet=atlas-7xhikn-shard-0&authSource=admin&appName=Cluster0`;

// // const uri = process.env.MONGODB_URI;

// // ================================
// // console.log('server uri:', uri);

// // const client = new MongoClient(uri, {
// //   serverApi: {
// //     version: ServerApiVersion.v1,
// //     strict: true,
// //     deprecationErrors: true,
// //   },
// // });

// // ===================================================================================
// // let client;

// // async function connectMongo() {
// //   const uris = [process.env.MONGODB_URI_SRV, process.env.MONGODB_URI_STANDARD];

// //   for (const uri of uris) {
// //     try {
// //       const tempClient = new MongoClient(uri, {
// //         serverApi: {
// //           version: ServerApiVersion.v1,
// //           strict: true,
// //           deprecationErrors: true,
// //         },
// //       });

// //       await tempClient.connect();

// //       console.log(
// //         `Connected using ${uri.startsWith('mongodb+srv') ? 'SRV' : 'Standard'} URI`,
// //       );

// //       client = tempClient;
// //       return;
// //     } catch (err) {
// //       console.log(
// //         `Failed using ${uri.startsWith('mongodb+srv') ? 'SRV' : 'Standard'} URI`,
// //       );
// //       console.log(err.code || err.message);
// //     }
// //   }

// //   throw new Error('Could not connect to MongoDB.');
// // }

// // ===================================================================================
// let client;

// async function connectMongo() {
//   const uris = [process.env.MONGODB_URI_SRV, process.env.MONGODB_URI_STANDARD];

//   while (true) {
//     console.log('If both url fail then retry after 1 Day later');

//     for (const uri of uris) {
//       try {
//         const tempClient = new MongoClient(uri, {
//           serverApi: {
//             version: ServerApiVersion.v1,
//             strict: true,
//             deprecationErrors: true,
//           },
//         });

//         await tempClient.connect();

//         console.log(
//           `Connected using ${
//             uri.startsWith('mongodb+srv') ? 'SRV' : 'Standard'
//           } URI`,
//         );

//         client = tempClient;

//         return;
//       } catch (err) {
//         console.log(
//           `Failed using ${
//             uri.startsWith('mongodb+srv') ? 'SRV' : 'Standard'
//           } URI`,
//         );

//         console.log(err.code || err.message);
//       }
//     }

//     console.log('Both MongoDB URIs failed. Retrying in 1 Day...');

//     await new Promise(resolve => {
//       // setTimeout(resolve, 24 * 60 * 60 * 1000);
//       setTimeout(resolve, 2 * 60 * 1000);
//     });
//   }
// }

// // ===================================================================================
// app.get('/', (req, res) => {
//   res.send('personal finance management Server is running');
// });

// async function run() {
//   try {
//     // =====================
//     // await client.connect();

//     // =====================
//     await connectMongo();

//     // =====================
//     const db = client.db('personal_fm');
//     const transactionsCollection = db.collection('transactions');
//     // const usersCollection = db.collection('users');
//     // const balanceCollection = db.collection('balanceOverview');

//     // =====================
//     // // JWT related APIs
//     // app.post('/getToken', (req, res) => {
//     //   const loggedUser = req.body;
//     //   // const token = jwt.sign({ email: 'abc' },
//     //   const token = jwt.sign(loggedUser, process.env.JWT_SECRET, {
//     //     expiresIn: '1h',
//     //   });
//     //   res.send({ token: token });
//     // });

//     // =====================
//     // BALANCE APIs
//     // app.get('/balance', async (req, res) => {
//     //   // const projectField = { _id: 0, title: 1, amount: 1 };
//     //   // const cursor = balanceCollection
//     //   //   .find()
//     //   //   .sort({ amount: -1 })
//     //   //   .skip(2)
//     //   //   .limit(2)
//     //   //   .project(projectField);

//     //   console.log(req.query);
//     //   const email = req.query.email;
//     //   const query = {};
//     //   if (email) {
//     //     query.email = email;
//     //   }

//     //   const cursor = balanceCollection.find(query).limit(3);
//     //   const result = await cursor.toArray();
//     //   res.send(result);
//     // });

//     // app.get('/latest-balance', async (req, res) => {
//     //   const cursor = balanceCollection.find().sort({ amount: 1 });
//     //   const result = await cursor.toArray();
//     //   res.send(result);

//     //   // =========================================
//     //   // const email = req.query.email;
//     //   // const query = {};
//     //   // if (email) {
//     //   //   query.email = email;
//     //   // }
//     //   // const cursor = balanceCollection.find(query);
//     //   // const result = await cursor.toArray();
//     //   // res.send(result);
//     // });

//     // app.get('/balance/:id', async (req, res) => {
//     //   const id = req.params.id;
//     //   const query = { _id: new ObjectId(id) };
//     //   const result = await balanceCollection.findOne(query);
//     //   res.send(result);
//     // });

//     // app.post('/balance', async (req, res) => {
//     //   const newBalance = req.body;
//     //   const result = await balanceCollection.insertOne(newBalance);
//     //   res.send(result);
//     // });

//     // app.patch('/balance/:id', async (req, res) => {
//     //   const id = req.params.id;
//     //   const updatedBalance = req.body;
//     //   const query = { _id: new ObjectId(id) };
//     //   const update = {
//     //     // $set: updatedBalance,
//     //     $set: {
//     //       name: updatedBalance.name,
//     //       amount: updatedBalance.amount,
//     //     },
//     //   };
//     //   const result = await balanceCollection.updateOne(query, update);
//     //   res.send(result);
//     // });

//     // app.delete('/balance/:id', async (req, res) => {
//     //   const id = req.params.id;
//     //   const query = { _id: new ObjectId(id) };
//     //   const result = await balanceCollection.deleteOne(query);
//     //   res.send(result);
//     // });

//     // =====================
//     // USERS APIs
//     // app.post('/users', async (req, res) => {
//     //   const newUser = req.body;
//     //   const email = req.body.email;
//     //   const query = { email: email };
//     //   const existingUser = await usersCollection.findOne(query);
//     //   if (existingUser) {
//     //     res.send({
//     //       message: 'user already exit. do not need to insert him again',
//     //     });
//     //   } else {
//     //     const result = await usersCollection.insertOne(newUser);
//     //     res.send(result);
//     //   }
//     // });

//     // ===================================================================================
//     // transaction related apis
//     // app.get('/transactions', verifyJWTToken, async (req, res) => {
//     //   // console.log('headers', req.headers);
//     //   const email = req.query.email;
//     //   const query = {};
//     //   if (email) {
//     //     if (email !== req.token_email) {
//     //       return res.status(403).send({ message: 'forbidden access' });
//     //     }
//     //     query.email = email;
//     //   }
//     //   const cursor = transactionsCollection.find(query).sort({ createdAt: -1 });
//     //   const result = await cursor.toArray();
//     //   res.send(result);
//     // });

//     // ===================================================================================
//     // // transaction related apis
//     // app.get('/transactions', verifyFireBaseToken, async (req, res) => {
//     //   // console.log('headers', req);
//     //   const email = req.query.email;
//     //   const query = {};
//     //   if (email) {
//     //     if (email !== req.token_email) {
//     //       return res.status(403).send({ message: 'forbidden access' });
//     //     }
//     //     query.email = email;
//     //   }
//     //   const cursor = transactionsCollection.find(query).sort({ createdAt: -1 });
//     //   const result = await cursor.toArray();
//     //   res.send(result);
//     // });

//     // =======================================
//     app.get('/transactions', verifyFireBaseToken, async (req, res, next) => {
//       try {
//         const email = req.query.email;

//         if (email && email !== req.token_email) {
//           return res.status(403).send({
//             message:
//               'Forbidden Access. email does not match the signed-in user.',
//           });
//         }
//         if (!email) {
//           return res.status(403).send({
//             message:
//               'Forbidden Access: email does not existing with the signed-in user.',
//           });
//         }

//         const result = await transactionsCollection
//           .find({
//             email: req.token_email,
//           })
//           .sort({
//             createdAt: -1,
//           })
//           .toArray();

//         res.status(200).send(result);
//       } catch (error) {
//         next(error);
//       }
//     });

//     // ===================================================================================
//     // app.post('/transactions', async (req, res) => {
//     //   const newTransaction = req.body;
//     //   const result = await transactionsCollection.insertOne(newTransaction);
//     //   res.send(result);
//     // });

//     // =================================
//     // app.post('/transactions', verifyFireBaseToken, async (req, res) => {
//     //   const transaction = req.body;

//     //   // // Convert string into real MongoDB Date
//     //   // transaction.date = new Date(transaction.date);

//     //   // transaction.createdAt = new Date();

//     //   // console.log('headers in the post', req.headers);

//     //   const email = transaction.email;

//     //   if (email && email !== req.token_email) {
//     //     return res.status(403).send({
//     //       message: 'Forbidden: email does not match the signed-in user.',
//     //     });
//     //   }

//     //   const safeTransaction = {
//     //     ...transaction,
//     //     email: req.token_email,
//     //     date: new Date(transaction.date),
//     //     createdAt: new Date(),
//     //   };

//     //   const result = await transactionsCollection.insertOne(safeTransaction);
//     //   // res.send(result);
//     //   res.status(201).send(result);
//     // });

//     // =====================================
//     app.post('/transactions', verifyFireBaseToken, async (req, res, next) => {
//       try {
//         const {
//           title,
//           amount,
//           category,
//           type,
//           date,
//           description,
//           name,
//           email,
//         } = req.body;

//         if (email && email !== req.token_email) {
//           return res.status(403).send({
//             message:
//               'Forbidden Access. email does not match the signed-in user.',
//           });
//         }
//         if (!email) {
//           return res.status(403).send({
//             message:
//               'Forbidden Access: email does not existing with the signed-in user.',
//           });
//         }

//         const numericAmount = Number(amount);
//         const transactionDate = new Date(date);

//         if (
//           !title?.trim() ||
//           !Number.isFinite(numericAmount) ||
//           numericAmount <= 0 ||
//           Number.isNaN(transactionDate.getTime())
//         ) {
//           return res.status(400).send({
//             message: 'Please provide a valid title, positive amount, and date.',
//           });
//         }

//         const safeTransaction = {
//           title: title.trim(),
//           amount: numericAmount,
//           category,
//           type,
//           date: transactionDate,
//           description: description?.trim() || '',
//           name,
//           email: req.token_email,
//           createdAt: new Date(),
//         };

//         const result = await transactionsCollection.insertOne(safeTransaction);

//         res.status(201).send(result);
//       } catch (error) {
//         next(error);
//       }
//     });

//     // ===================================================================================
//     // app.patch('/transactions/:id', verifyFireBaseToken, async (req, res) => {
//     //   const id = req.params.id;

//     //   const updated = req.body;

//     //   const query = {
//     //     _id: new ObjectId(id),
//     //   };

//     //   const update = {
//     //     $set: updated,
//     //   };

//     //   const result = await transactionsCollection.updateOne(
//     //     query,

//     //     update,
//     //   );

//     //   res.send(result);
//     // });

//     // ===================
//     // app.patch('/transactions/:id', verifyFireBaseToken, async (req, res) => {
//     //   const id = req.params.id;

//     //   const email = req.body.email;

//     //   if (email && email !== req.token_email) {
//     //     return res.status(403).send({
//     //       message: 'Forbidden Access. email does not match the signed-in user.',
//     //     });
//     //   }
//     //   if (!email) {
//     //     return res.status(403).send({
//     //       message:
//     //         'Forbidden Access: email does not existing with the signed-in user.',
//     //     });
//     //   }

//     //   if (!ObjectId.isValid(id)) {
//     //     return res.status(400).send({
//     //       message: 'Invalid transaction ID.',
//     //     });
//     //   }

//     //   const updateData = {
//     //     title: req.body.title,
//     //     amount: Number(req.body.amount),
//     //     category: req.body.category,
//     //     type: req.body.type,
//     //     date: new Date(req.body.date),
//     //     description: req.body.description,
//     //     updatedAt: new Date(),
//     //   };

//     //   const result = await transactionsCollection.updateOne(
//     //     {
//     //       _id: new ObjectId(id),
//     //       email: req.token_email,
//     //     },
//     //     {
//     //       $set: updateData,
//     //     },
//     //   );

//     //   if (result.matchedCount === 0) {
//     //     return res.status(404).send({
//     //       message: 'Transaction not found or you do not have permission.',
//     //     });
//     //   }

//     //   res.status(200).send(result);
//     // });

//     // ===================
//     const TRANSACTION_TYPES = new Set(['Income', 'Expense']);

//     const TRANSACTION_CATEGORIES = new Set([
//       'salary',
//       'freelance',
//       'business',
//       'transport',
//       'investment',
//       'bill',
//       'rent',
//       'food',
//       'buy',
//       'others',
//     ]);

//     const buildTransactionUpdate = body => {
//       const title = body.title?.trim();
//       const amount = Number(body.amount);
//       const category = body.category;
//       const type = body.type;
//       const date = new Date(body.date);
//       const description = body.description?.trim() || '';

//       if (!title) {
//         return { error: 'Title is required.' };
//       }

//       if (!Number.isFinite(amount) || amount <= 0) {
//         return { error: 'Amount must be a positive number.' };
//       }

//       if (!TRANSACTION_CATEGORIES.has(category)) {
//         return { error: 'Invalid transaction category.' };
//       }

//       if (!TRANSACTION_TYPES.has(type)) {
//         return { error: 'Invalid transaction type.' };
//       }

//       if (Number.isNaN(date.getTime())) {
//         return { error: 'Invalid transaction date.' };
//       }

//       return {
//         value: {
//           title,
//           amount,
//           category,
//           type,
//           date,
//           description,
//           updatedAt: new Date(),
//         },
//       };
//     };

//     app.patch('/transactions/:id', verifyFireBaseToken, async (req, res) => {
//       try {
//         const { id } = req.params;

//         const email = req.body.email;

//         if (email && email !== req.token_email) {
//           return res.status(403).send({
//             message:
//               'Forbidden Access. email does not match the signed-in user.',
//           });
//         }
//         if (!email) {
//           return res.status(403).send({
//             message:
//               'Forbidden Access: email does not existing with the signed-in user.',
//           });
//         }

//         if (!ObjectId.isValid(id)) {
//           return res.status(400).send({
//             message: 'Invalid transaction ID.',
//           });
//         }

//         const { value: updateData, error } = buildTransactionUpdate(req.body);

//         if (error) {
//           return res.status(400).send({
//             message: error,
//           });
//         }

//         const result = await transactionsCollection.updateOne(
//           {
//             _id: new ObjectId(id),
//             email: req.token_email,
//           },
//           {
//             $set: updateData,
//           },
//         );

//         if (result.matchedCount === 0) {
//           return res.status(404).send({
//             message: 'Transaction not found.',
//           });
//         }

//         res.status(200).send({
//           message: 'Transaction updated successfully.',
//           matchedCount: result.matchedCount,
//           modifiedCount: result.modifiedCount,
//         });
//       } catch (error) {
//         console.error('PATCH /transactions/:id failed:', error);

//         res.status(500).send({
//           message: 'Could not update the transaction.',
//         });
//       }
//     });

//     // ===================================================================================
//     // app.delete('/transactions/:id', async (req, res) => {
//     //   const id = req.params.id;

//     //   const result = await transactionsCollection.deleteOne({
//     //     _id: new ObjectId(id),
//     //   });

//     //   res.send(result);
//     // });

//     // ========================
//     // app.delete('/transactions/:id', verifyFireBaseToken, async (req, res) => {
//     //   const id = req.params.id;

//     //   if (!ObjectId.isValid(id)) {
//     //     return res.status(400).send({
//     //       message: 'Invalid transaction ID.',
//     //     });
//     //   }

//     //   const result = await transactionsCollection.deleteOne({
//     //     _id: new ObjectId(id),
//     //     email: req.token_email,
//     //   });

//     //   if (result.deletedCount === 0) {
//     //     return res.status(404).send({
//     //       message: 'Transaction not found or you do not have permission.',
//     //     });
//     //   }

//     //   res.status(200).send(result);
//     // });

//     // ========================
//     app.delete('/transactions/:id', verifyFireBaseToken, async (req, res) => {
//       try {
//         const { id } = req.params;

//         if (!ObjectId.isValid(id)) {
//           return res.status(400).send({
//             message: 'Invalid transaction ID.',
//           });
//         }

//         const result = await transactionsCollection.deleteOne({
//           _id: new ObjectId(id),
//           email: req.token_email,
//         });

//         if (result.deletedCount === 0) {
//           return res.status(404).send({
//             message: 'Transaction not found.',
//           });
//         }

//         res.status(200).send({
//           message: 'Transaction deleted successfully.',
//           deletedCount: result.deletedCount,
//         });
//       } catch (error) {
//         console.error('DELETE /transactions/:id failed:', error);

//         res.status(500).send({
//           message: 'Could not delete the transaction.',
//         });
//       }
//     });

//     // ===================================================================================
//     // Global error handler — KEEP THIS NEAR THE END
//     app.use((err, req, res, next) => {
//       console.error(err);

//       if (err.type === 'entity.too.large') {
//         return res.status(413).send({
//           message: 'Request body is too large.',
//         });
//       }

//       if (err instanceof SyntaxError && err.status === 400) {
//         return res.status(400).send({
//           message: 'Invalid JSON.',
//         });
//       }

//       res.status(500).send({
//         message: 'Internal server error.',
//       });
//     });

//     // ===================================================================================
//     await client.db('admin').command({ ping: 1 });
//     console.log(
//       'Pinged your deployment. You successfully connected to MongoDB!',
//     );
//   } finally {
//   }
// }

// run().catch(console.dir);

// app.listen(port, () => {
//   console.log(`personal finance management server is running on port: ${port}`);
// });

// // =====================================================================================================
// // client
// //   .connect()
// //   .then(() => {
// //     app.listen(port, () => {
// //       console.log(
// //         `personal finance management server is running now on port: ${port}`,
// //       );
// //     });
// //   })
// //   .catch(console.dir);

// // =====================================================================================================
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const app = express();
const port = process.env.PORT || 3000;

let client;

// Keep this file private and out of Git.
const serviceAccount = require('./finease-finance-management-firebase-admin-key.json');

initializeApp({
  credential: cert(serviceAccount),
});

// --------------------------------------------------
// CORS and body parsing
// --------------------------------------------------
const allowedOrigins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allows Postman and server-to-server requests.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Origin is not allowed by CORS.'));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// app.use(cors());

app.use(express.json({ limit: '10kb' }));

// --------------------------------------------------
// Helpers
// --------------------------------------------------
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const asyncHandler = handler => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

const TRANSACTION_TYPES = new Set(['Income', 'Expense']);

const TRANSACTION_CATEGORIES = new Set([
  'salary',
  'freelance',
  'business',
  'transport',
  'investment',
  'bill',
  'rent',
  'food',
  'buy',
  'others',
]);

const parseTransactionDate = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  // Rejects invalid dates such as 2026-02-30.
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
};

const buildTransactionData = body => {
  const title = body.title?.trim();
  const amount = Number(body.amount);
  const category = body.category;
  const type = body.type;
  const date = parseTransactionDate(body.date);
  const description =
    typeof body.description === 'string' ? body.description.trim() : '';

  if (!title) {
    return { error: 'Title is required.' };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: 'Amount must be a positive number.' };
  }

  if (!TRANSACTION_CATEGORIES.has(category)) {
    return { error: 'Invalid transaction category.' };
  }

  if (!TRANSACTION_TYPES.has(type)) {
    return { error: 'Invalid transaction type.' };
  }

  if (!date) {
    return { error: 'Invalid transaction date.' };
  }

  return {
    value: {
      title,
      amount,
      category,
      type,
      date,
      description,
    },
  };
};

// --------------------------------------------------
// Firebase token verification
// --------------------------------------------------
const verifyFireBaseToken = async (req, res, next) => {
  const authorization = req.headers.authorization;

  const match = authorization?.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    return res.status(401).send({
      message: 'Unauthorized access.',
    });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(match[1]);

    if (!decodedToken.email) {
      return res.status(401).send({
        message: 'Unauthorized access.',
      });
    }

    req.token_email = decodedToken.email;
    req.token_name = decodedToken.name || '';

    next();
  } catch (error) {
    console.error('Firebase token verification failed:', error.code);

    return res.status(401).send({
      message: 'Unauthorized access.',
    });
  }
};

// --------------------------------------------------
// MongoDB connection
// --------------------------------------------------
async function connectMongoOnce() {
  const uris = [
    process.env.MONGODB_URI_SRV,
    process.env.MONGODB_URI_STANDARD,
  ].filter(Boolean);

  if (uris.length === 0) {
    throw new Error('MongoDB URI is missing from .env.');
  }

  let lastError;

  for (const uri of uris) {
    let temporaryClient;

    try {
      temporaryClient = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
        serverSelectionTimeoutMS: 10000,
      });

      await temporaryClient.connect();
      await temporaryClient.db('admin').command({ ping: 1 });

      console.log(
        `MongoDB connected using ${
          uri.startsWith('mongodb+srv') ? 'SRV' : 'Standard'
        } URI.`,
      );

      return temporaryClient;
    } catch (error) {
      lastError = error;

      console.error('MongoDB connection attempt failed:', error.message);

      await temporaryClient?.close().catch(() => {});
    }
  }

  throw lastError || new Error('Could not connect to MongoDB.');
}

// --------------------------------------------------
// Routes
// --------------------------------------------------
function registerRoutes(transactionsCollection) {
  app.get('/', (req, res) => {
    res.status(200).send({
      message: 'Personal finance management server is running.',
    });
  });

  // Gets only the Firebase-authenticated user's transactions.
  app.get(
    '/transactions',
    verifyFireBaseToken,
    asyncHandler(async (req, res) => {
      // ================= Don't try to use this type of second-layer verification by client input. It could create a vulnerability, allowing sophisticated hackers to determine whether your email exists in Firebase or in the database. Then they could try multiple times with this email to access the website or its database.

      // const email = req.query.email;

      // if (email && email !== req.token_email) {
      //   return res.status(403).send({
      //     message: 'Forbidden Access. email does not match the signed-in user.',
      //   });
      // }
      // if (!email) {
      //   return res.status(403).send({
      //     message:
      //       'Forbidden Access: email does not existing with the signed-in user.',
      //   });
      // }

      // ===============
      const result = await transactionsCollection
        .find({
          email: req.token_email,
        })
        .sort({
          createdAt: -1,
        })
        .toArray();

      res.status(200).send(result);
    }),
  );

  app.post(
    '/transactions',
    verifyFireBaseToken,
    asyncHandler(async (req, res) => {
      // ================= Verification by client input. It could create a vulnerability, allowing sophisticated hackers to determine whether your email exists in Firebase or in the database. Then they could try multiple times with this email to access the website or its database.
      // solution just don't check email with client input like this. But you can take client email input for other reason.

      // const email = req.body.email;

      // if (email && email !== req.token_email) {
      //   return res.status(403).send({
      //     message: 'Forbidden Access. email does not match the signed-in user.',
      //   });
      // }
      // if (!email) {
      //   return res.status(403).send({
      //     message:
      //       'Forbidden Access: email does not existing with the signed-in user.',
      //   });
      // }

      // ===============
      const { value: transactionData, error } = buildTransactionData(req.body);

      if (error) {
        return res.status(400).send({
          message: error,
        });
      }

      const safeTransaction = {
        ...transactionData,
        email: req.token_email,
        name: req.body.name,
        // name: req.token_name,
        createdAt: new Date(),
      };

      const result = await transactionsCollection.insertOne(safeTransaction);

      res.status(201).send(result);
    }),
  );

  app.patch(
    '/transactions/:id',
    verifyFireBaseToken,
    asyncHandler(async (req, res) => {
      const { id } = req.params;

      // ================= Verification by client input. It could create a vulnerability, allowing sophisticated hackers to determine whether your email exists in Firebase or in the database. Then they could try multiple times with this email to access the website or its database.
      // solution just don't check email with client input like this. But you can take client email input for other reason.

      // const email = req.body.email;

      // if (email && email !== req.token_email) {
      //   return res.status(403).send({
      //     message: 'Forbidden Access. email does not match the signed-in user.',
      //   });
      // }
      // if (!email) {
      //   return res.status(403).send({
      //     message:
      //       'Forbidden Access: email does not existing with the signed-in user.',
      //   });
      // }

      // ===============
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({
          message: 'Invalid transaction ID.',
        });
      }

      // One more sample of a security layer apply by different way. But I don't need it. Because I already added it in another shortcut way.
      // Layer 2 Check: Find the transaction in the database first
      // const query = { _id: new ObjectId(id) };
      // const existingTransaction =
      //   await req.transactionsCollection.findOne(query);

      // if (!existingTransaction) {
      //   return res.status(404).send({ message: 'Transaction not found' });
      // }

      // // Compare database record owner against the verified token email
      // if (existingTransaction.email !== req.token_email) {
      //   return res
      //     .status(403)
      //     .send({ message: 'Forbidden: You do not own this transaction' });
      // }

      const { value: transactionData, error } = buildTransactionData(req.body);

      if (error) {
        return res.status(400).send({
          message: error,
        });
      }

      const result = await transactionsCollection.updateOne(
        {
          _id: new ObjectId(id),
          email: req.token_email,
        },
        {
          $set: {
            ...transactionData,
            updatedAt: new Date(),
          },
        },
      );

      if (result.matchedCount === 0) {
        return res.status(404).send({
          message: 'Transaction not found.',
        });
      }

      res.status(200).send({
        message: 'Transaction updated successfully.',
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      });
    }),
  );

  app.delete(
    '/transactions/:id',
    verifyFireBaseToken,
    asyncHandler(async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({
          message: 'Invalid transaction ID.',
        });
      }

      const result = await transactionsCollection.deleteOne({
        _id: new ObjectId(id),
        email: req.token_email,
      });

      if (result.deletedCount === 0) {
        return res.status(404).send({
          message: 'Transaction not found.',
        });
      }

      res.status(200).send({
        message: 'Transaction deleted successfully.',
        deletedCount: result.deletedCount,
      });
    }),
  );

  // Must be registered after every route.
  app.use((error, req, res, next) => {
    console.error('Server error:', error);

    if (res.headersSent) {
      return next(error);
    }

    if (error.message === 'Origin is not allowed by CORS.') {
      return res.status(403).send({
        message: 'This website is not allowed to call the API.',
      });
    }

    if (error.type === 'entity.too.large') {
      return res.status(413).send({
        message: 'Request body is too large.',
      });
    }

    if (error instanceof SyntaxError && error.status === 400) {
      return res.status(400).send({
        message: 'Invalid JSON request body.',
      });
    }

    res.status(500).send({
      message: 'Internal server error.',
    });
  });
}

// --------------------------------------------------
// Server startup
// --------------------------------------------------
async function startServer() {
  let retryDelay = 5000;

  while (!client) {
    try {
      client = await connectMongoOnce();
    } catch (error) {
      console.error(
        `MongoDB unavailable. Retrying in ${retryDelay / 1000} seconds.`,
      );

      await wait(retryDelay);

      retryDelay = Math.min(retryDelay * 2, 60000);
    }
  }

  const db = client.db('personal_fm');
  const transactionsCollection = db.collection('transactions');

  await transactionsCollection.createIndex({
    email: 1,
    createdAt: -1,
  });

  registerRoutes(transactionsCollection);

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

startServer().catch(error => {
  console.error('Server startup failed:', error);
  process.exit(1);
});

// --------------------------------------------------
// Graceful shutdown
// --------------------------------------------------
const shutdown = async () => {
  console.log('Closing server...');

  await client?.close().catch(() => {});

  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
