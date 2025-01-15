class PursueBehavior {
  static debug = false;

  constructor() {
    this.name = "pursue";
    this.active = true;
    this.weight = 1.0;
  }

  calculateForce(entitie, world, params) {
    const target = params.target;

    if (!target || !target.vel) {
      return createVector(0, 0);
    }
    // 1 - calcul de la position future de la cible
    // on fait une copie de la vitesse de la target
    // 2 - On calcule un vecteur colinéaire au vecteur vitesse de la cible,
    let prediction = target.vel.copy();
    // et on le multiplie par 10 (10 frames)
    // 3 - prediction dans 10 frames = 10 fois la longueur du vecteur
    prediction.mult(10);
    // 4 - on positionne de la target au bout de ce vecteur
    prediction.add(target.pos);

    let desired = p5.Vector.sub(prediction, entitie.pos);
    desired.setMag(entitie.maxSpeed);
    let force = p5.Vector.sub(desired, entitie.vel);
    force.limit(entitie.maxForce);

    if (PursueBehavior.debug) {
      push();
      noStroke();
      fill("green");
      circle(prediction.x, prediction.y, 10);

      stroke("red");
      line(entitie.pos.x, entitie.pos.y, entitie.pos.x + force.x, entitie.pos.y + force.y);
      pop();
    }
    return force;
  }
}
