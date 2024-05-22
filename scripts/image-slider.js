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
        img.height = 400
        img.width = 400
        figcaption.innerHTML = alt

        figure.appendChild(img)
        figure.appendChild(figcaption)

        this.#shadow.appendChild(figure)
      })

      this.#shadow.querySelector(`[key='${this.#current}']`).style.setProperty('display', 'flex')
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
    self.style.setProperty('overflow', 'hidden')

    const style = document.createElement('style')

    style.textContent = `
      figure {
        text-align: center;
        justify-content: center;
        flex-flow: column;
      }

      img {
        width: 100%;
        height: auto;

        @media only screen and (min-width: 768px) {
          height: unset;
          width: unset;
        }
      }

      .button {
        position: absolute;
        cursor: pointer;
        bottom: 50%;
        background: gray;
        color: #fff;
        height: 36px;
        width: 36px;
        border-radius: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.3em;
        font-weight: 700;
      }

      .button:hover {
        background: #008244;
        box-shadow: 0 0  4px #34ff34;
      }

      .prev {
        left: 32px;
      }

      .next {
        right: 32px;
      }
    `

    /* const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", "./scripts/image-slider.css"); */
    this.#shadow.appendChild(style);
  }

  setCurrent(n, len) {
    let curr = this.#current
    curr += n
    const figs = this.#shadow.querySelectorAll('figure')
    if(curr >= 0 && curr < len) {
      this.#current = curr
      figs.forEach((e) => {
        if(e.getAttribute('key') == curr) {
          e.style.setProperty('display', 'flex')
        } else {
          e.style.setProperty('display', 'none')
        }
      })
    }
  }

  /* attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`)
  } */

  /*
  disconnectedCallback() {
    console.log('Custom element removed from page.')
  }

  adoptedCallback() {
    console.log('Custom element moved to new page.')
  } */
}

customElements.define('image-slider', ImageSlider)
