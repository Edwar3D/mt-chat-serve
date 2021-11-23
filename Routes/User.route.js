const express = require('express')
const router = express.Router()
const AuthJWT = require("../middlewares/authJWT");
const UserController = require("../Controllers/User.Controller")


router.get("/user",[AuthJWT.verifyToken],  UserController.getUser);

module.exports = router