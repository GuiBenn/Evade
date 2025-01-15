class AvoidBehavior {
  static debug = false;

  constructor() {
    this.name = "avoid";
    this.active = true;
    this.weight = 1.7;
    this.maxAheadDist = 50;
  }

  calculateForce(entitie, world, params) {
    // projette ahead devant l'entité proportionnellement à la vitesse
    let aheadDist = map(entitie.vel.mag(), 0, entitie.maxSpeed, 0, this.maxAheadDist);
    let ahead = p5.Vector.add(entitie.pos, entitie.vel.copy().setMag(aheadDist));
    let minDistance = Infinity;
    let threateningObs = null;
    let closestPoint = null;

    // pour chaque obstacle
    for (let obs of params.obstacles) {
      // point le plus proche du "ahead"
      let x = constrain(ahead.x, obs.x, obs.x + obs.w);
      let y = constrain(ahead.y, obs.y, obs.y + obs.h);
      let closestPt = createVector(x, y);

      let d = p5.Vector.dist(ahead, closestPt);
      // zone de sécurité relative à la taille de l’entite
      let safeDistance = entitie.r * 3;

      // si point le plus proche
      if (d < minDistance) {
        minDistance = d;
        threateningObs = obs;
        closestPoint = closestPt;
      }
    }

    // si entité très proche
    let safeDistance = entitie.r * 3;
    if (minDistance < safeDistance) {
      // force pour repousser
      let force = p5.Vector.sub(ahead, closestPoint);
      force.setMag(entitie.maxSpeed);
      force.sub(entitie.vel);
      force.limit(entitie.maxForce);

      if (AvoidBehavior.debug) {
        push();
        noFill();
        stroke("green");
        strokeWeight(5);
        rect(threateningObs.x, threateningObs.y, threateningObs.w, threateningObs.h);

        stroke("blue");
        strokeWeight(5);
        line(entitie.pos.x, entitie.pos.y, ahead.x, ahead.y);

        fill("red");
        circle(closestPoint.x, closestPoint.y, 10);
        pop();
      }
      return force;
    }
    return createVector(0, 0);
  }
}