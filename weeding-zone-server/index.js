require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;
const primaryMongoUri = process.env.MONGO_URI;
const fallbackMongoUri = process.env.LOCAL_MONGO_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.DB_NAME || 'weedingZoneDB';

const mongoUri = primaryMongoUri || fallbackMongoUri;

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());

let client;
const createClient = (uri) => new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const parseProductQuery = (id) => {
  if (!isNaN(Number(id))) {
    return { id: Number(id) };
  }
  if (ObjectId.isValid(id)) {
    return { _id: new ObjectId(id) };
  }
  return { id };
};

async function start() {
  try {
    client = createClient(mongoUri);
    try {
      await client.connect();
    } catch (primaryError) {
      console.error(`Failed to connect to MongoDB using primary URI (${mongoUri}):`, primaryError.message || primaryError);
      if (mongoUri !== fallbackMongoUri) {
        console.log(`Retrying with fallback local MongoDB URI: ${fallbackMongoUri}`);
        client = createClient(fallbackMongoUri);
        await client.connect();
      } else {
        throw primaryError;
      }
    }

    const db = client.db(dbName);
    const products = db.collection('products');
    const orders = db.collection('orders');

    console.log(`Connected to MongoDB database: ${dbName} using ${mongoUri === fallbackMongoUri ? 'local fallback' : 'configured'} URI`);

    // Seed products only if collection is empty
    const productData = [
      {
        "id": 7,
        "name": "Red Bridal Lehenga",
        "photoURL": "https://i.ibb.co.com/HfJgtD0Z/red-weeding-lahenga.png",
        "category": "Bride",
        "type": "Lehenga",
        "occasion": "Wedding",
        "rent_for_days": 3,
        "rent": 12000,
        "size": ["S", "M", "L"],
        "stock": 5
      },
      {
        "id": 5,
        "name": "Haldi Kurta",
        "photoURL": "https://i.ibb.co.com/rK8Jkr9h/haldi-kurta.jpg",
        "category": "Groom",
        "type": "Panjabi",
        "occasion": "Haldi",
        "rent_for_days": 3,
        "rent": 4000,
        "size": ["S", "M", "L"],
        "stock": 6
      },
      {
        "id": 2,
        "name": " Wedding Sherwani",
        "photoURL": "https://i.ibb.co.com/GvCKwnBH/Cream-Wedding-Sherwani.jpg",
        "category": "Groom",
        "type": "Sherwani",
        "occasion": "Wedding",
        "rent_for_days": 3,
        "rent": 9000,
        "size": ["M", "L", "XL"],
        "stock": 4
      },
      {
        "id": 3,
        "name": "Royal Sherwani",
        "photoURL": "https://i.ibb.co.com/9kSDxjFV/royal-sherwani.png",
        "category": "Groom",
        "type": "Sherwani",
        "occasion": "Reception",
        "rent_for_days": 3,
        "rent": 9500,
        "size": ["L", "XL"],
        "stock": 3
      },
      {
        "id": 6,
        "name": "Wedding Pagri Set",
        "photoURL": "https://i.ibb.co.com/99V3twV7/weeding-pagri.png",
        "category": "Groom",
        "type": "Pagri",
        "occasion": "Wedding",
        "rent_for_days": 3,
        "rent": 3000,
        "size": ["Free"],
        "stock": 10
      },
      {
        "id": 8,
        "name": "Golden Zari Lehenga",
        "photoURL": "https://i.ibb.co.com/fVyZLGY3/Golden-Zari-Lehenga.png",
        "category": "Bride",
        "type": "Lehenga",
        "occasion": "Reception",
        "rent_for_days": 3,
        "rent": 13000,
        "size": ["M", "L"],
        "stock": 3
      },
      {
        "id": 9,
        "name": "Haldi Floral Lehenga",
        "photoURL": "https://i.ibb.co.com/LhJWrBH8/Haldi-Flora-l-Lehenga.png",
        "category": "Bride",
        "type": "Lehenga",
        "occasion": "Haldi",
        "rent_for_days": 3,
        "rent": 8000,
        "size": ["S", "M"],
        "stock": 4
      },
      {
        "id": 10,
        "name": "Banarasi Bridal Saree",
        "photoURL": "https://i.ibb.co.com/wN2DXd8H/Banarasi-Bridal-Saree.png",
        "category": "Bride",
        "type": "Saree",
        "occasion": "Wedding",
        "rent_for_days": 3,
        "rent": 10000,
        "size": ["Free"],
        "stock": 6
      },
      {
        "id": 11,
        "name": "Organza Party Saree",
        "photoURL": "https://i.ibb.co.com/fzLNpVks/Organza-Party-Saree.png",
        "category": "Bride",
        "type": "Saree",
        "occasion": "Reception",
        "rent_for_days": 3,
        "rent": 7000,
        "size": ["Free"],
        "stock": 5
      },
      {
        "id": 12,
        "name": "Reception Designer Gown",
        "photoURL": "https://i.ibb.co.com/MDcwXKqk/recieption-bridal-gown.png",
        "category": "Bride",
        "type": "Gown",
        "occasion": "Reception",
        "rent_for_days": 3,
        "rent": 14000,
        "size": ["S", "M", "L"],
        "stock": 3
      },
      {
        "id": 13,
        "name": "Mehendi Green 3 Piece",
        "photoURL": "https://i.ibb.co.com/QFjKq5K8/mehendi-Green-3-Piece.png",
        "category": "Bride",
        "type": "3 Piece",
        "occasion": "Mehendi",
        "rent_for_days": 3,
        "rent": 6000,
        "size": ["S", "M"],
        "stock": 6
      },
      {
        "id": 14,
        "name": "Bridal Golden Heels",
        "photoURL": "https://i.ibb.co.com/7J828b4S/Bridal-Golden-Heels.png",
        "category": "Bride",
        "type": "Shoes",
        "occasion": "Wedding",
        "rent_for_days": 3,
        "rent": 3000,
        "size": ["36", "37", "38"],
        "stock": 8
      },
      {
        "id": 4,
        "name": "Formal Suit",
        "photoURL": "https://i.ibb.co.com/hRjhKjkQ/formal-suits.jpg",
        "category": "Groom",
        "type": "Suit",
        "occasion": "Reception",
        "rent_for_days": 3,
        "rent": 8000,
        "size": ["M", "L"],
        "stock": 5
      },
      {
        "id": 15,
        "name": "Pastel Pink Lehenga",
        "photoURL": "https://i.ibb.co.com/0WXGjKk/pastel-pink-lahenga.png",
        "category": "Bride",
        "type": "Lehenga",
        "occasion": "Mehendi",
        "rent_for_days": 3,
        "rent": 9000,
        "size": ["S", "M", "L"],
        "stock": 4
      },
      {
        "id": 16,
        "name": "Navy Blue Tuxedo",
        "photoURL": "https://i.ibb.co.com/rG7Nv3fR/blue-taxedo.png",
        "category": "Groom",
        "type": "Suit",
        "occasion": "Reception",
        "rent_for_days": 3,
        "rent": 8500,
        "size": ["M", "L", "XL"],
        "stock": 3
      },
      {
        "id": 17,
        "name": "White Classic Panjabi",
        "photoURL": "https://i.ibb.co.com/Zzvx09x2/white-classic-panjabi.png",
        "category": "Groom",
        "type": "Panjabi",
        "occasion": "Wedding",
        "rent_for_days": 3,
        "rent": 4500,
        "size": ["M", "L", "XL"],
        "stock": 7
      },
      {
        "id": 18,
        "name": "Golden Embroidered Sherwani",
        "photoURL": "https://i.ibb.co.com/ynSYwYxv/golden-abrodiary-panjabi.png",
        "category": "Groom",
        "type": "Sherwani",
        "occasion": "Wedding",
        "rent_for_days": 3,
        "rent": 10000,
        "size": ["L", "XL"],
        "stock": 2
      },
      {
        "id": 19,
        "name": "Floral Mehendi Saree",
        "photoURL": "https://i.ibb.co.com/Kjrgv6sM/mehendi-froral-saree.png",
        "category": "Bride",
        "type": "Saree",
        "occasion": "Mehendi",
        "rent_for_days": 3,
        "rent": 6500,
        "size": ["Free"],
        "stock": 5
      },
      {
        "id": 20,
        "name": "Wedding Leather Shoes",
        "photoURL": "https://i.ibb.co.com/bg1fCNnH/Wedding-Leather-Shoes.png",
        "category": "Groom",
        "type": "Shoes",
        "occasion": "Wedding",
        "rent_for_days": 3,
        "rent": 5000,
        "size": ["40", "41", "42"],
        "stock": 6
      },
      {
        "id": 1,
        "name": "Traditional Mojari Shoes",
        "photoURL": "https://i.ibb.co.com/5gy9zqRL/mojari-shoes.png",
        "category": "Groom",
        "type": "Shoes",
        "occasion": "Wedding",
        "rent_for_days": 3,
        "rent": 6000,
        "size": ["40", "41", "42"],
        "stock": 9
      }
    ];
    const existingProducts = await products.countDocuments();
    if (existingProducts === 0) {
      await products.insertMany(productData);
      console.log('Seeded products into database');
    } else {
      console.log(`Products collection already contains ${existingProducts} items; seed skipped.`);
    }

    app.get('/', (req, res) => {
      res.send('Weeding Zone Server is running');
    });

    app.get('/api/products', async (req, res) => {
      const items = await products.find({}).toArray();
      res.send(items);
    });

    app.get('/api/products/:id', async (req, res) => {
      const query = parseProductQuery(req.params.id);
      const product = await products.findOne(query);
      if (!product) return res.status(404).send({ error: 'Product not found' });
      res.send(product);
    });

    app.post('/api/products', async (req, res) => {
      const product = {
        ...req.body,
        id: req.body.id || Date.now(),
        createdAt: new Date(),
      };
      const result = await products.insertOne(product);
      res.status(201).send({ ...product, _id: result.insertedId });
    });

    app.put('/api/products/:id', async (req, res) => {
      try {
        const query = parseProductQuery(req.params.id);
        const { _id, ...updateData } = req.body;
        const update = { $set: { ...updateData, updatedAt: new Date() } };
        // mongodb driver v7: findOneAndUpdate returns the document directly (not result.value)
        const result = await products.findOneAndUpdate(query, update, { returnDocument: 'after' });
        if (!result) return res.status(404).send({ error: 'Product not found' });
        res.send(result);
      } catch (err) {
        console.error('PUT /api/products error:', err);
        res.status(500).send({ error: 'Failed to update product' });
      }
    });

    app.delete('/api/products/:id', async (req, res) => {
      const query = parseProductQuery(req.params.id);
      const result = await products.deleteOne(query);
      if (!result.deletedCount) return res.status(404).send({ error: 'Product not found' });
      res.send({ success: true });
    });

    app.get('/api/orders', async (req, res) => {
      const filter = {};
      if (req.query.email) {
        filter.customerEmail = req.query.email;
      }
      const items = await orders.find(filter).sort({ timestamp: -1 }).toArray();
      res.send(items);
    });

    app.get('/api/orders/:orderId', async (req, res) => {
      const orderId = req.params.orderId;
      const order = await orders.findOne({ orderId });
      if (!order) return res.status(404).send({ error: 'Order not found' });
      res.send(order);
    });

    app.post('/api/orders', async (req, res) => {
      const order = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        timestamp: Date.now(),
      };
      const result = await orders.insertOne(order);
      res.status(201).send({ ...order, _id: result.insertedId });
    });

    app.put('/api/orders/:orderId', async (req, res) => {
      const orderId = decodeURIComponent(req.params.orderId);
      const update = { $set: { ...req.body, updatedAt: new Date() } };
      const result = await orders.updateOne({ orderId }, update);
      if (result.matchedCount === 0) return res.status(404).send({ error: 'Order not found' });
      const updatedOrder = await orders.findOne({ orderId });
      res.send(updatedOrder);
    });

    app.delete('/api/orders/:orderId', async (req, res) => {
      const orderId = decodeURIComponent(req.params.orderId);
      const result = await orders.deleteOne({ orderId });
      if (!result.deletedCount) return res.status(404).send({ error: 'Order not found' });
      res.send({ success: true });
    });

    app.use((err, req, res, next) => {
      console.error(err);
      res.status(500).send({ error: 'Internal server error' });
    });

    app.listen(port, () => {
      console.log(`Weeding Zone Server is running on port: ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start(); 