import Background from '../js/Background.js';
import Player from '../js/Player.js';
import Alien from '../js/Alien.js';
import Pattern from '../js/Pattern.js';
import GameLevel from '../js/GameLevel.js';
import Bullet from '../js/Bullet.js';
import Boss from '../js/Boss.js';

class Game {
  constructor() {
    this.level = 1;
    this.init();
    this.checkKeyPress();
  }

  init() {
    this.createGame();
    this.gameLevel = new GameLevel();
    this.background = new Background(this.gameElement);
    this.player = new Player(this.gameElement);
    this.boss = new Boss(this.gameElement, this.gameLevel.getLevel(this.level).bossHealth);
    this.pattern = new Pattern();
    this.mediumPositions = this.pattern.getAlienPositionAndInterval();
    this.playerRecentPositionX = this.player.positionX;
    this.aliens = [];
    this.keyState = {};
    this.isKeyPressed = false;
    this.playerBullets = [];
    this.bossBullets = [];
    this.alienBullets = [];
    this.counter = 0;
    this.alienCreationCounter = 0;
    this.alienPositionCounter = 5;
    this.alienCreationInterval = 0;
    this.alienCreationIntervalOffset = 15;
    this.alienMoveDownOffset = 300;
    this.levelProgressCounter = 0;
    this.positionsY = [309, 255, 201, 147, 93];
    this.stopAnimation = false;
    this.gameOver = false;
    this.explosionCounter = 0;
    this.explosionInterval = 25;
    this.isBulletFired = false;
    this.bulletDirectionY = -1;
    this.bulletFiredTimeout = 1000;
    this.bulletFiredCounter = 0;
    this.alienMovingDownBulletFiredTimeout = 100;
    this.alienMovingDownBulletFiredCounter = 0;
    this.isAlienMovingDownBulletFired = false;
    this.isLevelComplete = false;
    this.requestAnimation = window.requestAnimationFrame(this.render.bind(this));
  }

