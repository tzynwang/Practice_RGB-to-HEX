const inputs = document.querySelectorAll('wired-slider')
const spans = document.querySelectorAll('.colorValue')
const hexCodeSpan = document.getElementById('hexCode')
const colorNameSpan = document.getElementById('colorName')
const rgbValue = { r: 0, g: 0, b: 0 }

// import color name
const colorWithName = {}
Papa.parse('../colorTickets.csv', {
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
    textColorAdjust()
  })
}

// copy button
document.getElementById('copyButton').addEventListener('click', () => {
  const range = document.createRange()
  range.selectNode(hexCodeSpan)
  window.getSelection().removeAllRanges() // clear current selection
  window.getSelection().addRange(range) // to select text
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
  textColorAdjust()
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
  textColorAdjust()
})

// functions
// set bg-color
function setBackgroundColor (target, r = 0, g = 0, b = 0) {
  document.querySelector(target).style.background = `rgb(${r}, ${g}, ${b})`
}

// RGB to HEX
function rgbToHex (r, g, b) {
  const rHex = parseInt(r, 10).toString(16).padStart(2, '0')
  const gHex = parseInt(g, 10).toString(16).padStart(2, '0')
  const bHex = parseInt(b, 10).toString(16).padStart(2, '0')
  return `#${rHex}${gHex}${bHex}`
}

// HEX code color adjust
function textColorAdjust () {
  // RGB to HSL
  const rawHSL = chroma(`rgb(${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b})`).hsl()
  let textHSL
  // if Lightness >= 50%
  if (rawHSL[2].toFixed(2) >= 0.5) {
    textHSL = ['0deg', '0%', '0%']
  } else {
    textHSL = ['0deg', '0%', '100%']
  }
  hexCodeSpan.style.color = colorNameSpan.style.color = `hsl(${textHSL[0]}, ${textHSL[1]}, ${textHSL[2]}`
}

// Check if HEX code color has name
function lookupName (hexCode) {
  const colorIndex = Object.values(colorWithName).indexOf(hexCode)
  if (Object.values(colorWithName).indexOf(hexCode) > -1) {
    colorNameSpan.textContent = `:${Object.keys(colorWithName)[colorIndex].replaceAll('"', '')}`
  } else {
    colorNameSpan.textContent = ''
  }
}
