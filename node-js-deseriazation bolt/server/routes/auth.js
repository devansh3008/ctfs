import express from 'express';
import serialize from 'node-serialize';

const router = express.Router();

const users = {
  admin: { password: 'super_secret_password', role: 'admin' },
  user: { password: 'user123', role: 'user' }
};

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (users[username] && users[username].password === password) {
    const user = { username, role: users[username].role };
    const serialized = serialize.serialize(user);
    res.cookie('session', serialized, { httpOnly: true });
    res.json(user);
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

export default router;