  render() {
    this.background.move();

    if (!this.gameOver) {
      this.assignMovementKeys();
      this.setAliensPosition();
    }


    for (let i = 0; i < this.aliens.length; i++) {
      this.checkPlayerAlienCollision(this.aliens[i], i);

      if (this.aliens[i] && !this.aliens[i].isChild) {
        this.moveAliensSideWays(i);
      }


      if (this.aliens[i] && !this.aliens[i].isExploded && !this.gameOver && this.aliens[i].isInPosition &&
        !this.aliens[i].isMoveDownPatternComplete && !this.aliens[i].isChild) {
        if (this.aliens[i].movementCounter % 100 === 0 && !this.aliens[i].isPlayerPositionSet) {
          this.playerRecentPositionX = this.player.positionX;
        }
        this.aliens[i].moveDown(this.playerRecentPositionX);
      }

      for (let j = 0; j < this.playerBullets.length; j++) {
        if (this.aliens[i] && this.playerBullets[j].checkCollision(this.aliens[i]) && !this.aliens[i].isExploded) {
          this.aliens[i].isExploded = true;
          this.playerBullets[j].bulletElement.remove();
          this.playerBullets.splice(j, 1);
          break;
        }
      }

      if (this.aliens[i] && this.aliens[i].isExploded) {
        this.explodeAlien(i);
      }

      if (this.aliens[i] && this.aliens[i].checkIsPlayerClose(this.player.positionX) && !this.isBulletFired && !this.aliens[i].isMovingDown) {
        this.isBulletFired = true;
        this.bullet = new Bullet(this.gameElement, this.aliens[i], this.aliens[i].bulletDirectionY);
        this.bullet.createBullet('alien');
        this.alienBullets.push(this.bullet);
      }

      if (this.aliens[i] && this.isBulletFired && !this.aliens[i].isMovingDown) {
        if (this.bulletFiredCounter >= this.bulletFiredTimeout) {
          this.isBulletFired = false;
          this.bulletFiredCounter = 0;
        }
        this.bulletFiredCounter++;
      }

      if (this.aliens[i] && this.aliens[i].checkIsPlayerClose(this.player.positionX) && !this.isAlienMovingDownBulletFired && this.aliens[i].isMovingDown) {
        this.isAlienMovingDownBulletFired = true;
        this.bullet = new Bullet(this.gameElement, this.aliens[i], this.aliens[i].bulletDirectionY);
        this.bullet.createBullet('alien');
        this.alienBullets.push(this.bullet);
      }

      if (this.aliens[i] && this.isAlienMovingDownBulletFired && this.aliens[i].isMovingDown) {
        if (this.alienMovingDownBulletFiredCounter >= this.alienMovingDownBulletFiredTimeout) {
          this.isAlienMovingDownBulletFired = false;
          this.alienMovingDownBulletFiredCounter = 0;
        }
        this.alienMovingDownBulletFiredCounter++;
      }
    }

    for (let i = 0; i < this.alienBullets.length; i++) {
      if (this.alienBullets[i].isBulletOutOfGame()) {
        this.alienBullets.splice(i, 1)
      } else {
        if (this.alienBullets[i].checkCollision(this.player)) {
          this.gameOver = true;
          this.player.isExploded = true;
          this.player.explode();
          this.alienBullets[i].bulletElement.remove();
          this.alienBullets.splice(i, 1);
          this.createGameOverElement();
          break;
        } else {
          // this.alienBullets[i].move();
        }
      }
    }

    for (let i = 0; i < this.bossBullets.length; i++) {
      if (this.bossBullets[i].isBulletOutOfGame()) {
        this.bossBullets.splice(i, 1)
      } else {
        if (this.bossBullets[i].checkCollision(this.player)) {
          this.gameOver = true;
          this.player.isExploded = true;
          this.player.explode();
          this.bossBullets[i].bulletElement.remove();
          this.bossBullets.splice(i, 1);
          this.createGameOverElement();
          break;
        } else {
          this.bossBullets[i].move();
        }
      }
    }

    if (this.player.isExploded) {
      if (this.explosionCounter === this.explosionInterval) {
        this.player.playerElement.remove();
      }
      this.explosionCounter++;
    }

    for (let i = 0; i < this.playerBullets.length; i++) {
      if (this.playerBullets[i] && this.playerBullets[i].isBulletOutOfGame()) {
        this.playerBullets[i].bulletElement.remove();
        this.playerBullets.splice(i, 1);
      } else {
        this.playerBullets[i].move();
      }

      if (this.playerBullets[i] && this.playerBullets[i].checkCollision(this.boss)) {
        this.playerBullets[i].bulletElement.remove();
        this.playerBullets.splice(i, 1);
        this.boss.health -= 1;
        this.boss.updateBossHealth(this.bossHealthElement, this.bossHealthHeight);
        if(this.boss.health === 0){
          this.boss.explode();
          this.isLevelComplete = true;
          this.createLevelCompleteElement();
        }
      }
    }

    for (let i = 0; i < this.alienBullets.length; i++) {
      if (this.alienBullets[i].isBulletOutOfGame()) {
        this.alienBullets.splice(i, 1)
      } else {
        this.alienBullets[i].move();
      }
    }

    this.checkPlayerBossCollision();
    if(!this.gameOver){
      this.boss.move();
    }

    if (this.player.isBulletFired) {
      if (this.player.bulletFiredCounter >= this.player.bulletFiredTimeout) {
        this.player.isBulletFired = false;
        this.player.bulletFiredCounter = 0;
      }
      this.player.bulletFiredCounter++;
    }

    if (this.boss.isBulletFired) {
      if (this.boss.bulletFiredCounter >= this.boss.bulletFiredTimeout) {
        this.boss.isBulletFired = false;
        this.boss.bulletFiredCounter = 0;
      }
      this.boss.bulletFiredCounter++;
    }

    if (!this.gameOver && this.boss.checkIsPlayerClose(this.player.positionX) && !this.boss.isBulletFired) {
      this.boss.isBulletFired = true;
      this.bullet = new Bullet(this.gameElement, this.boss, this.boss.bulletDirectionY);
      this.bullet.createBullet('alien');
      this.bossBullets.push(this.bullet);
    }

    this.counter++;

    if (!this.gameOver && !this.isLevelComplete) {
      this.requestAnimation = window.requestAnimationFrame(this.render.bind(this));
    }
  }

