var multer  = require('multer')
import * as express from "express";
let busboy = require('connect-busboy')
const router = express.Router();
const path = require('path');
import {Utils} from "../../libs/utils";
let now=Utils.todayDateAndTime();
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './files/subjects');
    },
    filename: function (req, file, cb) {
      const fileName = 'Subject' + '-' + now + path.extname(file.originalname);
        return cb(null, fileName);
    }
  });
  
var upload = multer({ storage : storage});
router.route('/subject').post(upload.single('file'), function(req, res) {
    res.json({message: "File created successfully"});
})
// router.post("/subject", function(req, res) {
//     console.log('req.busboy', req.busboy);
//     if(req.busboy) {
//         req.busboy.on("file", function(fieldName, fileStream, fileName, encoding, mimeType) {
//             //Handle file stream here
//         });
//         return req.pipe(req.busboy);
//     }
//     //Something went wrong -- busboy was not loaded
// });
  export default router;