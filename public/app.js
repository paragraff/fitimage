const inputElement = document.getElementsByName("images")[0]
inputElement.addEventListener("change", handleFiles, false)

async function handleFiles (event) {
  await refitImages(this.files)
  resetInput(this)
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
  console.log(response)
}

function resetInput(input) {
  input.value = ''
}