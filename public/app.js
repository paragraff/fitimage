const inputElement = document.getElementsByName("images")[0]
inputElement.addEventListener('change', handleFiles, false)

const fileChooseElement = document.querySelector('[name=dropbox]')
fileChooseElement.addEventListener('click', chooseFiles, false)

const uploadBtn = document.querySelector('[name=upload]')
uploadBtn.addEventListener('click', uploadImages, false)

const resultBox = document.querySelector('[name=result]')

async function handleFiles(event) {
  // show image preview in the dropbox
  if (inputElement.files.length) {
    fileChooseElement.innerHTML = 'Ok, now press the button!'
  }
}

function chooseFiles(event) {
  inputElement.click()
}

async function uploadImages() {
  // send the files to refit
  const images = await refitImages(inputElement.files)
  // show result block with refited image links
  showImages(images)
  // reset function shouldn't be called immediately after upload
  // we will clean form optionaly
  resetInput(inputElement)
}

async function refitImages(images, input) {
  let formData = new FormData()
  Array.from(images).forEach(file => formData.append('images', file))

  const response = await fetch('/upload', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: formData
  })
  const result = await response.json()
  return result.status === 0 ? result.uploadedFiles : []
}

function resetInput(input) {
  input.value = ''
  fileChooseElement.innerHTML = 'Click here to choose images'
}

function showImages(images) {
  const html = images.reduce((result, img) => {
    return result + `<a class="fit-image" href="${img}" download>${img.split('/')[1]}</a>`
  }, '')
  resultBox.innerHTML = html
}