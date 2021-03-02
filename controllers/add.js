const express = require("express");
const router = express.Router();
const menu = require('../config/menu')
const order = require('../config/order')
const msgs = require('../config/httpMsgs')




router.post('/', (req, res, next) => {
    const {
        id
    } = req.body;

    
    const findOrder = order.find(x => x.id == id);
    const quantity = (findOrder ?
        findOrder.quantity += 1 :
        order.push({
            orderId: order.length + 1,
            ...menu.find(x => x.id == id),
            quantity: 1
        }));

    msgs(req, res, "Added to Cart")
})


module.exports = router;