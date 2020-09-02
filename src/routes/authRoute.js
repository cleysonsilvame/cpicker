const express = require('express')
const router = express.Router()

const AuthController = require('../controllers/authController')

router.get('/', AuthController.getAuthController)



module.exports = router