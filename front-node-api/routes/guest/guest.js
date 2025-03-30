const express = require("express");
const router = express.Router();
const GuestController = require("../../controllers/guest/guest");

router.post("/register", GuestController.register);

router.post("/login", GuestController.login);

router.post("/send_mail", GuestController.send_mail);

router.post("/verify_email", GuestController.verify_2FA);

module.exports = router;