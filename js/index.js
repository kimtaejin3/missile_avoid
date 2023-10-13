const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1424;
canvas.height = 800;

class Player {
  constructor({ position }) {
    this.position = position;
    this.width = 20;
    this.height = 60;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class Cloud {
  constructor({ position, radius }) {
    this.position = position;
    this.radius = radius;
  }

  draw() {
    ctx.beginPath();
    ctx.globalAlpha = "0.3";
    ctx.fillStyle = "white";
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const player = new Player({
  position: {
    x: canvas.width / 2,
    y: canvas.height / 2,
  },
});

const clouds = [];

for (let i = 0; i < 20; i++) {
  clouds.push(
    new Cloud({
      position: {
        x: Math.floor(Math.random() * canvas.width) + 0,
        y: Math.floor(Math.random() * canvas.height) + 0,
      },
      radius: Math.floor(Math.random() * 80) + 50,
    })
  );
}

function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = "#d4eeff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < clouds.length; i++) {
    clouds[i].draw();
  }

  player.draw();
}

animate();
