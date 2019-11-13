const path = require('path')
const fs = require('fs')
const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const multer = require('multer')

const parseFile = function(file, req) {
  var parsedFile = path.parse(file),
    fullUrl = req.protocol + '://' + req.get('host') + '/uploads/';

  return {
    name: parsedFile.name,
    base: parsedFile.base,
    extension: parsedFile.ext.substring(1),
    url: fullUrl + parsedFile.base,
    size: bytes(fs.statSync(file).size)
  };
};

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })

app.post('/uploadmultiple', upload.array('images', 20), function (req, res, next) {
  if(req.files) {
    res.type('application/json')
    res.send(JSON.parse(JSON.stringify({"uploadedFiles": req.files})))
  }
})

app.listen(3000, () => console.log('Server started on port 3000'))