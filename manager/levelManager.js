class LevelManager {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.actualLevelIdx = 0;
    this.actualLevel = null;
  }

  loadLevel(levelNb) {
    soundMonkey.play();

    // vider a chaque niveaux
    this.gameManager.enemies = [];
    this.gameManager.obstacles = [];
    this.gameManager.bullets = [];
    this.gameManager.bloods = [];

    let lvl = null;
    switch (levelNb) {
      case 1:
        lvl = new Level1();
        break;
      case 2:
        lvl = new Level2();
        break;
      case 3:
        lvl = new Level3();
        break;

      default:
        lvl = new Level1();
        break;
    }
    lvl.setup(this.gameManager);

    this.actualLevelIdx = levelNb;
    this.actualLevel = lvl;
  }

  getActualLevel() {
    return this.actualLevel;
  }

  goNextLevel() {
    let next = this.actualLevelIdx + 1;
    if (next > 3) {
      this.gameManager.gameVictory();
    } else {
      this.loadLevel(next);
    }
  }
}