class GameManager {
  constructor() {
    this.player = new Player(0, 0, this); // pour accéder ennemis, balles, obstacles, etc.
    this.enemies = [];
    this.obstacles = [];
    this.bullets = [];
    this.bloods = [];

    this.lvlManager = new LevelManager(this); // permet accéder au levelManager
    this.menuManager = new MenuManager();

    this.state = "menu";
    this.gameOverSound = false;

    this.settings = {
      enemyBaseSpeed: 2,
      enemyLeaderSpeed: 3,
      bossSpeed: 4,
      playerSpeed: 4,
    };
  }

  update() {
    if (this.state === "game") {
      this.player.update(this);

      for (let enemy of this.enemies) {
        enemy.update(this, { obstacles: this.obstacles }); // pour gérer collision avec obstacle en jeu
      }

      // suppression balles tirées
      for (let i = this.bullets.length - 1; i >= 0; i--) {
        let bullet = this.bullets[i];
        bullet.update(this, { obstacles: this.obstacles }); // pour gestion obstacles
        if (!bullet.active) {
          this.bullets.splice(i, 1);
        }
      }

      let actualLevel = this.lvlManager.getActualLevel();
      if (actualLevel) {
        actualLevel.update(this);
      }
    }
  }

  show() {
    switch (this.state) {
      case "menu":
        this.showMenu();
        break;
      case "victory":
        this.showVictory();
        break;
      case "gameOver":
        this.showGameOver();
        break;
      case "settings":
        this.showSettings();
        break;
      case "game":
        this.showGame();
        break;
      default:
        break;
    }
  }

  showMenu() {
    background(0);
    if (soundMenu && !soundMenu.isPlaying()) {
      soundMenu.loop();
    }

    if (this.menuManager.menuVehicles.length === 0) {
      this.menuManager.initMenuVehicles(fontEvasion);
    }
    this.menuManager.update();
    this.menuManager.show();

    //affichage
    let btnW = 200;
    let btnH = 50;
    let btnX = width / 2 - btnW / 2;
    let btnY = height / 2 - btnH / 2;

    fill(255);
    rect(btnX, btnY, btnW, btnH);
    fill(0);
    textSize(24);
    text("Lancer une partie", width / 2 - 95, btnY + 32);

    let btn2Y = btnY + 80;
    fill(255);
    rect(btnX, btn2Y, btnW, btnH);
    fill(0);
    text("Paramètres", width / 2 - 60, btn2Y + 32);
  }

  showVictory() {
    background(0);
    if (soundVictory && !soundVictory.isPlaying()) {
      soundVictory.play();
    }

    // affichage
    fill(255, 255, 0);
    textAlign(CENTER);
    textSize(50);
    text("VICTOIRE !", width / 2, height / 2);

    fill(255);
    textSize(20);
    text("Cliquez sur R pour retourner au menu", width / 2, height / 2 + 80);
  }

  showGameOver() {
    background(0);
    // arrete musique jeux et enlève sang
    if (soundGame && soundGame.isPlaying()) {
      soundGame.stop();
    }
    this.bloods = [];

    if (soundGameOver && !soundGameOver.isPlaying()) {
      soundGameOver.play();
    }

    // affichage
    fill(255);
    textAlign(CENTER);
    textSize(50);
    text("GAME OVER", width / 2, height / 2);

    textSize(20);
    text("Cliquez sur R pour retourner au menu", width / 2, height / 2 + 60);
    return;
  }

  showSettings() {
    background(0);
    if (soundMenu && !soundMenu.isPlaying()) {
      soundMenu.loop();
    }
    //affichage + sliders
    fill(255);
    textAlign(LEFT);
    textSize(24);
    text("Paramètres", width/2, 50);

    sliderEnemyBase.show();
    text("Vitesse de l'ennemie de base", 50, 140);

    sliderEnemyLeader.show();
    text("Vitesse des leaders", 50, 240);

    sliderBoss.show();
    text("Vitesse du boss", 50, 340);

    sliderPlayer.show();
    text("Vitesse du joueur", 50, 440);

    sliderEnemyBaseForce.show();
    text("Force max de l'ennemie de base", 600, 140);

    sliderEnemyLeaderForce.show();
    text("Force max des leaders", 600, 240);

    sliderBossForce.show();
    text("Force max boss", 600, 340);

    sliderPlayerForce.show();
    text("Force max joueur", 600, 440);

    sliderEnemyVision.show();
    text("Taille du champ de vision des ennemis", 50, 540);

    sliderEnemyDamage.show();
    text("Dégâts infligés par les ennemis", 50, 640);

    this.settings.enemyBaseSpeed = sliderEnemyBase.value();
    this.settings.enemyLeaderSpeed = sliderEnemyLeader.value();
    this.settings.bossSpeed = sliderBoss.value();
    this.settings.playerSpeed = sliderPlayer.value();

    this.settings.enemyBaseMaxForce = sliderEnemyBaseForce.value();
    this.settings.enemyLeaderMaxForce = sliderEnemyLeaderForce.value();
    this.settings.bossMaxForce = sliderBossForce.value();
    this.settings.playerMaxForce = sliderPlayerForce.value();

    this.settings.enemyVision = sliderEnemyVision.value();
    this.settings.enemyDamage = sliderEnemyDamage.value();

    let btnW = 200;
    let btnH = 50;
    let btnX = width / 2 - btnW / 2;
    let btnY = (height - 100) - btnH / 2;

    fill(255);
    rect(btnX, btnY, btnW, btnH);
    fill(0);
    textSize(24);
    text("Retour Menu", (width / 2) - 70, btnY + 32);
  }

  showGame() {
    background(180);

    // affiche niveau et son contenu (joueur, obstacles, ennemis, balles, sang)
    let actualLevel = this.lvlManager.getActualLevel();
    if (actualLevel) {
      actualLevel.show();
    }

    this.player.show();

    for (let ennemy of this.enemies) {
      ennemy.show();
    }

    for (let bullet of this.bullets) {
      bullet.show();
    }

    for (let blood of this.bloods) {
      push();
      imageMode(CENTER);
      image(imgBlood, blood.x, blood.y, 60, 60);
      pop();
    }
  }

  gameVictory() {
    this.state = "victory";
    if (soundGame && soundGame.isPlaying()) {
      soundGame.stop();
    }
  }

  startGame() {
    this.state = "game";
    this.gameOverSound = false;
    if (soundMenu && soundMenu.isPlaying()) {
      soundMenu.stop();
    }
    if (soundGame && !soundGame.isPlaying()) {
      soundGame.loop();
    }

    this.enemies = [];
    this.obstacles = [];
    this.bullets = [];
    this.bloods = [];

    this.player.health = 100;

    this.lvlManager.loadLevel(1);
  }
}

// Gestion collisions avec obstacles
function collideWalls(rectX, rectY, rectW, rectH, entitieX, entitieY, entitieR) {
  // point plus proche cercle de l'entité au rect
  let closestX = min(rectX + rectW, max(rectX, entitieX));
  let closestY = min(rectY + rectH, max(rectY, entitieY));
  // distance entre entité et le point du cercle
  let dx = entitieX - closestX;
  let dy = entitieY - closestY;

  return (dx * dx + dy * dy <= entitieR * entitieR);
}