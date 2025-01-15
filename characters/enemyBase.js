class EnemyBase {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 2;
    this.maxForce = 0.2;
    this.r = 15;

    this.health = 100;

    this.isGrab = false;
    this.grabBy = null;
    this.canMove = true;
    this.isPropulse = false;

    this.detectPlayer = false;
    this.shootDist = 150;
    this.timeBetweenShoot = 60;

    this.leader = null;   // leader du groupe
    this.inBoids = false;
    this.wasInBoids = false;

    this.img = imgEnemyBase;

    this.behaviorManager = new BehaviorManager(this);

    this.avoidBehavior = new AvoidBehavior();
    this.fleeBehavior = new FleeBehavior();
    this.pursueBehavior = new PursueBehavior();
    this.alignBehavior = new AlignBehavior();
    this.cohesionBehavior = new CohesionBehavior();
    this.separationBehavior = new SeparationBehavior();
    this.leaderFollowBehavior = new LeaderFollowBehavior();

    this.behaviorManager.add(this.pursueBehavior, 2.0);
    this.behaviorManager.add(this.alignBehavior, 0.8);
    this.behaviorManager.add(this.cohesionBehavior, 1.0);
    this.behaviorManager.add(this.separationBehavior, 1.5);
    this.behaviorManager.add(this.leaderFollowBehavior, 2.0);
    this.behaviorManager.add(this.fleeBehavior, 3.0);

    this.behaviorManager.add(this.avoidBehavior, 2.5);
    this.behaviorManager.activate(this.avoidBehavior);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update(world, params) {
    this.maxSpeed = world.settings.enemyBaseSpeed || this.maxSpeed;
    this.maxForce = world.settings.enemyBaseMaxForce || this.maxForce;

    let visionFactor = world.settings.enemyVision || 1.0;
    let angleVision = (PI / 3) * visionFactor;
    let distVision = 300 * visionFactor;

    //  si capturé, ennemie fait rien
    if (this.isGrab) return;
    if (this.canMove) {
      // CAS 1 LEADER : ennemie dans groupe et il y a un leader qu'il suit
      if (this.inBoids && this.leader) {

        // CAS 1.1 LEADER mort donc fuit
        let leaderExists = world.enemies.includes(this.leader);
        if (!leaderExists) {
          console.log("Leader mort : passage en mode flee pour l'ennemi", this)
          this.leader = null;
          this.inBoids = false;
          this.wasInBoids = true;
          this.detectPlayer = false;

          this.behaviorManager.deactivate(this.pursueBehavior);
          this.behaviorManager.deactivate(this.alignBehavior);
          this.behaviorManager.deactivate(this.cohesionBehavior);
          this.behaviorManager.deactivate(this.separationBehavior);
          this.behaviorManager.deactivate(this.leaderFollowBehavior);

          this.behaviorManager.activate(this.fleeBehavior);
        } else {
          // CAS 1.2 LEADER vivant
          let group = this.getBoids(world, this.leader, this);

          // Boids + Suivi leader
          let steeringAlign = this.alignBehavior.calculateForce(this, world, { boids: group });
          let steeringCohesion = this.cohesionBehavior.calculateForce(this, world, { boids: group });
          let steeringSeparation = this.separationBehavior.calculateForce(this, world, { boids: group });
          let steeringLeader = this.leaderFollowBehavior.calculateForce(this, world, {
            leader: this.leader,
            distance: 60
          });

          this.applyForce(steeringAlign);
          this.applyForce(steeringCohesion);
          this.applyForce(steeringSeparation);
          this.applyForce(steeringLeader);
        }
      } else {
        // CAS 2 : Sans leader
        let inVision = Visibility.isVisible(
          this.pos, this.vel,
          world.player.pos,
          angleVision, distVision
        );
        // CAS 2.1 : detecte joueur et le poursuit
        if (inVision) {
          if (this.wasInBoids) {
            this.detectPlayer = false;
            this.behaviorManager.deactivate(this.pursueBehavior);
            this.behaviorManager.activate(this.fleeBehavior);
          }
          else {
            // jamais eu de leader
            this.detectPlayer = true;
            this.behaviorManager.deactivate(this.fleeBehavior);
            this.behaviorManager.activate(this.pursueBehavior);
          }
        }
        // CAS 2.2 : detecte pas et est statique
      }
    }

    let flee = this.behaviorManager.getBehavior("flee");
    let pursue = this.behaviorManager.getBehavior("pursue");

    // calcul force finael
    let steeringForce = createVector(0, 0);
    if (flee && flee.active) {
      steeringForce = this.behaviorManager.getSteeringForce(world, {
        target: world.player.pos,
        obstacles: world.obstacles
      });
    } else if (pursue && pursue.active) {
      let d = p5.Vector.dist(this.pos, world.player.pos);
      // A distance de tir + poursuit joueur
      if (d < this.shootDist) {
        this.handleShooting(world, 0, "green");
      }
      steeringForce = this.behaviorManager.getSteeringForce(world, {
        target: { pos: world.player.pos, vel: world.player.vel },
        obstacles: world.obstacles
      });
    }
    this.applyForce(steeringForce);

    // maj vitesse et pos
    let oldPos = this.pos.copy();
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);

    if (this.timeBetweenShoot > 0) {
      this.timeBetweenShoot--;
    }

    // COLLISIONS :
    // Murs
    let currentLevel = world.lvlManager.getActualLevel();
    if (currentLevel && currentLevel.obstacles) {
      for (let obs of currentLevel.obstacles) {
        if (collideWalls(obs.x, obs.y, obs.w, obs.h,
          this.pos.x, this.pos.y, this.r)) {
          // meurt en etant propulser contre mur
          if (this.isPropulse) {
            this.die(world);
            return;
          } else {
            // sinon revient a son ancienne pos et effet rebond
            this.pos.set(oldPos.x, oldPos.y);
            this.vel.mult(-0.3);
            this.vel.rotate(random(-0.2, 0.2));
            break;
          }
        }
      }
    }

    // Entre ennemis
    for (let other of world.enemies) {
      if (other !== this) {
        let d = p5.Vector.dist(this.pos, other.pos);
        let radiusSum = this.r + other.r;
        if (d < radiusSum) {
          // les 2 meurent en etant propulser
          if (this.isPropulse) {
            this.die(world);
            other.die(world);
            return;
          } else {
            this.pos.set(oldPos.x, oldPos.y);
            this.vel.mult(-0.3);
            this.vel.rotate(random(-0.2, 0.2));
          }
          break;
        }
      }
    }
    // peuvent sortir ecran
  }

  // Methodes
  getBoids(world, leader, enemyBase) {
    let boids = [];
    for (let e of world.enemies) {
      if (e !== enemyBase && e.leader === leader && e.inBoids) {
        boids.push(e);
      }
    }
    return boids;
  }

  // pour gérer tirs
  handleShooting(world, rebonds, color) {
    if (this.timeBetweenShoot <= 0) {
      soundShoot.play();
      let direction = p5.Vector.sub(world.player.pos, this.pos).normalize(); // direction tir
      let speed = 5;

      let damage = world.settings.enemyDamage || 10;

      let proj = new Projectile(
        this.pos.x, this.pos.y, // position départ
        direction.x * speed, direction.y * speed, // vitesse calculee avec la direction
        damage, rebonds, color
      );

      world.bullets.push(proj);
      this.timeBetweenShoot = 60;
    }
  }

  die(gameManager) {
    soundSplash.play();
    // pour tache de sang
    gameManager.bloods.push({ x: this.pos.x, y: this.pos.y });
    let idx = gameManager.enemies.indexOf(this);
    if (idx !== -1) {
      gameManager.enemies.splice(idx, 1);
    }
  }

  show() {
    push();
    imageMode(CENTER);
    image(this.img, this.pos.x, this.pos.y, 2 * this.r, 2 * this.r);
    pop();
  }
}
