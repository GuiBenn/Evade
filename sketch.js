let game;

let sliderEnemyBase, sliderEnemyLeader, sliderBoss, sliderPlayer;
let sliderEnemyBaseForce, sliderEnemyLeaderForce, sliderBossForce, sliderPlayerForce;
let sliderEnemyVision, sliderEnemyDamage;

let imgPlayerLeft, imgPlayerRight, imgEnemyBase, imgLeader, imgBoss, imgBlood;

let soundGame, soundMenu, soundCapture, soundShoot, soundClick, soundVictory, soundGameOver, soundGameOverVoice, soundMonkey, soundSplash;

let fontEvasion;

function preload() {
  // images
  imgPlayerLeft = loadImage("assets/images/monkeyLeft.png");
  imgPlayerRight = loadImage("assets/images/monkeyRight.png");
  imgEnemyBase = loadImage("assets/images/enemyBase.png");
  imgLeader = loadImage("assets/images/leader.png");
  imgBoss = loadImage("assets/images/boss.png");
  imgBlood = loadImage("assets/images/bloodSplatter.png");

  // font
  fontEvasion = loadFont("assets/fonts/Arial.ttf");

  // sons
  soundGame = loadSound("assets/sounds/Game.mp3");
  soundMenu = loadSound("assets/sounds/Menu.mp3");
  soundCapture = loadSound("assets/sounds/Capture.mp3");
  soundShoot = loadSound("assets/sounds/Shoot.mp3");
  soundClick = loadSound("assets/sounds/Click.mp3");
  soundVictory = loadSound("assets/sounds/Victory.mp3");
  soundGameOver = loadSound("assets/sounds/GameOver.mp3");
  soundGameOverVoice = loadSound("assets/sounds/GameOverVoice.mp3");
  soundMonkey = loadSound("assets/sounds/Monkey.mp3");
  soundSplash = loadSound("assets/sounds/Splash.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  game = new GameManager();

  // sliders
  sliderEnemyBase = createSlider(1, 5, 2, 0.1);
  sliderEnemyBase.position(50, 150);
  sliderEnemyBase.style('width', '200px');

  sliderEnemyLeader = createSlider(1, 5, 2, 0.1);
  sliderEnemyLeader.position(50, 250);
  sliderEnemyLeader.style('width', '200px');

  sliderBoss = createSlider(1, 5, 2, 0.1);
  sliderBoss.position(50, 350);
  sliderBoss.style('width', '200px');

  sliderPlayer = createSlider(1, 5, 2, 0.1);
  sliderPlayer.position(50, 450);
  sliderPlayer.style('width', '200px');

  sliderEnemyBaseForce = createSlider(0.05, 1.0, 0.2, 0.01);
  sliderEnemyBaseForce.position(600, 150);
  sliderEnemyBaseForce.style('width', '200px');

  sliderEnemyLeaderForce = createSlider(0.05, 1.0, 0.2, 0.01);
  sliderEnemyLeaderForce.position(600, 250);
  sliderEnemyLeaderForce.style('width', '200px');

  sliderBossForce = createSlider(0.05, 1.0, 0.3, 0.01);
  sliderBossForce.position(600, 350);
  sliderBossForce.style('width', '200px');

  sliderPlayerForce = createSlider(0.05, 1.0, 0.2, 0.01);
  sliderPlayerForce.position(600, 450);
  sliderPlayerForce.style('width', '200px');

  sliderEnemyVision = createSlider(0.1, 2.0, 1.0, 0.1);
  sliderEnemyVision.position(50, 550);
  sliderEnemyVision.style('width', '200px');

  sliderEnemyDamage = createSlider(1, 30, 10, 1);
  sliderEnemyDamage.position(50, 650);
  sliderEnemyDamage.style('width', '200px');

  sliderEnemyBase.hide();
  sliderEnemyLeader.hide();
  sliderBoss.hide();
  sliderPlayer.hide();
  sliderEnemyBaseForce.hide();
  sliderEnemyLeaderForce.hide();
  sliderBossForce.hide();
  sliderPlayerForce.hide();
  sliderEnemyVision.hide();
  sliderEnemyDamage.hide();
}

function draw() {
  game.show();
  game.update();

}

function isMouseInRect(x, y, w, h) {
  return (mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h);
}

function mousePressed() {
  soundClick.play();
  if (game.state === "menu") {
    let btnW = 200;
    let btnH = 50;
    let btnX = width / 2 - btnW / 2;
    let btnY = height / 2 - btnH / 2;
    if (isMouseInRect(btnX, btnY, btnW, btnH)) {
      game.startGame();
    }

    let btn2Y = btnY + 80;
    if (isMouseInRect(btnX, btn2Y, btnW, btnH)) {
      game.state = "settings";
    }
  }
  else if (game.state === "settings") {
    let btnW = 200;
    let btnH = 50;
    let btnX = width / 2 - btnW / 2;
    let btnY = (height - 100) - btnH / 2;
    if (isMouseInRect(btnX, btnY, btnW, btnH)) {
      game.state = "menu";
      sliderEnemyBase.hide();
      sliderEnemyLeader.hide();
      sliderBoss.hide();
      sliderPlayer.hide();
      sliderEnemyBaseForce.hide();
      sliderEnemyLeaderForce.hide();
      sliderBossForce.hide();
      sliderPlayerForce.hide();
      sliderEnemyVision.hide();
      sliderEnemyDamage.hide();
    }
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    game.player.facingAngle = PI;
    game.player.vel.x = -game.player.maxSpeed;
  } else if (keyCode === RIGHT_ARROW) {
    game.player.facingAngle = 0;
    game.player.vel.x = game.player.maxSpeed;
  } else if (keyCode === UP_ARROW) {
    game.player.facingAngle = -HALF_PI;
    game.player.vel.y = -game.player.maxSpeed;
  } else if (keyCode === DOWN_ARROW) {
    game.player.facingAngle = HALF_PI;
    game.player.vel.y = game.player.maxSpeed;
  }
  if (key === 'c') {
    game.player.handleCapture(game);
  }
  if (key === 'v') {
    game.player.handlePropulsion();
  }
  if (key === 'r') {
    game.state = "menu";
  }
  if (key === 'd') {
    ArriveBehavior.debug  = !ArriveBehavior.debug;
    AvoidBehavior.debug   = !AvoidBehavior.debug;
    PursueBehavior.debug  = !PursueBehavior.debug;
    FleeBehavior.debug    = !FleeBehavior.debug;
    LeaderFollowBehavior.debug = !LeaderFollowBehavior.debug;
  }
}

// pour pas que joueur parte vers bas/ haut ... indéfiniement
function keyReleased() {
  if ([LEFT_ARROW, RIGHT_ARROW].includes(keyCode)) {
    game.player.vel.x = 0;
  }
  if ([UP_ARROW, DOWN_ARROW].includes(keyCode)) {
    game.player.vel.y = 0;
  }
}