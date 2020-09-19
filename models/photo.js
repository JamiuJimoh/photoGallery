const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
   title: String,
   image: String,
   description: String,
   created: { type: Date, default: Date.now},
   tag: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   
});


module.exports = mongoose.model("Photo", photoSchema);

