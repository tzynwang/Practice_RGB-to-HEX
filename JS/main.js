const data = {
  rgbValue: { r: 0, g: 0, b: 0 },
  colorWithName: {}
}

const elementObjects = {
  inputSection: document.querySelector('.input'),
  inputs: document.querySelectorAll('input'),
  colorValueSpans: document.querySelectorAll('.colorValue'),
  hexCodeSpan: document.querySelector('#hexCode'),
  colorNameSpan: document.querySelector('#colorName'),
  copyButton: document.querySelector('#copyButton'),
  luckyButton: document.querySelector('#luckyButton'),
  resetButton: document.querySelector('#resetButton')
}

const view = {
  setBackgroundColor (target, r = 0, g = 0, b = 0) {
    document.querySelector(target).style.background = `rgb(${r}, ${g}, ${b})`
  },
  displayColorValueText (target, value) {
    target.forEach((item, index) => {
      item.textContent = value[Object.keys(value)[index]]
    })
  },
  setTextContent (target, textContent) {
    target.textContent = textContent
  },
  adjustTextColor (targets) {
    // RGB to HSL
    const rawHSL = chroma(`rgb(${data.rgbValue.r}, ${data.rgbValue.g}, ${data.rgbValue.b})`).hsl()
    let textHSL
    // if Lightness >= 50%
    rawHSL[2].toFixed(2) >= 0.5
      ? textHSL = ['0deg', '0%', '0%']
      : textHSL = ['0deg', '0%', '100%']
    targets.forEach(target => {
      target.style.color = `hsl(${textHSL[0]}, ${textHSL[1]}, ${textHSL[2]}`
    })
  },
  displayAlertMessage (message) {
    window.alert(message)
  },
  setInputsValue (targets) {
    targets.forEach(target => {
      target.value = data.rgbValue[target.id]
    })
  }
}

const controller = {
  importColorName (filePath, saveToObject) {
    Papa.parse(filePath, {
      header: true,
      download: true,
      complete: function (result) {
        result.data.forEach(item => {
          saveToObject[`"${item.kanji}"`] = `${item.HEX}`
        })
      }
    })
  },
  updateRBGValue (color, value) {
    data.rgbValue[color] = value
  },
  rgbToHex (r, g, b) {
    const rHex = parseInt(r, 10).toString(16).padStart(2, '0')
    const gHex = parseInt(g, 10).toString(16).padStart(2, '0')
    const bHex = parseInt(b, 10).toString(16).padStart(2, '0')
    return `#${rHex}${gHex}${bHex}`
  },
  lookUpName (hexCode) {
    const colorIndex = Object.values(data.colorWithName).indexOf(hexCode)
    return Object.values(data.colorWithName).indexOf(hexCode) > -1
      ? `:${Object.keys(data.colorWithName)[colorIndex].replaceAll('"', '')}`
      : ''
  },
  copyText (target) {
    const range = document.createRange()
    range.selectNode(target)
    window.getSelection().removeAllRanges() // clear current selection
    window.getSelection().addRange(range) // to select text
    document.execCommand('copy')
    window.getSelection().removeAllRanges() // deselect
  },
  generateRandomColor () {
    for (const key in data.rgbValue) {
      data.rgbValue[key] = Math.floor(Math.random() * 256)
    }
  },
  resetRGBValue () {
    for (const key in data.rgbValue) {
      data.rgbValue[key] = 0
    }
  }
}

// import color name
controller.importColorName('./colorTickets.csv', data.colorWithName)

// listen to input
elementObjects.inputSection.addEventListener('input', (event) => {
  const target = event.target
  if (target.tagName === 'INPUT') {
    const colorChanged = target.id
    const value = Number(target.value)
    controller.updateRBGValue(colorChanged, value)
    view.setBackgroundColor('.output', data.rgbValue.r, data.rgbValue.g, data.rgbValue.b)
    view.displayColorValueText(elementObjects.colorValueSpans, data.rgbValue)
    const hexCode = controller.rgbToHex(data.rgbValue.r, data.rgbValue.g, data.rgbValue.b)
    view.setTextContent(elementObjects.hexCodeSpan, hexCode)
    view.setTextContent(elementObjects.colorNameSpan, controller.lookUpName(hexCode))
    view.adjustTextColor([elementObjects.hexCodeSpan, elementObjects.colorNameSpan])
  }
})

// copy color
elementObjects.copyButton.addEventListener('click', () => {
  controller.copyText(elementObjects.hexCodeSpan)
  view.displayAlertMessage(`HEX code ${elementObjects.hexCodeSpan.textContent} is copied to clipboard 🌈`)
})

// random generate color
elementObjects.luckyButton.addEventListener('click', () => {
  controller.generateRandomColor()
  view.setBackgroundColor('.output', data.rgbValue.r, data.rgbValue.g, data.rgbValue.b)
  view.setInputsValue(elementObjects.inputs)
  view.displayColorValueText(elementObjects.colorValueSpans, data.rgbValue)
  const hexCode = controller.rgbToHex(data.rgbValue.r, data.rgbValue.g, data.rgbValue.b)
  view.setTextContent(elementObjects.hexCodeSpan, hexCode)
  view.setTextContent(elementObjects.colorNameSpan, controller.lookUpName(hexCode))
  view.adjustTextColor([elementObjects.hexCodeSpan, elementObjects.colorNameSpan])
})

// reset button
document.getElementById('resetButton').addEventListener('click', () => {
  controller.resetRGBValue()
  view.setBackgroundColor('.output')
  view.setInputsValue(elementObjects.inputs)
  view.displayColorValueText(elementObjects.colorValueSpans, data.rgbValue)
  view.setTextContent(elementObjects.hexCodeSpan, '#000000')
  view.setTextContent(elementObjects.colorNameSpan, '')
  view.adjustTextColor([elementObjects.hexCodeSpan, elementObjects.colorNameSpan])
})
