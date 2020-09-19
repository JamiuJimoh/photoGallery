var Photo = require("../models/photo");

module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
    },

    isAdmin: function (req, res, next) {
        if (req.user && req.user.isAdmin) {
          next();
        } else {
          res.redirect("/")
        }
      },
    
      handleError(err, req, res, next) {
        if (!err) {
            return next();
        }
        let errMsg;
        if (err.stack) {
            errMsg = err.stack;
        } else {
            errMsg = err;
        }
        console.error(`Unhandled error:\n${errMsg}`);
        res.status(500).send("Oops, something went wrong.");
      }
    }