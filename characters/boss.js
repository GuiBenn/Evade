class Boss extends EnemyBase {
  constructor(x, y) {
    super(x, y);
    this.maxSpeed = 4;
    this.maxForce = 0.3;
    this.r = 40;

    this.detectPlayer = false;

    this.img = imgBoss;

    this.behaviorManager.activate(this.avoidBehavior);
    this.avoidBehavior.maxAheadDist = 15;
  }

  update(world, params) {
    this.maxSpeed = world.settings.bossSpeed || this.maxSpeed;
    this.maxForce = world.settings.bossMaxForce || this.maxForce;

    // angle vision, distance vision
    let factorVision = world.settings.enemyVision || 1.0;
    let angleVision = (PI / 3) * factorVision;
    let distVision = 600 * factorVision;

    let inVision = Visibility.isVisible(
      this.pos, this.vel,
      world.player.pos,
      angleVision, distVision
    );

    if (!this.detectPlayer) {
      if (inVision) {
        this.detectPlayer = true;
        this.behaviorManager.activate(this.pursueBehavior);
      } else {
        this.vel.set(0, 0);
        this.acc.set(0, 0);
      }
    } else {
      this.behaviorManager.activate(this.pursueBehavior);
    }

    let d = p5.Vector.dist(this.pos, world.player.pos);
    if (d < this.r + world.player.r) {
      world.player.die();
    }

    super.update(world, params);
  }

  handleShooting(world, rebonds, color) {
    // ne tire pas
    return
  }
}
