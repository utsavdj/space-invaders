import Background from '../js/Background.js';
import Player from '../js/Player.js';
import Alien from '../js/Alien.js';
import Pattern from '../js/Pattern.js';
import GameLevel from '../js/GameLevel.js';
import Bullet from '../js/Bullet.js';
import Boss from '../js/Boss.js';
import Coin from "../js/Coin.js";
import Health from "../js/Health.js";
import Drop from "../js/Drop.js";
import Menu from "../js/Menu.js";
import LoadingScreen from "../js/LoadingScreen.js";
import StatusSidebar from "../js/StatusSidebar.js";
import Score from "../js/Score.js";
import Common from "../js/Common.js";
import GameOver from "../js/GameOver.js";
import LevelComplete from "../js/LevelComplete.js";

class Game {
  constructor(gameId) {
    this.gameId = gameId;
    this.level = 1;
    this.score = 0;
    this.hiScore = 0;
    this.common = new Common();
    this.createParentElement();
    this.createLoadingScreen();
    this.loadMenu();
  }

  createParentElement() {
    this.parentElement = document.createElement('div');
    this.parentElement.setAttribute('id', this.gameId);
    document.body.prepend(this.parentElement);
  }

  // loadJSON() {
  //   var xobj = new XMLHttpRequest();
  //   xobj.overrideMimeType("application/json");
  //   xobj.open('GET', 'js/gameLevel.json', true);
  //   xobj.onreadystatechange = function () {
  //     if (xobj.readyState === 4 && xobj.status === 200) {
  //       return xobj.responseText;
  //     }
  //   };
  //   xobj.send(null);
  // }

  // preload(){
  //   return [
  //     'images/drop-5.png',
  //     'images/life.png',
  //     'images/c-red-bullet.png',
  //     'images/drop-4.png',
  //     'images/drop-2.png',
  //   ]
  // }
  createLoadingScreen() {
    var loadingScreen = new LoadingScreen(this.common.createElement);
    loadingScreen.createLoadingScreen(this.parentElement);
  }

  loadMenu() {
    // window.onload = () => {
    var loadingScreenElement = this.parentElement.getElementsByClassName('loading-screen')[0];
    loadingScreenElement.remove();
    this.menu();
    // };
  }

  loadGame() {
    window.onload = () => {
      // this.loadingScreenElement.remove();
      this.init();
      this.checkKeyPress();
      this.requestAnimation = window.requestAnimationFrame(this.render.bind(this));
    };
  }

  menu() {
    var menu = new Menu(this.common.createElement);
    menu.createMenu(this.parentElement);
    this.start();
  }

  start() {
    var startButton = this.parentElement.getElementsByClassName('start-btn')[0];
    var menuContainer = this.parentElement.getElementsByClassName('menu-container')[0];
    startButton.onclick = () => {
      menuContainer.remove();
      this.init();
      this.checkKeyPress();
      this.requestAnimation = window.requestAnimationFrame(this.render.bind(this));
    }
  }

  init() {
    // var images = [];
    // // console.log(this.preload);
    // for (var i = 0; i < this.preload().length; i++) {
    //   images[i] = new Image();
    //   images[i].src = this.preload()[i];
    // }
    // images = [];
    this.createGame();
    var gameLevel = new GameLevel();
    this.levelSettings = gameLevel.getLevel(this.level);
    this.background = new Background(this.gameElement);
    this.playerTotalHealth = 5;
    this.player = new Player(this.gameElement, this.playerTotalHealth);
    this.pattern = new Pattern();
    this.gameOver = new GameOver();
    this.positions = this.pattern.getAlienPositionAndInterval();
    this.playerRecentPositionX = this.player.positionX;
    this.aliens = [];
    this.keyState = {};
    this.isKeyPressed = false;
    this.playerBullets = [];
    this.bossBullets = [];
    this.alienBullets = [];
    this.counter = 0;
    this.alienCreationCounter = 0;
    this.alienCreationInterval = 0;
    this.alienCreationIntervalOffset = 15;
    this.alienMoveDownOffset = 300;
    this.levelProgressCounter = 0;
    this.positionsY = [309, 255, 201, 147, 93];
    this.isGameOver = false;
    this.isAlienBulletFired = false;
    this.alienBulletFireInterval = 100;
    this.alienBulletFireCounter = 0;
    this.alienMovingDownBulletFireInterval = 30;
    this.alienMovingDownBulletFireCounter = 0;
    this.isAlienMovingDownBulletFired = false;
    this.isLevelComplete = false;
    this.coins = [];
    this.dropCounter = 0;
    this.dropInterval = this.levelSettings.dropInterval;
    this.drops = [];
    this.noOfAliensShotForCoinsGeneration = 0;
    this.noOfAliensToShootToGenerateCoins = this.levelSettings.noOfAliensToShootToGenerateCoins;
    this.isPlayerHealthSet = false;
    this.healths = [];
    this.totalAliens = this.common.getTotalNumberOfAliens(this.levelSettings.generateAlien);
    this.noOfAliensShot = 0;
    this.isBossCreated = false;
    this.randomAlienGenerationInterval = this.levelSettings.randomAliens.interval;
    this.randomAlienGenerationCounter = 0;
    this.isPaused = false;
    this.isBossRound = false;
  }

