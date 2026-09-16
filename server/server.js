const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
const usersPath = path.join(__dirname, 'users.json');

app.use(cors());
app.use(express.json());

const readUsers = () => JSON.parse(fs.readFileSync(usersPath, 'utf8')).users;

const writeUsers = (users) => {
  fs.writeFileSync(usersPath, `${JSON.stringify({ users }, null, 2)}\n`);
};

app.get('/api/users', (req, res) => {
  const users = readUsers();
  const filteredUsers = req.query.email
    ? users.filter((user) => user.email === req.query.email)
    : users;
  res.json(filteredUsers);
});

app.post('/api/users', (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, foodInterest } = req.body;
  const users = readUsers();

  if (users.some((user) => user.email === email)) {
    return res.status(409).json({ message: 'Email already exists.' });
  }

  const user = {
    id: crypto.randomUUID(),
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    foodInterest,
  };
  users.push(user);
  writeUsers(users);
  return res.status(201).json(user);
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = readUsers().find((candidate) => candidate.email === email && candidate.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  return res.json({
    token: crypto.randomBytes(32).toString('hex'),
    user: { ...user, password: undefined, confirmPassword: undefined },
  });
});

app.listen(port, () => {
  console.log(`Auth server listening on http://localhost:${port}`);
});