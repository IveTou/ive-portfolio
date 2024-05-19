class ImageSlider extends HTMLElement {
  static observedAttributes = ['images']
  #current
  #shadow

  constructor() {
    // Always call super first in constructor
    self = super()
    this.#current = 0
    this.#shadow = this.attachShadow({ mode: 'closed' })
  }

  connectedCallback() {
    console.log('Custom element added to page.')
    const images = this.getAttribute('images')
    let imagesLen = 0

    try {
      const imageList = JSON.parse(images)
      imagesLen = imageList.length

      imageList.map(({ url, alt }, index) => {
        const figure = document.createElement('figure')
        figure.setAttribute('key', index)
        figure.style.setProperty('display', 'none')

        const img = document.createElement('img')
        const figcaption = document.createElement('figcaption')

        img.src = url
        img.alt = alt
        figcaption.innerHTML = alt

        figure.appendChild(img)
        figure.appendChild(figcaption)

        this.#shadow.appendChild(figure)
      })

      this.#shadow.querySelector(`[key='${this.#current}']`).style.setProperty('display', 'block')
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

    this.#shadow.appendChild(prev)
    this.#shadow.appendChild(next)

    self.style.setProperty('position', 'relative')

    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "./scripts/image-slider.css");
    this.#shadow.appendChild(linkElem);
  }

  setCurrent(n, len) {
    let curr = this.#current
    curr += n
    const figs = this.#shadow.querySelectorAll('figure')
    if(curr >= 0 && curr < len) {
      this.#current = curr
      figs.forEach((e) => {
        if(e.getAttribute('key') == curr) {
          e.style.setProperty('display', 'block')
        } else {
          e.style.setProperty('display', 'none')
        }
      })
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
