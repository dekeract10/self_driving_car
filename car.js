const ACCELERATION = 0.2
const STEERING = 0.2
const MAX_SPEED = 5
const MIN_SPEED = -5


class Vector2D {
  // vector is constructed via identity vector and magnitude
  // If only x and y are passed, it doesn't have to be an identity vector
  constructor(x, y, magnitude) {
    if (magnitude == null || magnitude == undefined) {
      this.magnitude = Math.sqrt(x * x + y * y);
      this.ix = x / this.magnitude;
      this.iy = y / this.magnitude;
    } else {
      this.ix = x;
      this.iy = y;
      this.magnitude = magnitude;
    }
  }

  // x coordinate of this vector
  get x() {
    return this.ix * this.magnitude;
  }

  // y coordinate of this vector
  get y() {
    return this.iy * this.magnitude;
  }

  // Scales the vector by amount
  scale(amount) {
    return new Vector2D(this.ix, this.iy, amount * this.magnitude);
  }

  // rotate this vector by the given `angle` in radians
  rotate(angle) {
    let newX = this.ix * Math.cos(angle) - this.iy * Math.sin(angle);
    let newY = this.ix * Math.sin(angle) + this.iy * Math.cos(angle);
    return new Vector2D(newX, newY, this.magnitude)
  }

  // Rotates vector around a position vector by `angle` in radians
  rotateAround(angle, positionVector) {
    let differenceVector = this.substract(positionVector)
    differenceVector = differenceVector.rotate(angle);
    return differenceVector.add(positionVector);
  }

  // Adds the vectors and returns the resulting vector
  add(vector) {
    let newX = this.x + vector.x;
    let newY = this.y + vector.y;

    return new Vector2D(newX, newY);
  }

  // substracts the vector and returns the resulting vector
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

    this.direction_vector = new Vector2D(0, 1, 0);
    console.log(this.direction_vector);

    this.controls = new Controls();
  }

  update() {
    if (this.controls.forward && this.direction_vector.magnitude <= MAX_SPEED) {
      this.direction_vector.magnitude += this.acceleration;
    }
    if (this.controls.reverse && this.direction_vector.magnitude >= MIN_SPEED) {
      this.direction_vector.magnitude -= this.acceleration;
    }
    let wheel_rotation_angle = 0
    if (this.controls.left) {
      wheel_rotation_angle -= Math.PI / 6
      // this.direction -= STEERING * this.speed / MAX_SPEED
    }
    if (this.controls.right) {
      wheel_rotation_angle += Math.PI / 6
      // this.direction += STEERING * this.speed / MAX_SPEED
    }
    if (!this.controls.reverse && !this.controls.forward) {
      this.direction_vector = this.direction_vector.scale(0.95);
    }

    let resistance_vector;
    if (wheel_rotation_angle) {
      if (this.direction_vector.magnitude > 0) {
        resistance_vector = this.direction_vector.rotate(wheel_rotation_angle + Math.PI * Math.sign(wheel_rotation_angle) / 2);
        resistance_vector = resistance_vector.scale(0.07);
        this.direction_vector = this.direction_vector.add(resistance_vector);
      } else if (this.direction_vector.magnitude < 0) {
        resistance_vector = this.direction_vector.rotate(-wheel_rotation_angle);
        resistance_vector = resistance_vector.scale(0.07);
        this.direction_vector = this.direction_vector.add(resistance_vector);
        // console.table({
        //   res_vec: resistance_vector,
        //   dir_vec: this.direction_vector
        // })
      }
    }
    console.log(this.direction_vector.x);
    this.x += this.direction_vector.x;
    this.y += this.direction_vector.y;

    // console.log(this.direction_vector);


    // let real_rotation_angle = (wheel_rotation_angle / 2);

    // let direction_angle = this.direction + real_rotation_angle
    // let theta = direction_angle * Math.PI / 180

    // let velocity_vector = [Math.cos(theta), Math.sin(theta)]
    //   .map(x => x * this.speed);


    // let resistance = 0.2;

    // // let resistance_angle = this.direction + Math.sign(wheel_rotation_angle)
    // //   * (90 + Math.abs(wheel_rotation_angle));
    // let resistance_angle = this.direction + 90 * Math.sign(wheel_rotation_angle)
    // let resistance_vector
    // if (wheel_rotation_angle != 0) {
    //   resistance_vector = [
    //     resistance * Math.cos(resistance_angle) * this.speed,
    //     resistance * Math.sin(resistance_angle) * this.speed
    //   ]
    // } else {
    //   resistance_vector = [0, 0]
    // }
    // let resultant_direction_vector = [
    //   resistance_vector[0] + velocity_vector[0],
    //   resistance_vector[1] + velocity_vector[1]
    // ];

    // if (resultant_direction_vector[0] > 0 && resultant_direction_vector[1] != 0) {
    //   this.direction = Math.atan(resultant_direction_vector[0] / resultant_direction_vector[1])
    //   this.direction *= 180 / Math.PI
    // }
    // else if (resultant_direction_vector[0] < 0 && resultant_direction_vector[1] != 0) {
    //   this.direction = Math.atan(resultant_direction_vector[0] / resultant_direction_vector[1]) + Math.PI
    //   this.direction *= 180 / Math.PI
    // }
    // else if (resultant_direction_vector[1] > 0) {
    //   this.direction = Math.PI * 90 / Math.PI
    // }
    // else if (resultant_direction_vector[1] < 0) {
    //   this.direction = -Math.PI * 90 / Math.PI
    // }

    // console.log(this.direction);
    // console.table({
    //   res_vec: resultant_direction_vector,
    //   vel_vec: velocity_vector,
    //   ress_vec: resistance_vector
    // })

    // this.x += resultant_direction_vector[0];
    // this.y += resultant_direction_vector[1];
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

    canvas.height = window.innerHeight
    if (this.direction_vector.y != 0) {
      ctx.translate(
        center_x,
        center_y
      )
      ctx.rotate(Math.atan(this.direction_vector.x / this.direction_vector.y));
      ctx.translate(
        -center_x,
        -center_y
      )
    }
    ctx.fillRect(
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
