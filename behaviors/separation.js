class SeparationBehavior {
  constructor() {
    this.name = "separation";
    this.active = true;
    this.weight = 1.0;
    this.perceptionRadius = 40;
  }

  calculateForce(entitie, world, params) {
    let boids = [];
    let steering = createVector();
    let total = 0;

    for (let other of boids) {
      let d = p5.Vector.dist(entitie.pos, other.pos);
      if (other !== entitie && d > 0 && d < this.perceptionRadius) {
        let diff = p5.Vector.sub(entitie.pos, other.pos);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(entitie.maxSpeed);
      steering.sub(entitie.vel);
      steering.limit(entitie.maxForce);
      return steering;
    }
    return createVector();
  }
}
