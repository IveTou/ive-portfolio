var i = 0;
var txt = `
  Hi, I'm Ive! I'm a seasoned and dynamic software developer with
  a broad range of experience. My projects span from game development
  to cutting-edge research in machine learning. I'm deeply passionate about
  embracing new technologies and fostering learning, whether through teaching
  or leading by example. Here, I'm excited to showcase some of the stacks
  and insights I've accumulated over the years.
`;

var speed = 50;

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("presentation").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}
