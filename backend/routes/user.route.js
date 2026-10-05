const express = require("express");

const {
  register,
  login,
  logout,
  getMe,
  googleLogin,
} = require("../controllers/user.controller");

const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/logout", logout);

router.get("/me", protect, getMe);

router.post("/google", googleLogin); // POST /users/google

module.exports = router;