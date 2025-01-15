class Projectile {
  constructor(x, y, velX, velY, damage, maxBounces, color) {
    this.pos = createVector(x, y);
    this.vel = createVector(velX, velY);
    this.damage = damage;
    this.bounces = 0;
    this.maxBounces = maxBounces;
    this.color = color;
    this.radius = 10;
    this.active = true;
  }

  update(gameManager, params) {
    if (!this.active) return;
    this.pos.add(this.vel);

    if (this.pos.x < this.radius || this.pos.x > width - this.radius) { //si touche bord ecran horizontal
      this.vel.x *= -1; //rebond
      this.bounces++;
    }
    if (this.pos.y < this.radius || this.pos.y > height - this.radius) { //si touche bord ecran vertical
      this.vel.y *= -1;
      this.bounces++;
    }

    if (this.bounces > this.maxBounces) {
      this.active = false;
    }

    if (params && params.obstacles) {
      for (let obs of params.obstacles) {
        if (collideWalls(obs.x, obs.y, obs.w, obs.h, this.pos.x, this.pos.y, this.radius)) {
          // rebond si touche mur
          this.vel.x *= -1;
          this.vel.y *= -1;
          this.bounces++;
          break;
        }
      }
    }

    // ennemi sert bouclier
    let captured = gameManager.player.enemyCaptured;
    if (captured) {
      let distToCaptured = p5.Vector.dist(this.pos, captured.pos);
      if (distToCaptured < this.radius + captured.r) { // collision avec ennemi
        captured.health -= 50;
        if (captured.health <= 0) {
          captured.die(gameManager);
          gameManager.player.enemyCaptured = null;
        }
        this.active = false;
        return;
      }
    }

    if (gameManager && gameManager.player) {
      let d = p5.Vector.dist(this.pos, gameManager.player.pos);
      if (d < this.radius + gameManager.player.r) { // collision joueur
        gameManager.player.takeDamage(this.damage);
        this.active = false;
      }
    }
  }

  show() {
    if (!this.active) return;
    fill(this.color);
    circle(this.pos.x, this.pos.y, this.radius);
  }
}