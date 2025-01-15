class Level2 extends BaseLevel {
  constructor() {
    super();
    this.name = "Level2";
    
    this.playerStart = createVector(50, 500);
    this.exitDoor = { x: 1135, y: 520, w: 70, h: 20, color: "yellow" };

    this.obstacles.push(
      { x: 0, y: 250, w: 250, h: 100, color: "black" },
      { x: 200, y: 90, w: 100, h: 260, color: "black" },
      { x: 450, y: 0, w: 150, h: 700, color: "black" },
      { x: 850, y: 100, w: 800, h: 100, color: "black" },
      { x: 750, y: 750, w: 600, h: 150, color: "black" },
      { x: 750, y: 300, w: 750, h: 100, color: "black" },
      { x: 750, y: 400, w: 50, h: 400, color: "black" },
      { x: 750, y: 460, w: 100, h: 300, color: "black" },
      { x: 1250, y: 460, w: 100, h: 300, color: "black" },
      { x: 950, y: 460, w: 300, h: 50, color: "black" },
      { x: 950, y: 460, w: 150, h: 200, color: "black" },
      { x: 1500, y: 300, w: 200, h: 470, color: "black" }
    );

    let e1 = new EnemyBase(50, 200);
    let e2 = new EnemyBase(150, 200);
    let e3 = new EnemyBase(730, 220);
    let e4 = new EnemyBase(780, 220);
    let e5 = new EnemyBase(820, 430);
    let e6 = new EnemyBase(1650, 850);
    let e7 = new EnemyBase(1650, 800);

    let l1 = new EnemyLeader(100, 150);
    let l2 = new EnemyLeader(750, 250);
    let l3 = new EnemyLeader(1150, 600);

    this.enemies.push(e1, e2, e3, e4, e5, e6, e7, l1, l2, l3);
  }
}