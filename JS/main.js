const inputs = document.querySelectorAll('wired-slider')
const spans = document.querySelectorAll('.colorValue')
const hexCodeSpan = document.getElementById('hexCode')
const colorNameSpan = document.getElementById('colorName')
const rgbValue = { r: 0, g: 0, b: 0 }

// import color name
const colorWithName = {}
Papa.parse('./colorTickets.csv', {
  header: true,
  download: true,
  complete: function (result) {
    for (let i = 0; i < result.data.length; i++) {
      colorWithName[`"${result.data[i]['kanji']}"`] = `${result.data[i]['HEX']}`
    }
  }
})

for (let i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener('change', (event) => {
    const id = event.target.id
    const value = event.detail.value
    // save RGB values into rgbValue
    rgbValue[id] = value

    // set bg-color
    setBackgroundColor('.output', rgbValue.r, rgbValue.g, rgbValue.b)

    // update .colorValue spans
    spans[0].textContent = rgbValue.r
    spans[1].textContent = rgbValue.g
    spans[2].textContent = rgbValue.b

    // display HEX code
    const hex = rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b)
    hexCodeSpan.textContent = hex

    // check if HEX code has name
    lookupName(hex)

    // adjust HEX code color
    textColorAdjust(luminanceCalculate(rgbValue.r, rgbValue.g, rgbValue.b))
  })
}

// copy button
document.getElementById('copyButton').addEventListener('click', () => {
  const range = document.createRange()
  range.selectNode(hexCodeSpan)
  window.getSelection().removeAllRanges() // clear current selection
  window.getSelection().addRange(range) // select text
  document.execCommand('copy')
  window.getSelection().removeAllRanges() // deselect

  // notice user
  alert(`HEX code ${hexCodeSpan.textContent} is copied to clipboard 🌈`)
})

// lucky button
document.getElementById('luckyButton').addEventListener('click', () => {
  // generate num from 0 to 255
  for (const key in rgbValue) {
    rgbValue[key] = Math.floor(Math.random() * 255)
  }

  // set bg-color
  setBackgroundColor('.output', rgbValue.r, rgbValue.g, rgbValue.b)

  // update wired-slider value
  for (let i = 0; i < inputs.length; i++) {
    document.getElementById(inputs[i].id).value =
      rgbValue[Object.keys(rgbValue)[i]]
    spans[i].textContent = rgbValue[Object.keys(rgbValue)[i]]
  }

  // display HEX code
  const hex = rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b)
  hexCodeSpan.textContent = hex

  // check if HEX code has name
  lookupName(hex)

  // adjust HEX code color
  textColorAdjust(luminanceCalculate(rgbValue.r, rgbValue.g, rgbValue.b))
})

// reset button
document.getElementById('resetButton').addEventListener('click', () => {
  // reset rgbValue
  for (const key in rgbValue) {
    rgbValue[key] = 0
  }

  // reset bg-color
  setBackgroundColor('.output')

  // reset wired-slider value
  for (let i = 0; i < inputs.length; i++) {
    document.getElementById(inputs[i].id).value = 0
    spans[i].textContent = '0'
    rgbValue[Object.keys(rgbValue)[i]] = 0
  }

  // reset hexCodeSpan
  hexCodeSpan.textContent = '#000000'

  // reset colorName
  colorNameSpan.textContent = ''

  // adjust HEX code color
  textColorAdjust(luminanceCalculate(rgbValue.r, rgbValue.g, rgbValue.b))
})

// functions
// set bg-color
function setBackgroundColor (element, r = 0, g = 0, b = 0) {
  document.querySelector(element).style.background = `rgb(${r}, ${g}, ${b})`
}

// set text color
function setTextColor (element, r = 0, g = 0, b = 0) {
  document.querySelector(element).style.color = `rgb(${r}, ${g}, ${b})`
}

// RGB to HEX
function rgbToHex (r, g, b) {
  const rHex = parseInt(r, 10).toString(16).padStart(2, '0')
  const gHex = parseInt(g, 10).toString(16).padStart(2, '0')
  const bHex = parseInt(b, 10).toString(16).padStart(2, '0')
  return `#${rHex}${gHex}${bHex}`
}

// Check if HEX code color has name
function lookupName (hexCode) {
  const colorIndex = Object.values(colorWithName).indexOf(hexCode)
  Object.values(colorWithName).indexOf(hexCode) > -1
    ? colorNameSpan.textContent = `:${Object.keys(colorWithName)[colorIndex].replaceAll('"', '')}`
    : colorNameSpan.textContent = ''
}

// Calculate relative luminance
function luminanceCalculate (r, g, b) {
  const luminance = [r, g, b].map(function (value) {
    value /= 255
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4)
  })
  return luminance[0] * 0.2126 + luminance[1] * 0.7152 + luminance[2] * 0.0722
}

// Adjust text color
function textColorAdjust (luminance) {
  1.05 / (luminance + 0.05) < 4
    ? setTextColor('#hexCode')
    : setTextColor('#hexCode', 255, 255, 255)
}
