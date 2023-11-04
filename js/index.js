const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1424;
canvas.height = 800;

const FIELD_LENGTH = 20000;

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
  constructor() {
    // this.width = 20;
    // this.height = 60;
    this.rotation = 0;

    const image = new Image();
    image.src = "./player.png";

    image.onload = () => {
      this.image = image;
      this.width = image.width * 0.12;
      this.height = image.height * 0.12;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height / 2 - this.height / 2,
      };
    };
  }

  draw() {
    if (!this.image) return;
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
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
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

class Emission {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 4;
    this.blur = 1;
  }

  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "#9c9c9c";
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
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

class Missile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 10;
    this.height = 30;

    const image = new Image();
    image.src = "./missile.png";

    image.onload = () => {
      this.image = image;
      this.width = image.width * 0.08;
      this.height = image.height * 0.08;
    };
  }

  draw() {
    if (!this.image) return;
    ctx.fillStyle = "red";
    ctx.save();
    ctx.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    ctx.rotate(-Math.atan2(this.velocity.x, this.velocity.y));
    ctx.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    ctx.restore();
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.draw();
  }
}

const player = new Player();

const clouds = [];

for (let i = 0; i < FIELD_LENGTH / 2; i++) {
  clouds.push(
    new Cloud({
      position: {
        x:
          Math.floor(Math.random() * (canvas.width + FIELD_LENGTH * 2)) -
          FIELD_LENGTH,
        y:
          Math.floor(Math.random() * (canvas.height + FIELD_LENGTH)) -
          FIELD_LENGTH,
      },
      radius: Math.floor(Math.random() * 100) + 20,
    })
  );
}

let emissions = [];
const missiles = [];

const missile = new Missile({
  position: {
    x: canvas.width / 2 - 20,
    y: 800,
  },
  velocity: {
    x: 0,
    y: 0,
  },
});

let t = 0;
let flag = false;
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

  emissions.forEach((emission, i) => {
    if (
      Math.abs(emission.position.y - canvas.height / 2) > 110 ||
      Math.abs(emission.position.x - canvas.width / 2) > 50
    ) {
      setTimeout(() => {
        emissions.splice(i, 1);
      }, 0);
    }
    emission.velocity.x = 4 * direction.x;
    emission.velocity.y = 4 * direction.y;

    emission.update();
    emission.draw();
  });

  if (t % 7 === 0 && emissions.length < 20) {
    emissions.push(
      new Emission({
        position: {
          x: canvas.width / 2,
          y: canvas.height / 2,
        },
        velocity: {
          x: 5 * direction.x,
          y: 5 * direction.y,
        },
      })
    );
  }

  if (keys.arrowLeft.pressed) {
    player.rotation -= 0.05;
  } else if (keys.arrowRight.pressed) {
    player.rotation += 0.05;
  }
  player.draw();

  console.log(missile.velocity.x, missile.velocity.y);
  if (keys.arrowLeft.pressed) {
    if (missile.position.y > player.position.y) {
      missile.velocity.x += 0.14;
      missile.velocity.y -= 0.2;
    }
    flag = true;
  } else if (keys.arrowRight.pressed) {
    if (missile.position.y > player.position.y) {
      missile.velocity.x -= 0.14;
      missile.velocity.y -= 0.3;
    }
    flag = true;
  } else {
    if (!flag) {
      missile.velocity.x = -direction.x * 6;
      missile.velocity.y = -direction.y * 6;
    }
  }

  console.log(player.width);

  missile.update();

  t++;
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
