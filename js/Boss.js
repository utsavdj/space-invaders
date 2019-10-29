class Boss {
  constructor(parentElement, levelSettings, generateRandomValue) {
    this.parentElement = parentElement;
    this.levelSettings = levelSettings;
    this.generateRandomValue = generateRandomValue;
    this.init();
  }

  init() {
    this.gameWidth = this.parentElement.offsetWidth;
    this.width = 62;
    this.height = 62;
    this.movementCounter = 0;
    this.moveOffset = 1;
    this.directionX = 1;
    this.positionX = 235;
    this.positionY = -this.height;
    this.initialHealth = this.levelSettings.health;
    this.health = this.initialHealth;
    this.initialShield = this.levelSettings.shield;
    this.shield = this.initialShield;
    this.weapon = this.levelSettings.weapon;
    this.isShieldOn = true;
    this.isExploded = false;
    this.explosionCounter = 0;
    this.explosionInterval = 25;
    this.isBulletFired = false;
    this.bulletDirectionY = -1;
    this.bulletFiredInterval = 120;
    this.bulletFiredCounter = 0;
    this.moveOffesetPositionX = 15;
    this.pauseInterval = this.levelSettings.pauseInterval;
    this.pauseIntervalCounter = 0;
    this.pause = this.levelSettings.pause;
    this.pauseCounter = 0;
    this.moveDownPause = this.levelSettings.moveDownPause;
    this.moveDownPauseCounter = 0;
    this.moveDownFireRate = this.levelSettings.moveDownFireRate;
    this.moveDownUpto = this.levelSettings.moveDownUpto;
    this.moveDownCounter = 0;
    this.moveUpCounter = 0;
    this.isInPosition = false;
    this.isMovingDown = false;
  }

  createBoss() {
    this.bossElement = document.createElement('div');
    this.bossElement.classList.add('boss');
    this.bossElement.style.width = this.width + 'px';
    this.bossElement.style.height = this.height + 'px';
    this.bossElement.style.top = this.positionY + 'px';
    this.bossElement.style.left = this.positionX + 'px';
    this.bossElement.style.zIndex = '20';
    this.bossElement.style.position = 'absolute';
    this.bossElement.style.background = 'url(images/death-star-shield.png)';
    this.parentElement.appendChild(this.bossElement);
  }

  moveToPosition(){
    var directionY = 1;
    var positionY = 20;
    if(this.positionY >= positionY){
      this.isInPosition = true;
    }
    this.movePositionY(directionY);
  }

  move() {
    if(!this.isInPosition) {
      this.moveToPosition();
    }else {
      if (this.pauseIntervalCounter >= this.pauseInterval &&
        (this.gameWidth > this.positionX + this.width + this.moveOffesetPositionX &&
          this.moveOffesetPositionX < this.positionX)) {
        this.isMovingDown = true;
        if (this.pauseCounter >= this.pause) {
          if (this.moveDownCounter <= this.moveDownUpto) {
            var directionY = 1;
            this.movePositionY(directionY);
          } else {
            this.bossElement.style.background = 'url(images/death-star.png)';
            this.bossElement.style.width = '60px';
            this.bossElement.style.height = '60px';
            this.isShieldOn = false;
            if (this.moveDownPauseCounter >= this.moveDownPause) {
              if (this.shield !== 0) {
                this.bossElement.style.background = 'url(images/death-star-shield.png)';
                this.bossElement.style.width = '62px';
                this.bossElement.style.height = '62px';
                this.isShieldOn = true;
              }
              if (this.moveUpCounter <= this.moveDownUpto) {
                directionY = -1;
                this.movePositionY(directionY);
              } else {
                this.pauseIntervalCounter = 0;
                this.pauseCounter = 0;
                this.moveDownCounter = 0;
                this.moveDownPauseCounter = 0;
                this.moveUpCounter = 0;
                this.isMovingDown = false;
              }
              this.moveUpCounter++;
            }
            this.moveDownPauseCounter++;
          }
          this.moveDownCounter++
        }
        this.pauseCounter++;
      } else {
        this.movePositionX();
        this.pauseIntervalCounter++;
      }
    }
  }

  movePositionY(directionY) {
    this.positionY += this.moveOffset * directionY;
    this.update();
  }

  movePositionX() {
    this.checkDirection();
    this.positionX += this.moveOffset * this.directionX;
    this.update();
  }

  checkDirection() {
    var endScreenOffsetPositionX = this.width;
    if (this.positionX <= -(this.width + endScreenOffsetPositionX)) {
      this.goToRandomPosition();
    }
    if (this.gameWidth + endScreenOffsetPositionX <= this.positionX) {
      this.goToRandomPosition();
    }
  }

  goToRandomPosition() {
    var directionX = 1;
    var endScreenOffsetPositionX = this.width;
    if (this.generateRandomValue(0, 2)) {
      if (this.directionX === directionX) {
        this.positionX = -endScreenOffsetPositionX;
      } else {
        this.positionX = this.gameWidth;
      }
    } else {
      if (this.directionX === directionX) {
        this.directionX = -directionX;
      } else {
        this.directionX = directionX;
      }
    }
  }

  update() {
    this.bossElement.style.left = this.positionX + 'px';
    this.bossElement.style.top = this.positionY + 'px';
  }


  checkCollision(player) {
    return this.positionX < player.positionX + player.width &&
      this.positionX + this.width > player.positionX &&
      this.positionY < player.positionY + player.height &&
      this.positionY + this.height > player.positionY
  }

  explode() {
    this.bossElement.style.background = 'url(images/boss-explosion.png)';
    this.bossElement.style.backgroundSize = 'contain';
  }

  updateHealth(healthElement, healthElementHeight) {
    var oneHealthTopOffset = healthElementHeight / this.initialHealth;
    var currentHealthTopOffset = healthElementHeight - this.health * oneHealthTopOffset;
    healthElement.style.top = currentHealthTopOffset + 'px';
  }

  updateShield(shieldElement, shieldElementHeight) {
    var oneShieldTopOffset = shieldElementHeight / this.initialShield;
    var currentShieldTopOffset = shieldElementHeight - this.shield * oneShieldTopOffset;
    shieldElement.style.top = currentShieldTopOffset + 'px';
  }

  checkIsPlayerClose(playerPositionX) {
    if (this.positionX < playerPositionX && this.positionX + this.width > playerPositionX) {
      return true;
    }
  }
}

export default Boss;
