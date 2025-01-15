class Visibility {
  static debug = false;

  static isVisible(entitiePos, entityVel, targetPos, visionAngle, maxDist) {
    let d = p5.Vector.dist(entitiePos, targetPos);
    if (d > maxDist) {
      return false;
    }

    let forward = entityVel.copy().normalize();
    let toTarget = p5.Vector.sub(targetPos, entitiePos).normalize();

    let angle = p5.Vector.angleBetween(forward, toTarget);
    if (angle < visionAngle / 2) {
      return true;
    } else {
      return false;
    }
  }
}