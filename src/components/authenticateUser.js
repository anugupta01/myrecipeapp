const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const users = require('../components/users.json');
const secret_token = '123';
const time = '1h';
const app = express();
app.use(cors());
app.use(bodyParser.json());
 
const authenticateUser = (email, password) => {
  const validUser = users.users.filter(user => user.email === email && user.password === password);
  if(validUser.length>0){
  return true;
 }else{
  return false;
 }
};

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (authenticateUser(email, password)) {
    const token = jwt.sign({ email }, secret_token, { expiresIn: time });
    res.json({ token , success: true});
  } else {
    res.status(401).json({ alert: 'Invalid credentials', success: false });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));