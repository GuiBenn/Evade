class MenuManager {
  constructor() {
    this.menuVehicles = [];
    this.menuTarget = [];

    this.behaviorManager = new BehaviorManager(this);

    this.arriveBehavior = new ArriveBehavior();
    this.fleeBehavior = new FleeBehavior();
    this.avoidBehavior = new AvoidBehavior();
    this.fleeBehavior.safeRadius = 200;

    this.behaviorManager.activate(this.arriveBehavior);
    this.behaviorManager.activate(this.fleeBehavior);
    this.behaviorManager.activate(this.avoidBehavior);

    this.monkey = {
      pos: createVector(0, 0),
      speed: 6,
      active: false
    };
  }

  initMenuVehicles(fontEvasion) {
    this.menuVehicles = [];
    this.menuTarget = [];

    //positions targets
    let targets = fontEvasion.textToPoints(
      "Evasion",
      width / 4 + 100, height / 2 - 110, 200,
      { sampleFactor: 0.2 }
    );

    //définir vehicule par target
    for (let target of targets) {
      let x = random(width);
      let y = random(height);

      // position cible vehicule
      let targetPos = createVector(target.x, target.y);
      this.menuTarget.push(targetPos);

      let vehicle = {
        pos: createVector(x, y),
        vel: createVector(0, 0),
        acc: createVector(0, 0),
        maxSpeed: 4,
        maxForce: 0.2,
        r: 10
      };
      this.menuVehicles.push(vehicle);
    }
  }

  update() {
    if (!this.monkey.active){
      this.monkey.pos.set(-100, height / 2 - 150);
      this.monkey.active = true;
    }

    if (this.monkey.active) {
      this.monkey.pos.x += this.monkey.speed;
      // desactive après passage
      if (this.monkey.pos.x > width + 100) {
        this.monkey.active = false;
      }
    }

    for (let i = 0; i < this.menuVehicles.length; i++) {
      let vehicle = this.menuVehicles[i];
      let target = this.menuTarget[i];
      let monkeyObs = { x: this.monkey.pos.x, y: this.monkey.pos.y, w: 80, h: 80 };

      let fleeForce = createVector(0, 0);
      let avoidForce = createVector(0, 0);

      // arrive vehicule sur target
      // vehicule flee et avoid le singe
      let arriveForce = this.arriveBehavior.calculateForce(vehicle, { target: target });
      fleeForce = this.fleeBehavior.calculateForce(vehicle, null, { target: this.monkey.pos });
      avoidForce = this.avoidBehavior.calculateForce(vehicle, null, { obstacles: [monkeyObs] });

      // accentue effet
      arriveForce.mult(0.5);
      fleeForce.mult(2);
      avoidForce.mult(2);

      let finalForce = p5.Vector.add(arriveForce, fleeForce);
      finalForce.add(avoidForce);

      vehicle.acc.add(finalForce);
      vehicle.vel.add(vehicle.acc);
      vehicle.vel.limit(vehicle.maxSpeed);
      vehicle.pos.add(vehicle.vel);
      vehicle.acc.set(0, 0);
    }
  }

  show() {
    fill(255);
    for (let vehicule of this.menuVehicles) {
      circle(vehicule.pos.x, vehicule.pos.y, vehicule.r);
    }

    if (this.monkey.active) {
      push();
      imageMode(CENTER);
      image(imgPlayerRight, this.monkey.pos.x, this.monkey.pos.y, 80, 80);
      pop();
    }
  }
}
