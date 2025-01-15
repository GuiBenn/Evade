class LeaderFollowBehavior {
  static debug = false;

  constructor() {
    this.name = "leaderFollow";
    this.active = true;
    this.weight = 1.0;
    this.followDistance = 50;
  }

  calculateForce(agent, world, params) {
    if (!params || !params.leader) {
      return createVector(0, 0);
    }
    let leader = params.leader;
    let d = this.followDistance;

    let desired = leader.vel.copy();
    // pour garder direction
    desired.normalize();
    // position derrière leader
    desired.mult(-d);
    let targetPos = p5.Vector.add(leader.pos, desired);

    let force = p5.Vector.sub(targetPos, agent.pos);
    force.setMag(agent.maxSpeed);
    force.sub(agent.vel);
    force.limit(agent.maxForce);

    if (LeaderFollowBehavior.debug) {
      push();
      stroke("grey");
      line(agent.pos.x, agent.pos.y, targetPos.x, targetPos.y);
      circle(targetPos.x, targetPos.y, 10);
      pop();
    }
    // pour eviter file indienne : bruit
    force.rotate(random(-0.1, 0.1));

    return force;
  }
}