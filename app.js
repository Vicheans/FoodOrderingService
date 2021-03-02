require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const csrf = require("csurf");
const fs = require("fs");

const httpMsgs = require("http-msgs");



const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true,
}), bodyParser.json());

app.use(
    session({
        secret: "Our little secret.",
        resave: false,
        saveUninitialized: false,
}));


var csrfProtection = csrf();
app.use(csrfProtection);


const menu = require('./config/menu')
const order = require('./config/order')
const status = require('./config/status')
const add = require('./controllers/add')
const cart = require('./controllers/cart')
const checkout = require('./controllers/status')



app.get("/", (req,res)=>{
    res.render("index", {
        menu,
        csrf: req.csrfToken()
    })
})

//add item to cart
app.use('/order', add);
//retrieve cart data
app.use('/cart', cart);

app.use('/status', checkout);






app.post('/updateOrder', (req, res, next) => {
    const {
        id, quantity
    } = req.body;

    const findOrder = order.find(x => x.id == id);
    findOrder.quantity = quantity

    httpMsgs.sendJSON(req, res, {
        message: "Quantity updated",
        icon: "<i class='fa fa-check'></i>",
        alert: "alert-success"
    });
})

app.post('/cancelOrder', (req, res, next)=>{
     const {id} = req.body;
    	for (var i = 0; i < order.length; i++) {            
    	    if (order[i].orderId == id) {
                order.splice(i, 1)
    	    }
    	}
     httpMsgs.sendJSON(req, res, {
         message: "Removed from Cart",
         icon: "<i class='fa fa-check'></i>",
         alert: "alert-success"
     });
})

//checkout route
app.post("/checkout", (req,res, next)=>{

    const {
        clientName,
        email,
        description,
        amount, address
    } = req.body;

    for(var i =0; i<order.length; i++){

       status.push({
           ...menu.filter(x => x.id == order[i].id),
           clientName,
           email,
           description,
           amount,address,
           deliveryTime: new Date().getTime(),
       })
       
    }

     httpMsgs.sendJSON(req, res, {
         message: "Checkout Successful, Check status to see time to delivery",
         icon: "<i class='fa fa-check'></i>",
         alert: "alert-success"
     });

})


app.use(function (req, res, next) {
    res.status(404).render("error", {
        error: '404',
        msg: 'Oops ! Sorry We Can\'t Find That Page'
    });
})


app.use(function (req, res, next) {
    res.status(500)
        .render("error", {
            error: '500',
            msg: "Oops! Something broke, kindly refresh page and try again."
        });
})


let port = process.env.PORT;
if (port == null || port == "") {
    port = 4500;
}

app.listen(port, function () {
    console.log("Server started on port successfully.");
});