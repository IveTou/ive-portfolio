const contentJson = {
  "nav": {
    "personal": { en: "Personal", pt: "Pessoal"},
    "cases": { en: "Cases", pt: "Casos"},
    "tests": { en: "Tests", pt: "Desafios"}
  },
  "intro": {
    "title": { en: "Ive's developer page!", pt: "Ive - Portifolio profissional"},
    "title-greets": {
      en: `
        Hi, I'm Ive! I"m a seasoned and dynamic software developer with
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
    "title-i": { en: "..and I kinda like ", pt: "...e eu gosto um tanto de "},
    "title-link": { en: "palindromes...", pt: "palíndromos..."},
    "addres-title": {
      en: "Feel free to delve in and reach out to share your thoughts.",
      pt: "Sinta-se bem-vindo à minha página e compartilhe suas dúvidas, críticas e sugestẽs!"
    },
  },
  "personal" : {
    "title": { en: "Personal Projects", pt: "Projetos Pessoais"},
  },
  "tests" : {
    "title": { en: "Coding Tests", pt: "Desafios"},
  },
  "cases" : {
    "title": { en: "Cases", pt: "Casos"},
  },
  "metrics": {
    title: { en: "Metrics", pt: "Métricas"},
    updated: { en: "Updated at", pt: "Data de atualização"},
    lcp: {
      en: "Measures loading performance. To provide a good user experience, strive to have LCP occur within the first 2.5 seconds of the page starting to load.",
      pt: "Mede o desempenho de carregamento. Para fornecer uma boa experiência ao usuário, esforce-se para que o LCP ocorra nos primeiros 2,5 segundos após o início do carregamento da página."
    },
    inp: {
      en: "Measures responsiveness. To provide a good user experience, strive to have an INP of less than 200 milliseconds.",
      pt: "Mede a capacidade de resposta. Para fornecer uma boa experiência ao usuário, esforce-se para ter um INP inferior a 200 milissegundos."
    },
    cls: {
      en: "Measures visual stability. To provide a good user experience, strive to have a CLS score of less than 0.1.",
      pt: "Mede a estabilidade visual. Para fornecer uma boa experiência ao usuário, esforce-se para ter uma pontuação CLS inferior a 0,1."
    },
  },
  "misc": {
    "soruce": { en: "Source Code", pt: "Código Fonte"},
  }
}

var i = 0;

function typeWriter() {
  const language = window.localStorage.getItem("language") || 'en';
  const speed = 50;
  const txt = contentJson.intro["title-greets"][language]

  if (i < txt.length) {
    document.getElementById("presentation").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}

document.body.addEventListener("load", typeWriter())

document.body.addEventListener("load", function() {
  const theme = window.localStorage.getItem("theme")
  if (theme === "dark") document.body.classList.add("dark")
}())

const toggle = document.getElementById("input-toggle")

toggle.addEventListener("click", () => {
  const theme = window.localStorage.getItem("theme")
  const force = theme === "dark"

  if (force) {
    document.body.classList.remove("dark")
    window.localStorage.setItem("theme", "light")
  } else {
    document.body.classList.add("dark")
    window.localStorage.setItem("theme", "dark")
  }
});

var i18nElements

function setPageLanguage() {
  i18nElements = document.querySelectorAll("[data-i18n]")
  const language = window.localStorage.getItem("language") || 'en';


  for(let i = 0; i < i18nElements.length; i++) {
    const ele = i18nElements[i]
    const index = ele.attributes["data-i18n"].value

    const [root, child] = index.split(".")

    ele.innerHTML = contentJson[root][child][language]
  }
}

document.body.addEventListener("load", setPageLanguage())
