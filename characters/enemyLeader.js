class EnemyLeader extends EnemyBase {
  constructor(x, y) {
    super(x, y);
    this.vel = p5.Vector.fromAngle(random(TWO_PI)).setMag(0.5);
    this.maxSpeed = 3;
    this.maxForce = 0.2;
    this.r = 20;

    this.health = 150;

    this.detectPlayer = false;
    this.shootDist = 200;
    this.timeBetweenShoot = 60;

    this.img = imgLeader;

    this.wanderBehavior = new WanderBehavior();
    this.behaviorManager.add(this.wanderBehavior, 1.5);
    this.behaviorManager.activate(this.wanderBehavior);
  }

  update(world, params) {
    this.maxSpeed = world.settings.enemyLeaderSpeed || this.maxSpeed;
    this.maxForce = world.settings.enemyLeaderMaxForce || this.maxForce;

    let factorVision = world.settings.enemyVision || 1.0;
    let angleVision = (PI / 3) * factorVision;
    let distVision = 400 * factorVision;

    // si croise enemmi de base alors il le prend dans son groupe
    for (let e of world.enemies) {
      // Si l'ennemi n'est pas dans un boids
      if (e !== this && !e.inBoids && e instanceof EnemyBase) {
        let d = p5.Vector.dist(this.pos, e.pos);
        // et n'a pas detecter joueur
        if (d < 80 && !e.detectPlayer) {
          e.leader = this;
          e.inBoids = true;
          e.behaviorManager.activate(this.leaderFollowBehavior);
        }
      }
    }

    // calcul forces finale
    let steeringForce = this.behaviorManager.getSteeringForce(world, {
      target: { pos: world.player.pos, vel: world.player.vel },
      obstacles: world.obstacles
    });
    this.applyForce(steeringForce);

    if (this.canMove) {
      let d = p5.Vector.dist(this.pos, world.player.pos);
      let inVision = Visibility.isVisible(
        this.pos, this.vel,
        world.player.pos,
        angleVision, distVision
      );
      if (inVision) { // si joueur entre champs de visions alors pursue
        this.detectPlayer = true;
        this.behaviorManager.deactivate(this.wanderBehavior);
        this.behaviorManager.activate(this.pursueBehavior);

        if (d < this.shootDist) {
          this.handleShooting(world, 2, "red");
        }
      } else { // sinon comportement wander
        this.behaviorManager.activate(this.wanderBehavior);
        this.behaviorManager.deactivate(this.pursueBehavior);
      }
    }

    // gère déplacement et collisions
    super.update(world, params);

    // collision en plus, les bords de l'écran
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x *= -1;
      this.pos.x = constrain(this.pos.x, 0, width);
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y *= -1;
      this.pos.y = constrain(this.pos.y, 0, height);
    }
  }
}
