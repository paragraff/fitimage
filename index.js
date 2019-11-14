const express = require('express')
const app = express()
const multer = require('multer')

app.use(express.static(__dirname + '/public'))

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/')
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