require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const httpMsgs = require("http-msgs");
const csrf = require("csurf");
const fs = require("fs");
const menu = require('./config/menu')
const order = require('./config/order')


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




app.get("/", (req,res)=>{
    res.render("index", {
        menu,
        csrf: req.csrfToken()
    })
})


app.get('/cart', (req, res)=>{
     httpMsgs.sendJSON(req, res, {
       order
     });
})


app.post('/order', (req, res, next)=>{
    const {id} = req.body;

    const findOrder = order.find(x => x.id == id);
    
    const quantity = (findOrder ? 
        findOrder.quantity += 1 
        : 
        order.push({
          orderId: order.length + 1,
          ...menu.find(x => x.id == id),
          quantity: 1 
      }));

      httpMsgs.sendJSON(req, res, {
        message: "Added to Cart",
        icon: "<i class='fa fa-check'></i>",
        alert: "alert-success"
    });
})

app.post('/updateOrder', (req, res, next) => {
    const {
        id
    } = req.body;
    // order.push({
    //     orderId: order.length + 1,
    //     ...menu.find(x => x.id == id)
    // })

    // httpMsgs.sendJSON(req, res, {
    //     message: "Added to Cart",
    //     icon: "<i class='fa fa-check'></i>",
    //     alert: "alert-success"
    // });
})

app.post('/cancelOrder', (req, res, next)=>{
     const {id} = req.body;
    order.filter(x => x.itemId !== id)

     httpMsgs.sendJSON(req, res, {
         message: "Removed from Cart",
         icon: "<i class='fa fa-check'></i>",
         alert: "alert-success"
     });
    //  next();
})


app.use(function (req, res, next) {
    res.status(404).render("/error", {
        error: '404',
        msg: 'Oops ! Sorry We Can\'t Find That Page'
    });
})


app.use(function (req, res, next) {
    res.status(500)
        .render("/error", {
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