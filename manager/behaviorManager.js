class BehaviorManager {
  constructor(entitie) {
    this.entitie = entitie;
    this.behaviors = []; // contient comportments ajoutés a entité (joueur/ ennemi)
  }

  add(behavior, weight) {
    behavior.weight = weight;
    this.behaviors.push(behavior);
  }

  activate(behavior) {
    behavior.active = true;
  }

  deactivate(behavior) {
    behavior.active = false;
  }

  getBehavior(name) {
    return this.behaviors.find(behavior => behavior.name === name);
  }

  getSteeringForce(world, params) {
    let totalForce = createVector(0, 0);

    for (let behavior of this.behaviors) {
      if (behavior.active) {
        let force = behavior.calculateForce(this.entitie, world, params);
        force.mult(behavior.weight);
        totalForce.add(force);
      }
    }
    return totalForce;
  }
}