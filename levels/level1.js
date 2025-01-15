class Level1 extends BaseLevel {
  constructor() {
    super();
    this.name = "Level1"
    
    this.playerStart = createVector(200, 100);
    this.exitDoor = { x: 1850, y: 270, w: 20, h: 70, color: "yellow" };

    this.obstacles.push(
      { x: 400, y: 0, w: 300, h: 500, color: "black" },
      { x: 400, y: 700, w: 300, h: 500, color: "black" },
      { x: 1720, y: 0, w: 200, h: 200, color: "black" },
      { x: 1720, y: 400, w: 200, h: 500, color: "black" },
      { x: 100, y: height, w: 150, h: 400, color: "black" },
      { x: 1250, y: 100, w: 300, h: 800, color: "black" },
      { x: 800, y: 200, w: 300, h: 200, color: "black" },
    );

    let e1 = new EnemyBase(900, 800);
    let e2 = new EnemyBase(950, 800);
    let e3 = new EnemyBase(1000, 800);
    let e4 = new EnemyBase(500, 600);
    let e5 = new EnemyBase(1700, 300);

    let l1 = new EnemyLeader(950, 750);
    let l2 = new EnemyLeader(950, 150);

    this.enemies.push(e1, e2, e3, e4, e5, l1, l2);
  }
}