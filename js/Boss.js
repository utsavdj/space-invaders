class Boss {
  constructor(parentElement, health) {
    this.parentElement = parentElement;
    this.initialHealth = health;
    this.init();
  }

  init(){
    this.gameWidth = this.parentElement.offsetWidth;
    this.width = 60;
    this.height = 60;
    this.movementCounter = 0;
    this.moveOffset = 1;
    this.directionX = 1;
    this.positionX = 235;
    this.positionY = 10;
    this.endScreenOffset = 60;
    this.isExploded = false;
    this.explosionCounter = 0;
    this.explosionInterval = 25;
    this.isBulletFired = false;
    this.bulletDirectionY = -1;
    this.bulletFiredTimeout = 100;
    this.bulletFiredCounter = 0;
    this.health = this.initialHealth;
    this.createBoss();
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
    this.bossElement.style.background = 'url(images/death-star.png)';
    this.parentElement.appendChild(this.bossElement);
  }

  move() {
    this.checkDirection();
    this.positionX += this.moveOffset * this.directionX;
    this.draw();
  }

  checkDirection() {
    if (this.positionX <= -(this.width + this.endScreenOffset)) {
      this.goToRandomPosition(this.directionX);
    }
    if (this.gameWidth + this.endScreenOffset <= this.positionX) {
      this.goToRandomPosition(this.directionX);
    }
  }

  goToRandomPosition() {
    if (this.generateRandomValue(0, 2)) {
      if (this.directionX === 1) {
        this.positionX = -this.endScreenOffset;
      } else {
        this.positionX = this.gameWidth;
      }
    } else {
      if (this.directionX === 1) {
        this.directionX = -1;
      } else {
        this.directionX = 1;
      }
    }
  }

  draw() {
    this.bossElement.style.left = this.positionX + 'px';
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

  updateBossHealth(healthElement, healthElementHeight){
    var oneHealthTopOffset = healthElementHeight / this.initialHealth;
    var currentHealthTopOffset = healthElementHeight - this.health * oneHealthTopOffset;
    healthElement.style.top = currentHealthTopOffset + 'px';
  }

  generateRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  checkIsPlayerClose(playerPositionX) {
    if (this.positionX < playerPositionX && this.positionX + this.width > playerPositionX) {
      return true;
    }
  }
}

export default Boss;
