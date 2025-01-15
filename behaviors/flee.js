class FleeBehavior {
  static debug = false;

  constructor() {
    this.name = "flee";
    this.active = true;
    this.weight = 1.0;
    this.safeRadius = 200;
  }

  calculateForce(entitie, world, params) {
    let targetPos = params.target.pos || params.target;

    let desired = p5.Vector.sub(entitie.pos, targetPos);
    let distance = desired.mag();

    if (distance > this.safeRadius) {
      return createVector(0, 0);
    }

    desired.normalize();
    desired.mult(entitie.maxSpeed);

    let force = p5.Vector.sub(desired, entitie.vel);
    force.limit(entitie.maxForce);

    if (FleeBehavior.debug) {
      push();
      stroke("red");
      line(entitie.pos.x, entitie.pos.y, targetPos.x, targetPos.y);
      stroke("green");
      line(entitie.pos.x, entitie.pos.y, entitie.pos.x + force.x, entitie.pos.y + force.y);
      noFill();
      stroke("blue");
      circle(entitie.pos.x, entitie.pos.y, this.safeRadius);
      pop();
    }
    return force;
  }
}