  checkKeyPress() {
    if (!this.isGameOver) {
      document.onkeydown = event => {
        var control = event.code;
        this.keyState[control] = true;
        this.assignShootKeys();
        this.isKeyPressed = true;
      };

      // check key if key is pressed if pressed prevent unlimited press
      document.onkeyup = event => {
        var control = event.code;
        this.player.playerElement.style.transform = 'rotate(0deg)';
        this.isKeyPressed = false;
        this.keyState[control] = false;
      };
    }
  }

  render() {
    this.checkBossRound();
    this.background.move();
    this.assignMovementKeys();

    this.createAndMoveAliens();
    this.checkAlienBulletFireRate();
    this.checkAlienMovingDownBulletFireRate();
    this.moveAlienBullets(this.alienBullets);
    this.createAndMoveBoss();

    this.movePlayerBullets();
    this.checkBulletFireRate(this.player);

    this.createDrops();
    this.generateCoins();
    this.setHealthOnAlien();
    this.moveItems(this.coins, 'coin');
    this.moveItems(this.healths, 'health');
    this.moveItems(this.drops, 'drop');

    this.counter++;
    this.dropCounter++;

    if (!this.isGameOver && !this.isLevelComplete && !this.isPaused) {
      this.requestAnimation = window.requestAnimationFrame(this.render.bind(this));
    }
  }

  checkBossRound() {
    if (this.noOfAliensShot >= this.totalAliens && !this.aliens.length && !this.isBossRound) {
      this.isBossRound = true;
    }
  }

  assignMovementKeys() {
    if (this.keyState['ArrowLeft'] || this.keyState['KeyA']) {
      if (this.player.positionX >= 5) {
        this.player.move(-5, 0);
      }
    } else if (this.keyState['ArrowRight'] || this.keyState['KeyD']) {
      if (this.player.positionX <= this.background.width - this.player.width - 5) {
        this.player.move(5, 0);
      }
      // }
    } else if (this.keyState['ArrowUp'] || this.keyState['KeyW']) {
      if (this.player.positionY >= 5) {
        this.player.move(0, -5);
      }
    } else if (this.keyState['ArrowDown'] || this.keyState['KeyS']) {
      if (this.player.positionY <= this.background.height - this.player.height - 6) {
        this.player.move(0, 5);
      }
    }
  }

  createAndMoveAliens(){
    this.setAliensPosition();

    this.generateRandomAliens();

    for (var i = 0; i < this.aliens.length; i++) {
      if (this.aliens[i]) {
        if (!this.checkPlayerAlienCollision(i)) {
          if (!this.aliens[i].isExploded) {
            if (!this.aliens[i].isChild) {
              this.aliens[i].move();
              if(this.aliens[i].isInPosition && !this.aliens[i].isMoveDownPatternComplete) {
                this.moveAlienDown(i);
              }
              if (this.isRandomAlienRemoved(i)) {
                break;
              }
            } else {
              if (!this.moveAlienChild(i)) {
                break;
              }
            }
            if (this.aliens[i].checkIsPlayerClose(this.player.positionX)) {
              if (!this.aliens[i].isMovingDown) {
                if (!this.isAlienBulletFired) {
                  this.isAlienBulletFired = true;
                  this.createAlienBullet(i);
                }
              }else{
                if (!this.isAlienMovingDownBulletFired) {
                  this.isAlienMovingDownBulletFired = true;
                  this.createAlienBullet(i);
                }
              }
            }
            this.alienShot(i);
          }else{
            this.explodeAlien(i);
          }
        }
      }
    }
  }

