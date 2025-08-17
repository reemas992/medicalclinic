const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

const register = async (req, res) => {
  try {
    const { name, email, password, role = 'patient' } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'name, email, password are required' });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ error: 'User already exists' });

    if (!['admin', 'doctor', 'patient'].includes(role))
      return res.status(400).json({ error: 'Invalid role' });

    const user = await User.create({ name, email, password, role });
    const token = signToken({ id: user.id, role: user.role });

    return res.status(201).json({ token, user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'email and password are required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = signToken({ id: user.id, role: user.role });
    return res.json({ token, user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(req.user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, me };
