const express = require("express");
const {
  handleAddNewUser,
  handleAuthenticateUser,
  handleLogout,
  verifyToken,
} = require("../controllers/handlers");

const router = express.Router();

router.post("/signup/user", handleAddNewUser);
router.post("/signin/user", verifyToken, handleAuthenticateUser);
router.get("/logout", handleLogout);

module.exports = router;