  createAliens(size, type, pattern) {
    var alien = new Alien(this.gameElement);
    alien.createAlien(size, type, pattern);
    alien.creationInterval = this.alienCreationInterval;
    if (this.isBossRound) {
      alien.isRandom = true;
    }
    this.aliens.push(alien);
    this.alienCreationInterval += this.alienCreationIntervalOffset;
    return alien;
  }

  setAliensPosition() {
    if (this.levelProgressCounter < this.levelSettings.generateAlien.length) {

      this.levelProgress = this.levelSettings.generateAlien[this.levelProgressCounter];

      if (this.counter === this.levelProgress.counter) {
        for (var i = 0; i < this.levelProgress.aliens.length; i++) {
          this.alienCreationInterval = 0;
          for (var j = 0; j < this.levelProgress.aliens[i].alienTypes.length; j++) {
            for (var k = 0; k < this.levelProgress.aliens[i].alienTypes[j].number; k++) {
              var alienProperties = this.levelProgress.aliens[i].alienTypes[j];
              var alien = this.createAliens(alienProperties.size, alienProperties.type, this.levelProgress.aliens[i].pattern);

              alien.moveDownInterval = this.alienMoveDownOffset * this.alienCreationCounter * (i + 1);

              alien.finalPositionY = this.positionsY[this.positions[this.alienCreationCounter].y];

              alien.finalPositionX = (alien.width *
                (this.positions[this.alienCreationCounter].x) + ((this.positions[this.alienCreationCounter].x) * 20));
              this.alienCreationCounter++;

              if (this.alienCreationCounter === 50) {
                this.alienCreationCounter = 0;
              }
            }
          }
        }
        this.levelProgressCounter++;
      }
    }
  }

  generateRandomAliens() {
    if (this.isBossRound && this.randomAlienGenerationCounter >= this.randomAlienGenerationInterval) {

      var numberOfAliens = this.common.generateRandomValue(this.levelSettings.randomAliens.minimumNumber,
        this.levelSettings.randomAliens.maximumNumber + 1);
      var minimumPatternIndex = 0;
      var maximumPatternIndex = this.pattern.getRandomAlienPatterns().length;
      var patternIndex = this.common.generateRandomValue(minimumPatternIndex, maximumPatternIndex);
      var pattern = this.pattern.getRandomAlienPatterns()[patternIndex];
      this.alienCreationInterval = 0;

      for (var i = 0; i < numberOfAliens; i++) {
        var minimumAlienSizeAndTypeIndex = 0;
        var maximumAlienSizeAndTypeIndex = this.levelSettings.randomAliens.aliens.length;
        var alienSizeAndTypeIndex = this.common.generateRandomValue(minimumAlienSizeAndTypeIndex, maximumAlienSizeAndTypeIndex);
        this.createAliens(this.levelSettings.randomAliens.aliens[alienSizeAndTypeIndex].size,
          this.levelSettings.randomAliens.aliens[alienSizeAndTypeIndex].type, pattern);
      }
      this.randomAlienGenerationCounter = 0;
    }
    this.randomAlienGenerationCounter++;
  }

  checkPlayerAlienCollision(index) {
    if (!this.aliens[index].isExploded && this.aliens[index].checkCollision(this.player)) {
      this.aliens[index].alienElement.remove();
      this.player.isExploded = true;
      this.player.explode();
      this.aliens.splice(index, 1);
      this.isGameOver = true;
      this.gameOver.createGameOverElement(this.common, this.gameElement);
      return true;
    } else {
      return false;
    }
  }

  setPlayerRecentPosition(index) {
    var playerPositionOffset = 100;
    if (this.aliens[index].movementCounter % playerPositionOffset === 0 && !this.aliens[index].isPlayerPositionSet) {
      this.playerRecentPositionX = this.player.positionX;
    }
  }

  moveAlienDown(index) {
    this.setPlayerRecentPosition(index);
    this.aliens[index].moveDown(this.playerRecentPositionX);
  }

