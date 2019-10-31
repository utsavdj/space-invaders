import {NORMAL} from "../js/constants/weaponConstants.js";

class Player {
  constructor(parentElement, totalHealth) {
    this.parentElement = parentElement;
    this.initialHealth = totalHealth;
    this.init();
  }

  init() {
    this.width = 49;
    this.height = 73;
    this.positionX = 276;
    this.positionY = 572;
    this.isExploded = false;
    this.isBulletFired = false;
    this.bulletFiredInterval = 20;
    this.bulletFiredCounter = 0;
    this.bulletDirectionY = 1;
    this.weapon = NORMAL;
    this.maxShield = 3;
    this.shield = 0;
    this.health = this.initialHealth;
    this.isShieldOn = false;

    this.coin = 0;
    this.createPlayer();
  }

  createPlayer() {
    const BACKGROUND_POSITION_X = 0;
    const BACKGROUND_POSITION_Y = 0;
    this.playerElement = document.createElement('div');
    this.playerElement.classList.add('player');
    this.playerElement.style.width = this.width + 'px';
    this.playerElement.style.height = this.height + 'px';
    this.playerElement.style.background = 'url(images/star-wars-sprite.png)';
    this.playerElement.style.backgroundPosition = BACKGROUND_POSITION_X + 'px ' + BACKGROUND_POSITION_Y + 'px';
    this.playerElement.style.position = 'absolute';
    this.playerElement.style.top = this.positionY + 'px';
    this.playerElement.style.left = this.positionX + 'px';
    this.playerElement.style.zIndex = '10';
    this.parentElement.appendChild(this.playerElement);
  }

  move(directionX, directionY) {
    if (directionX >= 1 && directionX) {
      this.playerElement.style.transform = 'rotate(15deg)';
    } else if (directionX <= 1 && directionX) {
      this.playerElement.style.transform = 'rotate(-15deg)';
    }
    this.positionX += directionX;
    this.positionY += directionY;

    this.draw();
  }

  draw() {
    this.playerElement.style.top = this.positionY + 'px';
    this.playerElement.style.left = this.positionX + 'px';
  }

  explode() {
    var positionX = 0;
    var positionY = -73;
    this.playerElement.style.backgroundPosition = positionX + 'px ' + positionY + 'px';
  }

  updateHealth(healthElement, healthElementHeight) {
    var oneHealthTopOffset = healthElementHeight / this.initialHealth;
    var currentHealthTopOffset = healthElementHeight - this.health * oneHealthTopOffset;
    healthElement.style.top = currentHealthTopOffset + 'px';
  }

  updateShield(shieldElement, shieldElementHeight) {
    var oneShieldTopOffset = shieldElementHeight / this.maxShield;
    var currentShieldTopOffset = shieldElementHeight - this.shield * oneShieldTopOffset;
    shieldElement.style.top = currentShieldTopOffset + 'px';
  }

  fillShield(gameContainer) {
    var shieldElement = gameContainer.getElementsByClassName('player-shield')[0];
    shieldElement.style.top = '0px';
  }

  fillHealth(gameContainer) {
    var healthContainerElement = gameContainer.getElementsByClassName('player-health-container')[0];
    var healthContainerElementHeight = healthContainerElement.clientHeight;
    var oneHealthPositionY = healthContainerElementHeight / this.initialHealth;
    var healthElement = gameContainer.getElementsByClassName('player-health')[0];
    var healthElementPositionY = healthElement.offsetTop;
    var currentHealthPositionY = healthElementPositionY - oneHealthPositionY;
    healthElement.style.top = currentHealthPositionY + 'px';
  }

}

export default Player;
