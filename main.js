const canvas = document.getElementById("myCanvas");
canvas.height = window.innerHeight;
canvas.width = 500;

const ctx = canvas.getContext("2d");
const car = new Car(100, 300, 30, 50)

animate();

function animate() {
  car.update();
  car.draw(ctx);
  requestAnimationFrame(animate)
}
