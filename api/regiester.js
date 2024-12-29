const bcrypt = require('bcryptjs');
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(200).send('User Registered');
  } else {
    res.status(404).send('Not Found');
  }
};