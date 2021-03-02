const express = require("express");
const router = express.Router();
const status = require('../config/status')
const msg = require('../config/httpMsgs')




router.get('/', (req, res) => {
    msg(req, res, null, status)
})

module.exports = router;