  isRandomAlienRemoved(index) {
    if (this.aliens[index].isRandom && this.aliens[index].isAllPatternComplete) {
      this.aliens[index].alienElement.remove();
      this.aliens.splice(index, 1);
      return true;
    }
    return false;
  }

  moveAlienChild(index) {
    this.setPlayerRecentPosition(index);
    if (!this.aliens[index].isChildMoveDownPatternComplete) {
      this.aliens[index].moveAlienChild(this.playerRecentPositionX);
      return true;
    } else {
      this.aliens[index].alienElement.remove();
      this.aliens.splice(index, 1);
      return false;
    }
  }

  createAlienBullet(index) {
    if ((this.aliens[index].properties.weapon === 'spread' || this.aliens[index].properties.weapon === 'shield-breaker')
      && this.aliens[index].health === 1) {
      this.createBullets('alien', this.aliens[index], this.aliens[index].properties.weapon,
        this.alienBullets);
    } else {
      this.createBullet('alien', this.aliens[index], this.alienBullets);
    }
  }

  alienShot(index) {
    for (var i = 0; i < this.playerBullets.length; i++) {
      if (this.playerBullets[i].checkCollision(this.aliens[index])) {
        this.playerBullets[i].bulletElement.remove();
        this.playerBullets.splice(i, 1);
        this.aliens[index].health--;
        if (!this.aliens[index].health) {
          var alienPositionX = this.aliens[index].positionX;
          var alienPositionY = this.aliens[index].positionY;
          var alienWidth = this.aliens[index].width;
          this.aliens[index].isExploded = true;
          if (!this.isBossRound && !this.aliens[index].isRandom) {
            if (this.alienWithHealth === index) {
              this.generateItemFromAlien('health', this.healths, alienPositionX, alienPositionY, alienWidth);
            } else {
              this.generateItemFromAlien('coin', this.coins, alienPositionX, alienPositionY, alienWidth);
            }
            this.score += this.aliens[index].properties.score;
            this.scoreElement.innerText = this.score;
            this.noOfAliensShotForCoinsGeneration++;
            if (!this.aliens[index].isChild) {
              this.noOfAliensShot++;
            }
          }
        }
        break;
      }
    }
  }

  explodeAlien(index) {
    if (this.aliens[index].explosionCounter === 0) {
      this.aliens[index].explode();
      if (this.aliens[index].properties.special) {
        this.performSpecialProperty(index);
      }
    }
    if (this.aliens[index].explosionCounter >= this.aliens[index].explosionInterval) {
      this.aliens[index].alienElement.remove();
      this.aliens.splice(index, 1);
      return;
    }
    this.aliens[index].explosionCounter++;
  }

  generateCoins() {
    if (this.noOfAliensShotForCoinsGeneration === this.noOfAliensToShootToGenerateCoins) {
      this.noOfAliensShotForCoinsGeneration = 0;
      this.generateCoinsFromOffScreen();
    }
  }

  setHealthOnAlien() {
    if (this.player.health < this.playerTotalHealth && !this.isPlayerHealthSet) {
      var minimumValue = 0;
      var totalAliens = this.aliens.length;
      this.alienWithHealth = this.common.generateRandomValue(minimumValue, totalAliens);
      this.isPlayerHealthSet = true;
    }
  }

  generateItemFromAlien(itemType, items, positionX, positionY, alienWidth) {
    if(itemType === 'coin') {
      var item = new Coin(this.gameElement);
    }else{
      var item = new Health(this.gameElement);
      this.isPlayerHealthSet = false;
      this.alienWithHealth = null;
    }
    var itemFromAlienOffsetPositionX = (alienWidth - item.width) / 2;
    positionX = positionX + itemFromAlienOffsetPositionX;
    item.create(positionX, positionY);
    items.push(item);
  }

  performSpecialProperty(index) {
    if (this.aliens[index].properties.special === 're-generate') {
      var alienChildProperties = this.aliens[index].properties.children;
      this.generateTwo(this.aliens[index].size, this.aliens[index].type, alienChildProperties,
        this.aliens[index].positionX, this.aliens[index].positionY);
    }
  }

