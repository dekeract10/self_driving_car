const ACCELERATION = 0.2
const STEERING = Math.PI / 120
const MAX_SPEED = 5
const MIN_SPEED = -5
const FRICTION = 0.05

const LIGHT_OFFSET_FACTOR = 4 / 18
const HEADLIGHT_HEIGHT_FACTOR = 31 / 32
const BACKLIGHT_HEIGHT_FACTOR = 0
const SHADOW_BLUR_SIZE = 10
const HEADLIGHT_COLOR = "yellow"
const BACKLIGHT_COLOR = "red"
const LIGHT_SIZE = 5

class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0
    this.acceleration = ACCELERATION
    this.direction = Math.PI

    this.carImage = new Image(this.width, this.height)
    this.carImage.src = "car.png"

    this.startingDriftDirection = this.direction;
    this.lastSteeringDirection = 0;

    this.controls = new Controls();
  }

  update() {
    if (this.controls.forward) {
      this.speed += this.acceleration
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration
    }

    let steering = 0

    if (this.controls.left) {
      steering += STEERING * this.speed / MAX_SPEED
    }
    if (this.controls.right) {
      steering -= STEERING * this.speed / MAX_SPEED
    }

    if (!this.controls.reverse && !this.controls.forward) {
      this.speed *= (1 - FRICTION)
    }
    if (Math.abs(this.speed) < 0.01) {
      this.speed = 0
    }

    if (this.speed > MAX_SPEED) {
      this.speed = MAX_SPEED

    }

    if (this.speed < -MAX_SPEED / 2) {
      this.speed = -MAX_SPEED / 2
    }

    let deltaY = 0;
    let deltaX = 0;

    if (this.controls.handbrake) {
      this.direction += steering;
      if (this.lastSteeringDirection != Math.sign(steering)) {
        this.startingDriftDirection = this.direction;
      }

      let relativeDriftDirection = this.direction - this.startingDriftDirection;
      let absoluteDriftDirection = 0;
      if (relativeDriftDirection < 0) {
        absoluteDriftDirection = this.direction - Math.max(relativeDriftDirection, -Math.PI / 4);
      } else {
        absoluteDriftDirection = this.direction - Math.min(relativeDriftDirection, Math.PI / 4);
      }
      deltaX = this.speed * Math.sin(absoluteDriftDirection);
      deltaY = this.speed * Math.cos(absoluteDriftDirection);
    } else {
      this.direction += steering;
      this.startingDriftDirection = this.direction
      deltaX = this.speed * Math.sin(this.direction);
      deltaY = this.speed * Math.cos(this.direction);
    }


    this.x += deltaX
    this.y += deltaY

    this.lastSteeringDirection = Math.sign(steering);
    // this.direction += steering


  }
  draw(ctx) {

    let center_y = this.y - this.height / 2
    let center_x = this.x - this.width / 2

    canvas.height = window.innerHeight
    ctx.save()


    ctx.translate(
      this.x,
      this.y
    )
    ctx.rotate(-this.direction);
    ctx.translate(
      -this.x,
      -this.y
    )

    ctx.translate(
      center_x,
      center_y
    )
    ctx.beginPath();
    ctx.fill();
    ctx.drawImage(this.carImage, 0, 0, this.width, this.height);
    if (this.speed > 0) {
      this.#drawLights(ctx, LIGHT_OFFSET_FACTOR, HEADLIGHT_HEIGHT_FACTOR, LIGHT_SIZE, HEADLIGHT_COLOR)
    } else if (this.speed < 0) {
      this.#drawLights(ctx, LIGHT_OFFSET_FACTOR, BACKLIGHT_HEIGHT_FACTOR, LIGHT_SIZE, BACKLIGHT_COLOR)
    } else {

    }
    ctx.restore()
  }


  #drawLights(ctx, factor, heightFactor, size, color) {
    ctx.globalCompositeOperation = "source-atop"
    ctx.fillStyle = color
    ctx.shadowColor = color
    ctx.shadowBlur = SHADOW_BLUR_SIZE
    ctx.beginPath();
    ctx.arc(this.width * factor, this.height * heightFactor, size, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.width * (1 - factor), this.height * heightFactor, size, 0, 2 * Math.PI);
    ctx.fill();
  }

}

