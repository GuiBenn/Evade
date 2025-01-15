class AlignBehavior {
  constructor() {
    this.name = "align";
    this.active = true;
    this.weight = 1.0;
    this.perceptionRadius = 25;
  }

  calculateForce(entitie, world, params) {
    let boids = [];
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let d = p5.Vector.dist(entitie.pos, other.pos);
      if (other !== entitie && d < this.perceptionRadius) {
        steering.add(other.vel);
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
    // pas de voisins, pas de force
    return createVector();
  }
}