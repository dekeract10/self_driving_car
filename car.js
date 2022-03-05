const ACCELERATION = 0.2
const STEERING = 0.2
const MAX_SPEED = 5
const MIN_SPEED = -5


class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get x() {
    return this.x;
  }
  get y() {
    return this.y;
  }

  // rotate this vector by the given `angle` in radians
  rotate(angle) {
    this.x = x * cos(angle) - y * sin(angle);
    this.y = x * sin(angle) + y * cos(angle);
  }

  // Rotates vector around a position vector by `angle` in radians
  rotateAround(angle, positionVector) {
    let differenceVector = this.substract(positionVector)
    differenceVector.rotate(angle);
    return differenceVector.add(positionVector);
  }

  add(vector) {
    let newX = this.x + vector.x;
    let newY = this.y + vector.y;

    return new Vector2D(newX, newY);
  }

  substract(vector) {
    let newX = this.x - vector.x;
    let newY = this.y - vector.y;

    return new Vector2D(newX, newY);
  }
}

class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0
    this.acceleration = ACCELERATION
    this.steering = STEERING

    this.direction = -90

    this.controls = new Controls();
  }

  update() {
    if (this.controls.forward && this.speed <= MAX_SPEED) {
      this.speed += this.acceleration
    }
    if (this.controls.reverse && this.speed >= MIN_SPEED) {
      this.speed -= this.acceleration
    }
    let wheel_rotation_angle = 0
    if (this.controls.left) {
      wheel_rotation_angle -= 30
      // this.direction -= STEERING * this.speed / MAX_SPEED
    }
    if (this.controls.right) {
      wheel_rotation_angle += 30
      // this.direction += STEERING * this.speed / MAX_SPEED
    }
    if (!this.controls.reverse && !this.controls.forward) {
      this.speed *= 0.95
      if (this.speed > -0.05 && this.speed < 0.05) {
        this.speed = 0
      }
    }

    let real_rotation_angle = (wheel_rotation_angle / 2);

    let direction_angle = this.direction + real_rotation_angle
    let theta = direction_angle * Math.PI / 180

    let velocity_vector = [Math.cos(theta), Math.sin(theta)]
      .map(x => x * this.speed);


    let resistance = 0.2;

    // let resistance_angle = this.direction + Math.sign(wheel_rotation_angle)
    //   * (90 + Math.abs(wheel_rotation_angle));
    let resistance_angle = this.direction + 90 * Math.sign(wheel_rotation_angle)
    let resistance_vector
    if (wheel_rotation_angle != 0) {
      resistance_vector = [
        resistance * Math.cos(resistance_angle) * this.speed,
        resistance * Math.sin(resistance_angle) * this.speed
      ]
    } else {
      resistance_vector = [0, 0]
    }
    let resultant_direction_vector = [
      resistance_vector[0] + velocity_vector[0],
      resistance_vector[1] + velocity_vector[1]
    ];

    if (resultant_direction_vector[0] > 0 && resultant_direction_vector[1] != 0) {
      this.direction = Math.atan(resultant_direction_vector[0] / resultant_direction_vector[1])
      this.direction *= 180 / Math.PI
    }
    else if (resultant_direction_vector[0] < 0 && resultant_direction_vector[1] != 0) {
      this.direction = Math.atan(resultant_direction_vector[0] / resultant_direction_vector[1]) + Math.PI
      this.direction *= 180 / Math.PI
    }
    else if (resultant_direction_vector[1] > 0) {
      this.direction = Math.PI * 90 / Math.PI
    }
    else if (resultant_direction_vector[1] < 0) {
      this.direction = -Math.PI * 90 / Math.PI
    }

    console.log(this.direction);
    console.table({
      res_vec: resultant_direction_vector,
      vel_vec: velocity_vector,
      ress_vec: resistance_vector
    })

    this.x += resultant_direction_vector[0];
    this.y += resultant_direction_vector[1];
    // console.table(this);


    // this.direction += Math.sign(wheel_rotation_angle)
    //   * STEERING * this.speed;

    // this.direction += direction_angle * this.speed / MAX_SPEED
  }
  draw(ctx) {
    ctx.beginPath();

    canvas.height = window.innerHeight

    let center_y = this.y - this.height / 2
    let center_x = this.x - this.width / 2

    // let wheels_y = this.y - this.height / 4

    // let theta = (this.direction) * Math.PI / 180

    // let wheels_x_rot = - (wheels_y - center_y) * Math.sin(theta) + center_x
    // let wheels_y_rot = (wheels_y - center_y) * Math.cos(theta) + center_y


    // console.table({
    //   this_x: this.x,
    //   this_y: this.y,
    //   center_x: center_x,
    //   center_y: center_y,
    //   wheels_x_rot: wheels_x_rot,
    //   wheels_y_rot: wheels_y_rot,

    // })
    canvas.height = window.innerHeight
    ctx.translate(
      center_x,
      center_y
    )
    ctx.rotate((this.direction + 90) * Math.PI / 180);
    ctx.translate(
      -center_x,
      -center_y
    )
    ctx.fillRect(
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