  generateTwo(size, type, properties, positionX, positionY) {
    for (var num = 0; num < properties.length; num++) {
      var alien = new Alien(this.gameElement);
      alien.createAlien(size, type, null, true, properties[num], positionX, positionY);
      if (this.isBossRound) {
        alien.isRandom = true;
      }
      this.aliens.push(alien);
    }
  }

  checkAlienBulletFireRate() {
    if (this.alienBulletFireCounter >= this.alienBulletFireInterval) {
      this.isAlienBulletFired = false;
      this.alienBulletFireCounter = 0;
    }
    this.alienBulletFireCounter++;
  }

  checkAlienMovingDownBulletFireRate() {
    if (this.alienMovingDownBulletFireCounter >= this.alienMovingDownBulletFireInterval) {
      this.isAlienMovingDownBulletFired = false;
      this.alienMovingDownBulletFireCounter = 0;
    }
    this.alienMovingDownBulletFireCounter++;
  }

  moveAlienBullets(bullets) {
    for (let i = 0; i < bullets.length; i++) {
      if (bullets[i].isBulletOutOfGame()) {
        bullets.splice(i, 1)
      } else {
        if (bullets[i].checkCollision(this.player)) {
          if (this.player.shield <= 0) {
            this.player.isShieldOn = false;
          }
          if (!this.player.isShieldOn) {
            if (this.player.health) {
              this.reduceHealth('player', this.player);
            } else {
              // this.isGameOver = true;
              // this.player.isExploded = true;
              // this.player.explode();
              // this.gameOver.createGameOverElement(this.common, this.gameElement);
            }
          } else {
            this.reduceShield('player', this.player);
          }
          bullets[i].bulletElement.remove();
          bullets.splice(i, 1);
          break;
        } else {
          bullets[i].move();
        }
      }
    }
  }

  reduceHealth(className, bulletReceiver) {
    var healthElement = this.gameContainer.getElementsByClassName(className + '-health')[0];
    var healthHeight = healthElement.offsetHeight;
    bulletReceiver.health--;
    bulletReceiver.updateHealth(healthElement, healthHeight);
  }

  reduceShield(className, bulletReceiver) {
    var shieldElement = this.gameContainer.getElementsByClassName(className + '-shield')[0];
    var shieldHeight = shieldElement.offsetHeight;
    bulletReceiver.shield--;
    bulletReceiver.updateShield(shieldElement, shieldHeight);
  }

  createAndMoveBoss() {
    if (this.isBossRound) {
      if (!this.isBossCreated) {
        this.createBoss();
      }
      this.boss.move();
      this.checkPlayerBossCollision();
      this.moveAlienBullets(this.bossBullets);
      this.checkBulletFireRate(this.boss);
      if (!this.boss.isBulletFired) {
        if (!this.boss.isMovingDown) {
          if (this.boss.checkIsPlayerClose(this.player.positionX)) {
            this.boss.isBulletFired = true;
            this.createBossBullet();
          }
        } else {
          this.boss.isBulletFired = true;
          this.createBossBullet();
        }
      }
    }
  }

  createBoss() {
    this.boss = new Boss(this.gameElement, this.level, this.levelSettings.boss, this.common.generateRandomValue);
    this.boss.createBoss();
    this.isBossCreated = true;
    this.statusSideBar.createStatusContainer('boss', 'Boss');
  }

  checkPlayerBossCollision() {
    if (this.boss.checkCollision(this.player)) {
      this.player.isExploded = true;
      this.player.explode();
      this.isGameOver = true;
      this.gameOver.createGameOverElement(this.common, this.gameElement);
    }
  }

  checkBulletFireRate(shooter) {
    if (shooter.isBulletFired) {
      if (shooter.bulletFiredCounter >= shooter.bulletFiredInterval) {
        shooter.isBulletFired = false;
        shooter.bulletFiredCounter = 0;
      }
      shooter.bulletFiredCounter++;
    }
  }

  createBossBullet() {
    if ((this.boss.weapon === 'spread' || this.boss.weapon === 'shield-breaker') && this.boss.isMovingDown) {
      this.createBullets('alien', this.boss, this.boss.weapon, this.bossBullets);
    } else {
      this.createBullet('alien', this.boss, this.bossBullets);
    }
  }

