class ImageSlider extends HTMLElement {
  static observedAttributes = ['images']
  #current

  constructor() {
    // Always call super first in constructor
    super()
    this.#current = 0
  }

  connectedCallback() {
    console.log('Custom element added to page.')
    const shadow = this.attachShadow({ mode: 'open' })
    const images = this.getAttribute('images')
    let imagesLen = 0

    try {
      const imageList = JSON.parse(images)
      imagesLen = imageList.length

      imageList.map(({ url, alt }, index) => {
        const figure = document.createElement('figure')
        figure.setAttribute('key', index)

        const img = document.createElement('img')
        const figcaption = document.createElement('figcaption')

        img.src = url
        img.alt = alt
        figcaption.innerHTML = alt

        figure.appendChild(img)
        figure.appendChild(figcaption)

        shadow.appendChild(figure)
      })
    } catch (error) {
      console.error(error)
    }

    const prev = document.createElement('a')
    const next = document.createElement('a')

    prev.setAttribute("class", "button prev")
    next.setAttribute("class", "button next")
    prev.innerHTML = '<'
    next.innerHTML = '>'
    prev.addEventListener('click', () => this.setCurrent(-1, imagesLen))
    next.addEventListener('click', () => this.setCurrent(1, imagesLen))

    shadow.appendChild(prev)
    shadow.appendChild(next)
  }

  setCurrent(n, len) {
    let curr = this.#current
    curr += n

    if(curr >= 0 && curr < len) {
      this.#current = curr
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`)
  }

  /*
  disconnectedCallback() {
    console.log('Custom element removed from page.')
  }

  adoptedCallback() {
    console.log('Custom element moved to new page.')
  } */
}

customElements.define('image-slider', ImageSlider)
