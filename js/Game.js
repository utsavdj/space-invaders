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
import StatusSidebar from "../js/StatusSidebar.js";
import Score from "../js/Score.js";
import Common from "../js/Common.js";
import GameOver from "../js/GameOver.js";
import LevelComplete from "../js/LevelComplete.js";
import * as weaponConstants from "../js/constants/weaponConstants.js";
import * as shooterTypeConstants from "../js/constants/shooterTypeConstants.js";
import * as itemTypeConstants from "../js/constants/itemTypeConstants.js";
import * as gameConstants from "../js/constants/gameConstants.js";

class Game {
  constructor(gameId) {
    this.gameId = gameId;
    this.level = 1;
    this.isBossRound = false;
    this.score = 0;
    this.hiScoreId = gameId+'-level-'+this.level;
    this.hiScore = localStorage.getItem(this.hiScoreId);
    this.hiScore = this.hiScore ? this.hiScore : 0;
    this.common = new Common();
    this.createParentElement();
    this.menu();
  }

  createParentElement() {
    this.parentElement = document.createElement('div');
    this.parentElement.setAttribute('id', this.gameId);
    document.body.prepend(this.parentElement);
  }

  menu() {
    var menu = new Menu(this.common.createElement);
    menu.createMenu(this.parentElement);
    this.onMenuLevelClick();
    this.onMenuBossRoundClick();
    this.onStartGameClick();
  }

  onStartGameClick() {
    let startButton = this.parentElement.getElementsByClassName('start-btn')[0];
    startButton.onclick = () => {
      this.level = 1;
      this.isBossRound = false;
      this.startGame();
    }
  }

  startGame(){
    let menuContainer = this.parentElement.getElementsByClassName('menu-container')[0];
    menuContainer.remove();
    this.init();
    this.checkKeyPress();
    this.requestAnimation = window.requestAnimationFrame(this.render.bind(this));
  }