  movePlayerBullets() {
    for (let i = 0; i < this.playerBullets.length; i++) {
      if (this.playerBullets[i]) {
        if (this.playerBullets[i].isBulletOutOfGame()) {
          this.playerBullets[i].bulletElement.remove();
          this.playerBullets.splice(i, 1);
        } else {
          this.playerBullets[i].move();
          if (this.isBossRound) {
            this.updateBossStatus(i);
          }
        }
      }
    }
  }

  updateBossStatus(index) {
    if (this.playerBullets[index].checkCollision(this.boss)) {
      if (this.boss.isShieldOn && this.boss.shield !== 0) {
        this.reduceShield('boss', this.boss);
      } else {
        this.reduceHealth('boss', this.boss);
      }
      if (this.boss.health === 0) {
        this.score += this.boss.levelSettings.score;
        this.scoreElement.innerText = this.score;
        this.levelComplete();
      }
      this.playerBullets[index].bulletElement.remove();
      this.playerBullets.splice(index, 1);
    }
  }

  levelComplete() {
    var levelComplete = new LevelComplete();
    this.boss.explode();
    this.isLevelComplete = true;
    levelComplete.createLevelCompleteElement(this.gameElement, this.common.createElement, this.level);
  }

  createDrops() {
    if (this.dropCounter > this.dropInterval) {
      var drop = new Drop(this.gameElement);
      var dropWidth = drop.width;
      var gameWidth = this.gameElement.offsetWidth;
      var maxDropPositionX = gameWidth - dropWidth;

      var dropPositionX = this.common.generateRandomValue(0, maxDropPositionX + 1);
      drop.createDrop(dropPositionX, this.common.generateRandomValue);
      this.drops.push(drop);
      this.dropCounter = 0;
    }
  }

  generateCoinsFromOffScreen() {
    var coin = new Coin(this.gameElement);
    var gameWidth = this.gameElement.offsetWidth;
    var maxCoinPositionX = gameWidth - coin.width;
    var minCoinPositionX = coin.width;
    var offsetPositionX = 10;
    var offsetPositionY = 15;
    var noOfCoins = this.levelSettings.noOfCoinsGenerated;
    var totalWidthAndOffsetOfAllCoins = (coin.width + offsetPositionX) * noOfCoins;
    var isCoinFallNotStraight = this.common.generateRandomValue(0, 2);
    var positionX = this.common.generateRandomValue(minCoinPositionX, maxCoinPositionX);
    var positionY = -(noOfCoins * coin.height);

    if (positionX + totalWidthAndOffsetOfAllCoins >= gameWidth) {
      positionX -= coin.width;
    }

    coin.create(positionX, positionY);
    this.coins.push(coin);
    for (var i = 0; i < noOfCoins - 1; i++) {
      coin = new Coin(this.gameElement);
      if (positionX + totalWidthAndOffsetOfAllCoins <= gameWidth && isCoinFallNotStraight) {
        positionX += coin.width + offsetPositionX;
      }
      positionY += coin.height + offsetPositionY;
      coin.create(positionX, positionY);
      this.coins.push(coin);
    }
  }

