const contentJson = {
  nav: {
    personal: { en: 'Personal', pt: 'Pessoal'},
    cases: { en: 'Cases', pt: 'Casos'},
    tests: { en: 'Tests', pt: 'Desafios'},
    about: { en: 'About', pt: 'Sobre mim'}
  },
  intro: {
    title: { en: 'Ive\'s developer page!', pt: 'Ive - Portifólio profissional'},
    'title-greets': {
      en: `
        Hi, I'm Ive! I'm a seasoned and dynamic software developer with
        a broad range of experience. My projects span from game development
        to cutting-edge research in Machine Learning. I'm deeply passionate about
        embracing new technologies and fostering learning, whether through teaching
        or leading by example. Here, I'm excited to showcase some of the stacks
        and insights I've accumulated over the years.
      `,
      pt: `
        Olá, meu nome é Ive! Sou um desenvolvedor de software experiente e dinâmico
        com uma ampla experiência. Meus projetos abrangem desde o desenvolvimento de
        jogos até pesquisas de ponta em Machine Learning. Sou profundamente
        apaixonado tecnologia e promover o aprendizado, seja por
        meio do ensino ou por exemplo. Aqui, irei mostrar
        algumas das tecnologias e insights que acumulei ao longo dos anos.
      `
    },
    'title-i': { en: '..and I kinda like ', pt: '...e eu gosto um tanto de '},
    'title-link': { en: 'palindromes...', pt: 'palíndromos...'},
    'address-title': {
      en: 'Feel free to delve in and reach out to share your thoughts.',
      pt: 'Sinta-se bem-vindo à minha página e compartilhe suas dúvidas, críticas e sugestẽs!'
    },
  },
  personal : {
    title: { en: 'Personal Projects', pt: 'Projetos Pessoais'},
  },
  tests : {
    title: { en: 'Coding Tests', pt: 'Desafios'},
  },
  cases : {
    title: { en: 'Cases', pt: 'Casos'},
  },
  about : {
    title: { en: 'About', pt: 'Sobre mim'},
    content: {
      en: `
        Experienced Software Engineer with 7+ years of expertise in delivering high-quality solutions to companies. I help organizations optimize their digital presence and drive measurable results through my proficiency in cutting-edge technologies and strategic problem-solving.
      `,
      pt: `
        Engenheiro de Software Experiente com mais de 7 anos de experiência em entregar soluções de alta qualidade para empresas. Ajudando organizações a otimizar sua presença digital e a obter resultados mensuráveis através da minha proficiência em tecnologias de ponta e resolução estratégica de problemas.
      `
    },
  },
  metrics: {
    title: { en: 'Metrics', pt: 'Métricas'},
    updated_at: { en: '23th May, 2024 ', pt: '23 de Maio, 2024'},
    lcp: {
      en: 'Measures loading performance. To provide a good user experience, strive to have LCP occur within the first 2.5 seconds of the page starting to load.',
      pt: 'Mede o desempenho de carregamento. Para fornecer uma boa experiência ao usuário, esforce-se para que o LCP ocorra nos primeiros 2,5 segundos após o início do carregamento da página.'
    },
    fcp: {
      en: 'FCP measures the time from when the user first navigates to the page to when any part of the page\'s content is rendered on the screen. To provide a good user experience, sites must have an FCP of 1.8 seconds or less.',
      pt: 'O FCP mede o tempo desde o momento em que o usuário navega pela primeira vez até a página até o momento em que qualquer parte do conteúdo da página é renderizada na tela. Para proporcionar uma boa experiência ao usuário, os sites devem ter um FCP de 1,8 segundos ou menos.'
    },
    inp: {
      en: 'Measures responsiveness. To provide a good user experience, strive to have an INP of less than 200 milliseconds.',
      pt: 'Mede a capacidade de resposta. Para fornecer uma boa experiência ao usuário, esforce-se para ter um INP inferior a 200 milissegundos.'
    },
    cls: {
      en: 'Measures visual stability. To provide a good user experience, strive to have a CLS score of less than 0.1.',
      pt: 'Mede a estabilidade visual. Para fornecer uma boa experiência ao usuário, esforce-se para ter uma pontuação CLS inferior a 0,1.'
    },
  },
  misc: {
    source: { en: 'Source Code', pt: 'Código Fonte'},
    updated: { en: 'Updated at ', pt: 'Data de atualização: '},
  }
}

var i = 0;
var timeoutId
var langRef

function typeWriter() {
  const speed = 30;
  const language = window.localStorage.getItem('language') || 'en';
  const element = document.getElementById('about-content')
  /* clear state */
  if(language !== langRef) {
    langRef = language
    clearTimeout(timeoutId)
    i = 0
    element.innerHTML = ''
  }

  const txt = contentJson.about.content[language]

  if (i < txt.length) {
    element.innerHTML += txt.charAt(i);
    i++;
    timeoutId = setTimeout(typeWriter, speed);
  }
}

document.body.addEventListener('load', typeWriter())

const toggle = document.getElementById('slider-toggle')

document.body.addEventListener('load', function() {
  const theme = window.localStorage.getItem('theme')

  if (theme === 'dark') {
    document.body.classList.add('dark')
    toggle.checked = true;
  } else {
    document.body.classList.remove('dark')
    toggle.checked = false;
  }
}())

toggle.addEventListener('click', () => {
  document.getElementById('input-toggle').click()
  const theme = window.localStorage.getItem('theme')
  const isDark = theme === 'dark'

  if (isDark) {
    window.localStorage.setItem('theme', 'light')
    document.body.classList.remove('dark')
  } else {
    window.localStorage.setItem('theme', 'dark')
    document.body.classList.add('dark')
  }
});

var i18nElements
const engFlag = document.getElementById('en-us')
const ptFlag = document.getElementById('pt-br')

function setPageLanguage() {
  i18nElements = document.querySelectorAll('[data-i18n]')
  const language = window.localStorage.getItem('language') || 'en'
  document.querySelector('html').setAttribute('lang', language)

  if (language == 'en') {
    engFlag.style.setProperty('filter', 'grayscale(0%)');
    ptFlag.style.setProperty('filter', 'grayscale(100%)');
  } else {
    engFlag.style.setProperty('filter', 'grayscale(100%)');
    ptFlag.style.setProperty('filter', 'grayscale(0%)');
  }

  for(let i = 0; i < i18nElements.length; i++) {
    const ele = i18nElements[i]
    const index = ele.attributes['data-i18n'].value

    const [root, child] = index.split('.')

    ele.innerHTML = contentJson[root][child][language]
  }
}

document.body.addEventListener('load', setPageLanguage())

function languageChangeHandler(e) {
  if(!e) return
  const lang = e.split('-')[0]
  if(!lang) return
  window.localStorage.setItem('language', e.split('-')[0])

  typeWriter()
  setPageLanguage()
}

engFlag.addEventListener('click', () => languageChangeHandler('en-us'))
ptFlag.addEventListener('click', () => languageChangeHandler('pt-br'))


/* document.body.addEventListener('load', (async () => {
  const response = await fetch(
    'https://cat-fact.herokuapp.com/facts',
    {
      method: 'get',
      //headers: {
        //Authorization: `Basic ${process.env.REACT_APP_BFF_AUTH_SECRET}`,
        //'x-user-id': userId,
      //},
    }
  );

  console.log(response)
})()) */
