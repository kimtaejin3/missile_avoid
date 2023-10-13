const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1424;
canvas.height = 800;

const FIELD_LENGTH = 20000;

const direction = [
  {
    x: 0,
    y: 1,
  },
  {
    x: -1,
    y: 1,
  },
  {
    x: -1,
    y: 0,
  },
  {
    x: 0,
    y: -1,
  },
  {
    x: 1,
    y: -1,
  },
  {
    x: 1,
    y: 0,
  },
  {
    x: 1,
    y: 1,
  },
  {
    x: -1,
    y: -1,
  },
];

const keys = {
  arrowLeft: {
    pressed: false,
  },
  arrowRight: {
    pressed: false,
  },
};

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
  }

  mult(n) {
    this.x *= n;
    this.y *= n;
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y + this.y);
  }

  get() {
    return new Vector(this.x, this.y);
  }

  normalize() {
    this.x = normalize(this.x);
    this.y = normalize(this.y);
  }

  copy() {
    return new Vector(this.x, this.y);
  }
}

class Player {
  constructor({ position, degree }) {
    this.position = position;
    this.width = 20;
    this.height = 60;
    this.degree = degree;
    this.rotation = 0;
  }

  draw() {
    ctx.save();
    ctx.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2
    );
    ctx.rotate(this.rotation);
    ctx.translate(
      -player.position.x - player.width / 2,
      -player.position.y - player.height / 2
    );
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.restore();
  }
}

class Cloud {
  constructor({ position, radius }) {
    this.position = position;
    this.radius = radius;
    this.velocity = {
      x: 0,
      y: 3,
    };
  }

  draw() {
    ctx.beginPath();
    ctx.globalAlpha = "0.7";
    ctx.fillStyle = "white";
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    if (player.rotation !== 0) {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    } else {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }
}

const player = new Player({
  position: {
    x: canvas.width / 2,
    y: canvas.height / 2,
  },
});

const clouds = [];

for (let i = 0; i < FIELD_LENGTH / 2; i++) {
  clouds.push(
    new Cloud({
      position: {
        x:
          Math.floor(Math.random() * (canvas.width + FIELD_LENGTH)) -
          FIELD_LENGTH,
        y:
          Math.floor(Math.random() * (canvas.height + FIELD_LENGTH)) -
          FIELD_LENGTH,
      },
      radius: Math.floor(Math.random() * 100) + 20,
    })
  );
}

function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = "#d4eeff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < clouds.length; i++) {
    clouds[i].update();
    clouds[i].draw();
  }

  let direction = new Vector(
    -Math.sin(player.rotation),
    Math.cos(player.rotation)
  );

  for (let j = 0; j < clouds.length; j++) {
    clouds[j].velocity.x = 5 * direction.x;
    clouds[j].velocity.y = 5 * direction.y;
  }
  console.log(player.rotation);
  if (keys.arrowLeft.pressed) {
    player.rotation -= 0.05;
  } else if (keys.arrowRight.pressed) {
    player.rotation += 0.05;
  }
  player.draw();
}

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowRight":
      keys.arrowRight.pressed = true;
      break;
    case "ArrowLeft":
      keys.arrowLeft.pressed = true;
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowRight":
      keys.arrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.arrowLeft.pressed = false;
      break;
  }
});

animate();