  moveItems(items, itemName) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].isOutOfGame() || items[i].checkCollision(this.player)) {
        if (items[i].checkCollision(this.player)) {
          if (itemName === 'coin') {
            this.updateCoin(items[i].score)
          } else if (itemName === 'health') {
            this.updateHealth();
          } else if (itemName === 'drop') {
            this.updateDrop(items[i].properties.weapon, items[i].properties.shield)
          }
        }
        items[i].element.remove();
        items.splice(i, 1);
      } else {
        items[i].move();
      }
    }
  }

  updateCoin(score) {
    this.player.coin += 1;
    this.score += score;
    this.scoreElement.innerText = this.score;
  }

  updateHealth() {
    if (this.player.health < this.playerTotalHealth) {
      this.player.health += 1;
      this.player.fillHealth(this.gameContainer);
      this.isPlayerHealthSet = false;
    }
  }

  updateDrop(weapon, shield) {
    if (shield) {
      this.player.fillShield(this.gameContainer);
      this.player.shield = shield;
      this.player.isShieldOn = true;
    } else {
      this.player.weapon = weapon;
    }
  }

  assignShootKeys() {
    if (!this.isGameOver && ((this.keyState['Space'] || this.keyState['Enter']) && !this.isKeyPressed
      && !this.player.isBulletFired)) {
      this.player.isBulletFired = true;
      this.createPlayerBullet();
    }
  }

  createPlayerBullet() {
    if (this.player.weapon === 'spread' || this.player.weapon === 'shield-breaker') {
      this.createBullets('player', this.player, this.player.weapon, this.playerBullets);
    } else {
      this.createBullet('player', this.player, this.playerBullets);
    }
  }

  createBullets(shooterType, shooter, weapon, bullets) {
    var numberOfBullets = 3;
    for (var i = 0; i < numberOfBullets; i++) {
      var bullet = new Bullet(this.gameElement, shooter, shooter.bulletDirectionY);
      bullet.createBullet(shooterType, weapon, i);
      bullets.push(bullet);
    }
  }

  createBullet(shooterType, shooter, bullets) {
    var bullet = new Bullet(this.gameElement, shooter, shooter.bulletDirectionY);
    if (shooterType === 'player') {
      bullet.createBullet(shooterType, shooter.weapon);
    } else {
      bullet.createBullet(shooterType);
    }
    bullets.push(bullet);
  }

  createGame() {
    var gameContainerHeight = '655';
    this.gameContainer = this.common.createElement('div', 'star-invaders-container');
    this.gameContainer.style.height = gameContainerHeight + 'px';
    this.parentElement.append(this.gameContainer);

    var buttonsContainer = this.createButtonsContainer(gameContainerHeight);
    var buttonsContainerWidth = buttonsContainer.offsetWidth;

    this.gameElement = this.common.createElement('div', 'star-invaders');
    this.gameElement.style.height = gameContainerHeight + 'px';
    this.gameContainer.appendChild(this.gameElement);

    this.statusSideBar = new StatusSidebar(this.common.createElement);
    this.statusSideBar.createStatusSideBar(this.gameContainer, gameContainerHeight);

    var statusContainerWidth = this.statusSideBar.statusSideBarElement.offsetWidth;
    this.gameContainer.style.width = buttonsContainerWidth + this.gameElement.offsetWidth + statusContainerWidth + 'px';

    this.statusSideBar.createStatusContainer('player', 'Player');
    var playerStatusContainer = this.gameContainer.getElementsByClassName('player-container')[0];
    playerStatusContainer.style.top = this.statusSideBar.statusSideBarElement.offsetHeight -
      playerStatusContainer.offsetHeight + 'px';
  }

  createButtonsContainer(gameContainerHeight) {
    var score = new Score();
    var buttonsContainer = this.common.createElement('div', 'buttons-container');
    buttonsContainer.style.height = gameContainerHeight + 'px';
    this.gameContainer.appendChild(buttonsContainer);
    this.scoreElement = score.createScores(buttonsContainer, this.level, this.score, this.hiScore,
      this.common.createElement);
    this.createButtons(buttonsContainer);
    return buttonsContainer;
  }

  createButtons(parentElement) {
    var pauseButton = this.common.createElement('button', 'pause-btn', 'Pause');
    parentElement.appendChild(pauseButton);
    if (!this.isLevelComplete) {
      this.pause(pauseButton);
    }

    var newGameButton = this.common.createElement('button', 'new-game-btn', 'New Game');
    parentElement.appendChild(newGameButton);
    this.newGame(newGameButton);

    var menuButton = this.common.createElement('button', 'menu-btn', 'Menu');
    parentElement.appendChild(menuButton);
    this.goToMenu(menuButton);
  }

  newGame(newGameButton) {
    newGameButton.onclick = () => {
      this.gameContainer.remove();
      window.cancelAnimationFrame(this.requestAnimation);
      this.requestAnimation = window.requestAnimationFrame(this.render.bind(this));
      this.score = 0;
      this.isLevelComplete = false;
      this.init();
    };
  }

  pause(pauseButton) {
    pauseButton.onmousedown = () => {
      if (this.isPaused) {
        this.isPaused = false;
        this.requestAnimation = window.requestAnimationFrame(this.render.bind(this));
      } else {
        this.isPaused = true;
      }
    };
  }

  goToMenu(menuButton) {
    menuButton.onclick = () => {
      this.gameContainer.remove();
      window.cancelAnimationFrame(this.requestAnimation);
      this.menu();
    };
  }
}

export default Game;
