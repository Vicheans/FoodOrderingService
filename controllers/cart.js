const express = require("express");
const router = express.Router();
const order = require('../config/order')
const msg = require('../config/httpMsgs')




router.get('/', (req, res) => {
   msg(req, res, null, order)
})

module.exports = router;