  setAliensPosition() {
    if (this.levelProgressCounter < this.gameLevel.getLevel(this.level).generateAlien.length) {

      this.levelProgress = this.gameLevel.getLevel(this.level).generateAlien[this.levelProgressCounter];

      if (this.counter === this.levelProgress.counter) {
        for (let i = 0; i < this.levelProgress.aliens.length; i++) {
          this.alienCreationInterval = 0;
          for (let j = 0; j < this.levelProgress.aliens[i].alienTypes.length; j++) {
            for (let k = 0; k < this.levelProgress.aliens[i].alienTypes[j].number; k++) {
              var alienProperties = this.levelProgress.aliens[i].alienTypes[j];
              this.createAliens(alienProperties.size, alienProperties.type, this.levelProgress.aliens[i].pattern);

              this.alien.moveDownInterval = this.alienMoveDownOffset * this.alienCreationCounter * (i + 1);

              this.alien.finalPositionY = this.positionsY[this.mediumPositions[this.alienCreationCounter].y];

              this.alien.finalPositionX = (this.alien.width *
                (this.mediumPositions[this.alienCreationCounter].x) + ((this.mediumPositions[this.alienCreationCounter].x) * 20));
              this.alienCreationCounter++;

              if (this.alienCreationCounter === 20) {
                this.alienCreationCounter = 0;
              }
            }
          }
        }
        this.levelProgressCounter++;
      }
    }
  }

  createAliens(size, type, pattern) {
    this.alien = new Alien(this.gameElement);
    this.alien.createAlien(size, type, pattern);
    this.alien.creationInterval = this.alienCreationInterval;
    this.alien.alienNumber = this.alienCreationCounter;
    this.aliens.push(this.alien);
    this.alienCreationInterval += this.alienCreationIntervalOffset;
  }

  explodeAlien(index) {
    if (this.aliens[index].isExploded) {
      if (this.aliens[index].explosionCounter === 1) {
        this.aliens[index].explode();
        if (this.aliens[index].properties.special) {
          this.performSpecialProperty(index);
        }
      }
      if (this.aliens[index].explosionCounter === this.aliens[index].explosionInterval) {
        this.aliens[index].alienElement.remove();
        this.aliens.splice(index, 1);
        return;
      }
      this.aliens[index].explosionCounter++;
    }
  }

  performSpecialProperty(index) {
    if (this.aliens[index].properties.special === 're-generate') {
      const ALIEN_CHILD_PROPERTIES = this.aliens[index].properties.children;
      this.generateTwo(this.aliens[index].size, this.aliens[index].type, ALIEN_CHILD_PROPERTIES,
        this.aliens[index].positionX, this.aliens[index].positionY);
    }
  }

  generateTwo(size, type, properties, positionX, positionY) {
    for (var num = 0; num < properties.length; num++) {
      this.alien = new Alien(this.gameElement);
      this.alien.createAlien(size, type, null, true, properties[num], positionX, positionY);
      this.aliens.push(this.alien);
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
    }
    // } else if (this.keyState['ArrowUp'] || this.keyState['KeyW']) {
    //   if (this.player.positionY >= 5) {
    //     this.player.move(0, -5);
    //   }
    // } else if (this.keyState['ArrowDown'] || this.keyState['KeyS']) {
    //   if (this.player.positionY <= this.background.height - this.player.height - 6) {
    //     this.player.move(0, 5);
    //   }
    // }
  }

  assignShootKeys() {
    if (!this.gameOver && ((this.keyState['Space'] || this.keyState['Enter']) && !this.isKeyPressed && !this.player.isBulletFired)) {
      this.player.isBulletFired = true;
      this.bulletDirectionY = 1;
      this.bullet = new Bullet(this.gameElement, this.player, this.bulletDirectionY);
      this.bullet.createBullet('player');
      this.playerBullets.push(this.bullet);
    }
  }

  checkKeyPress() {
    if (!this.gameOver) {
      document.onkeydown = event => {
        const CONTROL = event.code;
        this.keyState[CONTROL] = true;
        this.assignShootKeys();
        this.isKeyPressed = true;
      };

      // check key if key is pressed if pressed prevent unlimited press
      document.onkeyup = event => {
        this.player.playerElement.style.transform = 'rotate(0deg)';
        this.isKeyPressed = false;
        const CONTROL = event.code;
        this.keyState[CONTROL] = false;
        if (CONTROL === 'Space') {
        }
      };
    }
  }

