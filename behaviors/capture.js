class CaptureBehavior {
  constructor() {
    this.name = "capture";
    this.active = true;
    this.weight = 1.0;
  }

  static tryToGrab(player, enemy) {
    // seul boss pas capturable
    if (enemy instanceof Boss) {
      return false;
    }
    let d = p5.Vector.dist(player.pos, enemy.pos);
    if (!enemy.isGrab && enemy.canMove && d < player.captureDist) {
      enemy.isGrab = true;
      enemy.canMove = false;
      enemy.vel.set(0, 0);
      enemy.grabBy = player;
      return true;
    }
    return false;
  }

  static launchEnemy(player, enemy, launchDir) {
    if (!enemy.isGrab) return;
    enemy.isGrab = false;
    enemy.grabBy = null;
    enemy.canMove = false;

    enemy.vel = launchDir.copy();
    enemy.vel.setMag(enemy.launchSpeed || 500);

    enemy.isPropulse = true;

    setTimeout(() => {
      enemy.canMove = true;
      enemy.isPropulse = false;
    }, 3000);
  }
}