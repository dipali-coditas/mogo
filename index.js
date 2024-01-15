const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 4000;

// MongoDB configuration
const mongoURI = 'mongodb://root:root@localhost:27017';
const dbName = 'Demo';
const collectionName = 'user';

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// // Define routes for serving HTML files
// app.get('/add_user', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'add_user.html'));
// });

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// MongoDB routes
app.post('/register', async (req, res) => {
  try {
    const { userid, pass, ph_no } = req.body;

    // Validate input
    if (!userid || !pass || !ph_no) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.insertOne({
      userid,
      pass,
      ph_no,
    });

    client.close();

    res.json({ message: 'User registered successfully', userId: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/get_all_data', async (req, res) => {
  try {
    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const users = await collection.find().toArray();

    client.close();

    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