  checkPlayerAlienCollision(alien, index) {
    if (alien && !this.gameOver && !alien.isExploded && alien.checkCollision(this.player)) {
      alien.alienElement.remove();
      this.player.isExploded = true;
      this.player.explode();
      this.aliens.splice(index, 1);
      this.gameOver = true;
      this.createGameOverElement();
      return false;
    } else {
      if (!alien.isExploded) {
        if (!alien.isChild) {
          alien.move();
        } else {
          if (alien.movementCounter % 100 === 0 && !alien.isPlayerPositionSet) {
            this.playerRecentPositionX = this.player.positionX;
          }
          if (!alien.isChildMoveDownPatternComplete) {
            alien.moveAlienChild(this.playerRecentPositionX);
          } else {
            alien.alienElement.remove();
            this.aliens.splice(index, 1);
            return false;
          }
        }
      }
    }
  }

  checkPlayerBossCollision(){
    if (this.boss.checkCollision(this.player)) {
      this.player.isExploded = true;
      this.player.explode();
      this.gameOver = true;
      this.createGameOverElement();
    }
  }

  moveAliensSideWays(index) {
    if (!this.aliens[index].isExploded && this.aliens[index].isInPosition) {
      if (this.aliens[index].movementCounter % 20 === 0) {
        this.aliens[index].moveX();
      }
    }
  }

  createGameOverElement() {
    this.gameOverElement = this.createElement('div', 'game-over');
    this.gameOverElement.style.zIndex = '20';
    this.gameOverElement.style.position = 'absolute';
    this.gameElement.appendChild(this.gameOverElement);

    this.gameOverTextElement = this.createElement('p', 'game-over-text', 'Game Over');
    this.gameOverElement.appendChild(this.gameOverTextElement);
    this.createButtons(this.gameOverElement);

    this.retry();
  }

  createLevelCompleteElement() {
    this.levelCompleteElement = this.createElement('div', 'level-complete');
    this.levelCompleteElement.style.zIndex = '20';
    this.levelCompleteElement.style.position = 'absolute';
    this.gameElement.appendChild(this.levelCompleteElement);

    this.levelCompleteTextElement = this.createElement('p', 'level-complete-text',
      'Level ' + this.level + ' Complete');
    this.levelCompleteElement.appendChild(this.levelCompleteTextElement);
    // this.createButtons(this.levelCompleteElement);

    this.retry();
  }

  createButtons(parentElement){
    this.retryButton = this.createElement('button', 'retry-btn', 'Retry');
    parentElement.appendChild(this.retryButton);

    // this.menuButton = this.createElement('button', 'menu-btn', 'Menu');
    // parentElement.appendChild(this.menuButton);
  }

  retry() {
    this.retryButton.onclick = () => {
      this.gameContainer.remove();
      this.init();
    };
  }

  createGame() {
    this.gameContainer = this.createElement('div', 'star-invaders-container');
    document.body.prepend(this.gameContainer);
    this.gameElement = this.createElement('div', 'star-invaders');
    this.gameHeight = this.gameContainer.offsetHeight;
    this.gameElement.style.height = this.gameHeight + 'px';
    this.gameContainer.appendChild(this.gameElement);
    this.createScoreBoard();
    this.gameContainer.style.width = this.gameElement.offsetWidth + this.scoreBoardElement.offsetWidth + 'px';
  }

  createScoreBoard(){
    this.scoreBoardElement = this.createElement('div', 'score-board');
    this.scoreBoardElement.style.height = this.gameHeight + 'px';
    this.gameContainer.appendChild(this.scoreBoardElement);
    this.createBossHealth();
  }

  createBossHealth(){
    this.bossHealthHeight = 550;
    this.bossHealthWidth = 50;
    this.bossHealthText = this.createElement('p', 'boss-health-text', 'Boss Health');
    this.scoreBoardElement.appendChild(this.bossHealthText);

    this.bossHealthContainer = this.createElement('div', 'boss-health-container');
    this.bossHealthContainer.style.height = this.bossHealthHeight + 'px';
    this.bossHealthContainer.style.width = this.bossHealthWidth + 'px';
    this.scoreBoardElement.appendChild(this.bossHealthContainer);

    this.bossHealthElement = this.createElement('div', 'boss-health');
    this.bossHealthElement.style.height = this.bossHealthHeight + 'px';
    this.bossHealthElement.style.width = this.bossHealthWidth + 'px';
    this.bossHealthContainer.appendChild(this.bossHealthElement);
  }

  createElement(tag, className, text = null) {
    this.element = document.createElement(tag);
    this.element.classList.add(className);
    if (text) {
      this.element.innerText = text;
    }
    return this.element;
  }

  playSound(src) {
    const SOUND = new Audio();
    SOUND.src = src;
    SOUND.play();
  }
}

export default Game;
