const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const usersData = require("../components/users.json");

const app = express();

const SECRET_TOKEN = "123";
const TOKEN_EXPIRY = "1h";
const PORT = 5000;

app.use(cors());
app.use(express.json());

const authenticateUser = (email, password) => {
  return usersData.users.find(
    (user) => user.email === email && user.password === password
  );
};

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const user = authenticateUser(email, password);

  if (user) {
    const token = jwt.sign(
      { email: user.email },
      SECRET_TOKEN,
      { expiresIn: TOKEN_EXPIRY }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        email: user.email
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid email or password"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});