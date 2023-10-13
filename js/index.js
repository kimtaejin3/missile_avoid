const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1424;
canvas.height = 800;

function animate() {
  window.requestAnimationFrame(animate);
  ctx.fillStyle = "#d4eeff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  console.log("animate");
}

animate();
