class Player {
  constructor(x, y, gameManager) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 4;
    this.maxForce = 0.2;
    this.r = 20;

    this.health = 100;

    this.captureDist = 40;
    this.enemyCaptured = null;

    //modifié dans keyPressed de sketch
    this.facingAngle = 0;  //rgarde à droite par défaut

    this.gameManager = gameManager;
    this.behaviorManager = new BehaviorManager(this);
  }

  // applyForce est une méthode qui permet d'appliquer une force au véhicule
  // en fait on additionne le vecteurr force au vecteur accélération
  applyForce(force) {
    this.acc.add(force);
  }

  update(world, params) {
    let oldPos = this.pos.copy();

    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);

    this.maxSpeed = world.settings.playerSpeed || this.maxSpeed;
    this.maxForce = world.settings.playerMaxForce || this.maxForce;

    let steering = this.behaviorManager.getSteeringForce(world, params);
    this.applyForce(steering);

    // DEPASSE PAS BORDS MURS
    let currentLevel = world.lvlManager.getActualLevel();
    if (currentLevel) {
      for (let obs of currentLevel.obstacles) {
        if (collideWalls(obs.x, obs.y, obs.w, obs.h, this.pos.x, this.pos.y, this.r)) {
          this.pos.set(oldPos.x, oldPos.y);
        }
      }
    }

    if (this.enemyCaptured) {
      // mettre ennemi devant soi (offset) dans direction ou singe regarde
      let offset = p5.Vector.fromAngle(this.facingAngle).setMag(20);
      this.enemyCaptured.pos.x = this.pos.x + offset.x;
      this.enemyCaptured.pos.y = this.pos.y + offset.y;
    }
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.gameManager.state = "gameOver";
  }

  handleCapture(gameManager) {
    if (this.enemyCaptured) {
      return; //si on en a déjà un
    }
    for (let e of gameManager.enemies) {
      if (!e.isGrab && e.canMove) {
        let d = p5.Vector.dist(this.pos, e.pos);
        if (d < this.captureDist) {
          let success = CaptureBehavior.tryToGrab(this, e);
          if (success) {
            this.enemyCaptured = e;
          }
        }
      }
    }
  }

  handlePropulsion() {
    if (this.enemyCaptured) {
      // mettre joueur en fasse a un offset
      let launchDir = this.vel.copy();
      launchDir.normalize();

      let forwardOffset = p5.Vector.mult(launchDir, 1500);
      let newPos = p5.Vector.add(this.pos, forwardOffset);

      CaptureBehavior.launchEnemy(this, this.enemyCaptured, newPos);
      this.enemyCaptured = null;
    }
  }

  show() {
    push();
    let isFacingRight = (this.facingAngle > -HALF_PI && this.facingAngle < HALF_PI);
    if (isFacingRight) {
      imageMode(CENTER);
      image(imgPlayerRight, this.pos.x, this.pos.y, 2 * this.r, 2 * this.r);
    } else {
      imageMode(CENTER);
      image(imgPlayerLeft, this.pos.x, this.pos.y, 2 * this.r, 2 * this.r);
    }
    pop();

    // barre de vie
    let barWidth = 300;
    let barHeight = 15;
    let x = width / 2 - barWidth / 2;
    let y = height - 30;

    //fond barre de vie
    fill(100);
    rect(x, y, barWidth, barHeight);

    //nb hp dessiné sur barre
    let proportion = this.health / 100;
    if (proportion < 0) proportion = 0;
    fill(255, 0, 0);
    rect(x, y, barWidth * proportion, barHeight);
  }
}