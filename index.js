const path = require('path')
const express = require('express')
const app = express()
const multer = require('multer')
const sharp = require('sharp')

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

app.post('/upload', upload.array('images', 20), async function (req, res, next) {
  res.type('application/json')
  if(req.files) {
    const files = await handleFiles(req.files)
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

async function handleFiles(files) {
  await Promise.all(files.map(file => {
    return sharp(file.path)
    .metadata()
    .then(data => {
      return sharp(file.path)
      .resize({width: Math.min(830, data.width)})
      .toFile('public/result/' + path.parse(file.path).base)
    })
  }))
  return files.map(file => {
    const pathToImg = file.path
    return 'result/' + path.parse(pathToImg).base
  })
}


app.listen(3000, () => console.log('Server started on port 3000'))