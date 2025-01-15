class BaseLevel {
  constructor() {
    this.enemies = [];
    this.obstacles = [];
    this.completed = false;
  }

  setup(gameManager) {
    // positionne joueur, obstacles, ennemis fct niveau
    gameManager.player.pos.set(this.playerStart.x, this.playerStart.y);

    for (let obs of this.obstacles) {
      gameManager.obstacles.push({
        x: obs.x,
        y: obs.y,
        w: obs.w,
        h: obs.h,
        color: obs.color
      });
    }

    for (let e of this.enemies) {
      gameManager.enemies.push(e);
    }

    this.completed = false;
  }

  update(gameManager) {
    let p = gameManager.player;
    if (collideWalls(
      this.exitDoor.x, this.exitDoor.y,
      this.exitDoor.w, this.exitDoor.h,
      p.pos.x, p.pos.y, p.r)) {
      this.completed = true;
      gameManager.lvlManager.goNextLevel();
    }
  }

  show() {
    for (let obs of this.obstacles) {
      fill(obs.color);
      rect(obs.x, obs.y, obs.w, obs.h);
    }
    fill(this.exitDoor.color);
    rect(this.exitDoor.x, this.exitDoor.y, this.exitDoor.w, this.exitDoor.h);
  }
}