const express = require("express")
const router = express.Router()
const Photo = require("../models/photo")
const middleware = require("../middleware")
const { isLoggedIn, isAdmin, } = middleware
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + file.originalname);
    },
  });
  
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/svg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fieldSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
  });


// INDEX ROUTE
router.get("/", (req, res, next) => {
    Photo.find({}).sort({ created: -1 }).exec(function (err, allPhotos) {
        if (err) {
            next(err)
        } else {
            res.render("photos/index", { photo: allPhotos });
        }
    });
});

// NEW ROUTE
router.get("/new", (req, res) => {
    res.render("photos/new");
});

// CREATE ROUTE
router.post("/", upload.single('uploaded_file'), (req, res) => {
    console.log(req.file);
        
    const title = req.body.title;
    const image = req.file.path;
    const description = req.body.description;
    const photo = {title, image, description};
    Photo.create(photo, (err, photo) => {
        if (err) {
            console.log(err);
        } else {
            console.log(photo);
            res.redirect('/photos/' + photo.id);
        }
    });
});
 

// SHOW ROUTE
router.get("/:id", (req, res, next) => {
    Photo.findById(req.params.id, (err, foundPhoto) => {
        if (err) {
            next(err)
        } else {
            res.render("photos/show", { photo: foundPhoto });
        }
    });
});

// EDIT ROUTE
router.get("/:id/edit", (req, res, next) => {
    Photo.findById(req.params.id, (err, foundPhoto) =>{
        if (err) {
            next(err)
        } else {
            res.render("photos/edit", { photo: foundPhoto });
        }
    });
});

// UPDATE ROUTE
router.put("/:id", (req, res) => {
    Photo.findByIdAndUpdate(req.params.id, req.body.photo, (err, updatedPhoto) => {
        if (err) {
            // TODO differentiate between "expected" errors (e.g. malformatted user inputs), vs unexpected errors (database is down).
            // Expected errors should redirect, with indication of what user did wrong, whereas unexpected error should respond with 500.
            res.redirect("back");
        } else {
            res.redirect("/photos/" + req.params.id);
        }
    });
});


// DESTROY ROUTE
router.delete("/:id", (req, res, next) => {
    Photo.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            next(err)
        } else {
            res.redirect("/photos");
        }
    });
});



module.exports = router;