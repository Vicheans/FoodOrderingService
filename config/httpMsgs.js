const httpMsgs = require("http-msgs");

const msgs = (req, res, message, data) => httpMsgs.sendJSON(req, res, {
     message,
     icon: "<i class='fa fa-check'></i>",
     alert: "alert-success", data
 });


 module.exports = msgs;