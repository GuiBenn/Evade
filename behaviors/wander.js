class WanderBehavior {
  constructor() {
    this.name = "wander";
    this.active = true;
    this.weight = 1.0;

    this.distanceCercle = 150;
    this.wanderRadius = 50;
    this.wanderTheta = PI / 2;
    this.displaceRange = 0.3;
  }

  calculateForce(entitie, world, params) {
    // point devant le véhicule, centre du cercle
    let wanderPoint = entitie.vel.copy();
    wanderPoint.setMag(this.distanceCercle);
    wanderPoint.add(entitie.pos);

    // On va s'occuper de calculer le point vert SUR LE CERCLE
    let theta = this.wanderTheta + entitie.vel.heading();
    let x = this.wanderRadius * cos(theta);
    let y = this.wanderRadius * sin(theta);

    // maintenant wanderPoint c'est un point sur le cercle
    wanderPoint.add(x, y);

    // On a donc la vitesse désirée que l'on cherche qui est le vecteur
    // allant du vaisseau au cercle vert. On le calcule :
    let force = wanderPoint.sub(entitie.pos);

    force.setMag(entitie.maxForce);
    entitie.acc.add(force);

    // On déplace le point vert sur le cerlcle (en radians)
    this.wanderTheta += random(-this.displaceRange, this.displaceRange);
    return force;
  }
}