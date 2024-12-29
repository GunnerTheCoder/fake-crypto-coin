const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const socketIo = require('socket.io');

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/cryptoFake', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User Model
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
  balance: { type: Number, default: 5 }
}));

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access Denied');
  jwt.verify(token, 'secretKey', (err, decoded) => {
    if (err) return res.status(401).send('Invalid Token');
    req.user = decoded;
    next();
  });
};

// Register Endpoint
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.send('User Registered');
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).send('User Not Found');
  
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid Password');
  
  const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });
  res.json({ token });
});

// Coin Price Update Logic (Simulating Price Fluctuations)
const generateNewCoinPrice = () => {
  return (Math.random() * 2 - 1).toFixed(20); // Random fluctuation between -1 and 1 at 20 decimal places
};

const io = socketIo(server);

io.on('connection', (socket) => {
  setInterval(() => {
    const newPrice = generateNewCoinPrice();
    socket.emit('coinPrice', newPrice); // Emit updated price to clients
  }, 10000); // Update every 10 seconds
});

const server = app.listen(3000, () => {
  console.log('Server running on port 3000');
});