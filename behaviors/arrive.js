class ArriveBehavior {
  static debug = false;

  constructor() {
    this.name = "arrive";
    this.active = true;
    this.weight = 1.0;
    this.slowRadius = 50;
  }

  calculateForce(entitie, params = {}) {
    let target = params.target;
    // vecteur qui point entitie à target
    let force = p5.Vector.sub(target, entitie.pos);
    // calcul longueur
    let distance = force.mag();

    // si vehicule proche cible, ralentit
    if (distance < this.slowRadius) {
      let desiredSpeed = map(distance, 0, this.slowRadius, 0, entitie.maxSpeed);
      // ajuste longueur vecteur
      force.setMag(desiredSpeed);
    } else {
      force.setMag(entitie.maxSpeed);
    }

    // soustrait vitesse à desired (force) et limite cette force à la force max
    force.sub(entitie.vel);
    force.limit(entitie.maxForce);

    if (ArriveBehavior.debug) {
      push();
      noFill();
      stroke("white");
      circle(target.x, target.y, this.slowRadius);
      stroke("red");
      line(entitie.pos.x, entitie.pos.y, target.x, target.y);
      pop();
    }

    return force;
  }
}