  init() {
    this.createGame();
    this.gameLevel = new GameLevel(this.level);
    this.levelSettings = this.gameLevel.getLevel();
    this.background = new Background(this.gameElement);
    this.playerTotalHealth = 5;
    this.player = new Player(this.gameElement, this.playerTotalHealth);
    this.pattern = new Pattern();
    this.gameOver = new GameOver();
    console.log(this.gameLevel);
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

  createGame() {
    this.gameContainerHeight = '655';
    this.gameContainer = this.common.createElement('div', 'star-invaders-container');
    this.gameContainer.style.height = this.gameContainerHeight + 'px';
    this.parentElement.append(this.gameContainer);

    var buttonsContainer = this.createButtonsContainer(this.gameContainerHeight);
    var buttonsContainerWidth = buttonsContainer.offsetWidth;

    this.gameElement = this.common.createElement('div', 'star-invaders');
    this.gameElement.style.height = this.gameContainerHeight + 'px';
    this.gameContainer.appendChild(this.gameElement);

    this.statusSideBar = new StatusSidebar(this.common.createElement);
    this.statusSideBar.createStatusSideBar(this.gameContainer, this.gameContainerHeight);

    var statusContainerWidth = this.statusSideBar.statusSideBarElement.offsetWidth;
    this.gameContainer.style.width = buttonsContainerWidth + this.gameElement.offsetWidth + statusContainerWidth + 'px';

    this.statusSideBar.createStatusContainer(shooterTypeConstants.PLAYER, 'Player');
    var playerStatusContainer = this.gameContainer.getElementsByClassName('player-container')[0];
    playerStatusContainer.style.top = this.statusSideBar.statusSideBarElement.offsetHeight -
      playerStatusContainer.offsetHeight + 'px';
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
    this.moveItems(this.coins, itemTypeConstants.COIN);
    this.moveItems(this.healths, itemTypeConstants.HEALTH);
    this.moveItems(this.drops, itemTypeConstants.DROP);

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
    if (this.levelProgressCounter < this.levelSettings.generateAlien.length && !this.isBossRound) {
      console.log(this.isBossRound);

      this.levelProgress = this.levelSettings.generateAlien[this.levelProgressCounter];
      if (this.counter === this.levelProgress.counter) {
        for (var i = 0; i < this.levelProgress.aliens.length; i++) {
          this.alienCreationInterval = 0;
          for (var j = 0; j < this.levelProgress.aliens[i].alienTypes.length; j++) {
            for (var k = 0; k < this.levelProgress.aliens[i].alienTypes[j].number; k++) {
              if (this.alienCreationCounter < gameConstants.MAX_ALIENS) {
                var alienProperties = this.levelProgress.aliens[i].alienTypes[j];
                var alien = this.createAliens(alienProperties.size, alienProperties.type,
                  this.levelProgress.aliens[i].pattern);

                alien.moveDownInterval = this.alienMoveDownOffset * this.alienCreationCounter * (i + 1);

                alien.finalPositionY = (this.gameContainerHeight - gameConstants.INITIAL_ALIENS_POSITION_Y_OFFSET) -
                  (alien.height * this.positions[this.alienCreationCounter].y) -
                  (gameConstants.ALIENS_POSITION_Y_OFFSET * this.positions[this.alienCreationCounter].y);

                alien.finalPositionX = (alien.width *
                  (this.positions[this.alienCreationCounter].x) + ((this.positions[this.alienCreationCounter].x) *
                    gameConstants.ALIENS_POSITION_X_OFFSET));
                this.alienCreationCounter++;
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
      var maximumPatternIndex = this.levelSettings.randomAliens.patterns.length;
      var patternIndex = this.common.generateRandomValue(minimumPatternIndex, maximumPatternIndex);
      var pattern = this.levelSettings.randomAliens.patterns[patternIndex];
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
      this.player.health = 1;
      this.player.shield = 1;
      this.reduceHealth(shooterTypeConstants.PLAYER, this.player);
      this.reduceShield(shooterTypeConstants.PLAYER, this.player);
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
    if ((this.aliens[index].properties.weapon === weaponConstants.SPREAD
      || this.aliens[index].properties.weapon === weaponConstants.SHIELD_BREAKER)
      && this.aliens[index].health === 1) {
      this.createBullets(shooterTypeConstants.ALIEN, this.aliens[index], this.aliens[index].properties.weapon,
        this.alienBullets);
    } else {
      this.createBullet(shooterTypeConstants.ALIEN, this.aliens[index], this.alienBullets);
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
              this.generateItemFromAlien(itemTypeConstants.HEALTH, this.healths, alienPositionX,
                alienPositionY, alienWidth);
            } else {
              this.generateItemFromAlien(itemTypeConstants.COIN, this.coins, alienPositionX,
                alienPositionY, alienWidth);
            }
            this.score += this.aliens[index].properties.score;
            this.scoreElement.innerText = this.score;
            this.updateHighScore();
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
    if(itemType === itemTypeConstants.COIN) {
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
    if (this.aliens[index].properties.special === weaponConstants.REGENERATE) {
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
              this.reduceHealth(shooterTypeConstants.PLAYER, this.player);
            } else {
              // this.isGameOver = true;
              // this.player.isExploded = true;
              // this.player.explode();
              // this.gameOver.createGameOverElement(this.common, this.gameElement);
            }
          } else {
            this.reduceShield(shooterTypeConstants.PLAYER, this.player);
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
    this.statusSideBar.createStatusContainer(shooterTypeConstants.BOSS, 'Boss');
  }

  checkPlayerBossCollision() {
    if (this.boss.checkCollision(this.player)) {
      this.player.health = 1;
      this.player.shield = 1;
      this.reduceHealth(shooterTypeConstants.PLAYER, this.player);
      this.reduceShield(shooterTypeConstants.PLAYER, this.player);
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
    if ((this.boss.weapon === weaponConstants.SPREAD
      || this.boss.weapon === weaponConstants.SHIELD_BREAKER) && this.boss.isMovingDown) {
      this.createBullets(shooterTypeConstants.ALIEN, this.boss, this.boss.weapon, this.bossBullets);
    } else {
      this.createBullet(shooterTypeConstants.ALIEN, this.boss, this.bossBullets);
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
        this.reduceShield(shooterTypeConstants.BOSS, this.boss);
      } else {
        this.reduceHealth(shooterTypeConstants.BOSS, this.boss);
      }
      if (this.boss.health === 0) {
        this.score += this.boss.levelSettings.score;
        this.scoreElement.innerText = this.score;
        this.updateHighScore();
        this.levelComplete();
      }
      this.playerBullets[index].bulletElement.remove();
      this.playerBullets.splice(index, 1);
    }
  }

  levelComplete() {
    var levelComplete = new LevelComplete();
    if(this.boss.shield) {
      this.boss.shield = 1;
      this.reduceShield(shooterTypeConstants.BOSS, this.boss);
    }
    this.boss.explode();
    this.isLevelComplete = true;
    levelComplete.createLevelCompleteElement(this.gameElement, this.common.createElement, this.level);
    this.onContinueClick();
  }

  onContinueClick(){
    var continueBtn = this.gameElement.getElementsByClassName('continue-btn')[0];
    continueBtn.onclick = () => {
      this.level++;
      this.gameContainer.remove();
      window.cancelAnimationFrame(this.requestAnimation);
      this.requestAnimation = window.requestAnimationFrame(this.render.bind(this));
      this.init();
    }
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
          if (itemName === itemTypeConstants.COIN) {
            this.updateCoin(items[i].score)
          } else if (itemName === itemTypeConstants.HEALTH) {
            this.updateHealth();
          } else if (itemName === itemTypeConstants.DROP) {
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
    this.updateHighScore();
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
    if (this.player.weapon === weaponConstants.SPREAD || this.player.weapon === weaponConstants.SHIELD_BREAKER) {
      this.createBullets(shooterTypeConstants.PLAYER, this.player, this.player.weapon, this.playerBullets);
    } else {
      this.createBullet(shooterTypeConstants.PLAYER, this.player, this.playerBullets);
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
    if (shooterType === shooterTypeConstants.PLAYER) {
      bullet.createBullet(shooterType, shooter.weapon);
    } else {
      bullet.createBullet(shooterType);
    }
    bullets.push(bullet);
  }

  updateHighScore(){
    if(this.score > this.hiScore){
      this.hiScore = this.score;
      localStorage.setItem(this.hiScoreId, this.hiScore);
      this.hiScoreElement.innerText = this.score;
    }
  }

  createButtonsContainer() {
    var score = new Score();
    var buttonsContainer = this.common.createElement('div', 'buttons-container');
    buttonsContainer.style.height = this.gameContainerHeight + 'px';
    this.gameContainer.appendChild(buttonsContainer);
    var scoreElements = score.createScores(buttonsContainer, this.level, this.score, this.hiScore,
      this.common.createElement);
    this.scoreElement = scoreElements.scoreElement;
    this.hiScoreElement = scoreElements.hiScoreElement;
    this.createButtons(buttonsContainer);
    return buttonsContainer;
  }

  createButtons(parentElement) {
    var pauseButton = this.common.createElement('button', 'pause-btn', 'Pause');
    parentElement.appendChild(pauseButton);
    if (!this.isLevelComplete) {
      this.onPauseClick(pauseButton);
    }

    var newGameButton = this.common.createElement('button', 'new-game-btn', 'New Game');
    parentElement.appendChild(newGameButton);
    this.onNewGameClick(newGameButton);

    var menuButton = this.common.createElement('button', 'menu-btn', 'Menu');
    parentElement.appendChild(menuButton);
    this.onMenuClick(menuButton);
  }

  onPauseClick(pauseButton) {
    pauseButton.onmousedown = () => {
      if (this.isPaused) {
        this.isPaused = false;
        this.requestAnimation = window.requestAnimationFrame(this.render.bind(this));
      } else {
        this.isPaused = true;
      }
    };
  }

  onNewGameClick(newGameButton) {
    newGameButton.onclick = () => {
      this.score = 0;
      this.gameContainer.remove();
      window.cancelAnimationFrame(this.requestAnimation);
      this.requestAnimation = window.requestAnimationFrame(this.render.bind(this));
      this.init();
    };
  }

  onMenuClick(menuButton) {
    menuButton.onclick = () => {
      this.level = 1;
      this.score = 0;
      this.gameContainer.remove();
      window.cancelAnimationFrame(this.requestAnimation);
      this.menu();
    };
  }

  onMenuLevelClick(){
    let menuLevelButtons = this.parentElement.getElementsByClassName('menu-level-btn');
    for (let i = 0; i < menuLevelButtons.length; i++) {
      menuLevelButtons[i].onclick = (e) => {
        this.level = +e.currentTarget.dataset.level;
        this.isBossRound = false;
        this.startGame();
      }
    }
  }

  onMenuBossRoundClick(){
    let menuBossRoundButtons = this.parentElement.getElementsByClassName('menu-boss-round-btn');
    for (let i = 0; i < menuBossRoundButtons.length; i++) {
      menuBossRoundButtons[i].onclick = (e) => {
        this.level = +e.currentTarget.dataset.level;
        this.isBossRound = true;
        this.startGame();
      }
    }
  }
}

export default Game;
