const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Connect to MongoDB (make sure you add a valid MongoDB URI)
mongoose.connect('mongodb+srv://GunnerCastle:Mario316*!@cluster0.amz6c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
}));

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('User Not Found');
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid Password');
    
    const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(404).send('Not Found');
  }
};