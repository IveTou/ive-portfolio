var i = 0;

function typeWriter() {
  const speed = 50;
  const txt = `
  Hi, I'm Ive! I'm a seasoned and dynamic software developer with
  a broad range of experience. My projects span from game development
  to cutting-edge research in machine learning. I'm deeply passionate about
  embracing new technologies and fostering learning, whether through teaching
  or leading by example. Here, I'm excited to showcase some of the stacks
  and insights I've accumulated over the years.
  `;

  if (i < txt.length) {
    document.getElementById("presentation").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}

document.body.addEventListener('load', typeWriter())

document.body.addEventListener('load', function() {
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
