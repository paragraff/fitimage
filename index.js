const path = require('path')
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

app.post('/upload', upload.array('images', 20), function (req, res, next) {
  res.type('application/json')
  if(req.files) {
    const files = handleFiles(req.files)
    res.send(JSON.parse(JSON.stringify({uploadedFiles: files, status: 0})))
  } else {
    res.send({status: 1})
  }
})

function clearOldImages () {
  setTimeout(() => {
    console.log('i\'ll remove all old images. Soon...')
    clearOldImages()
  }, 1000 * 60 * 5)
}
clearOldImages()

function handleFiles(files) {
  return files.map(file => {
    const pathToImg = file.path
    return 'images/' + path.parse(pathToImg).base
  })
}


app.listen(3000, () => console.log('Server started on port 3000'))