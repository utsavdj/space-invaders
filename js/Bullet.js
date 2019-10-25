class Bullet {
  constructor(parentElement, shooterElement, bulletDirection) {
    this.parentElement = parentElement;
    this.shooterElement = shooterElement;
    this.bulletDirection = bulletDirection;
    this.init();
  }

  init(){
    this.parentElementHeight = this.parentElement.clientHeight;
    this.bulletSpeed = 5;
    this.width = 5;
    this.height = 15;
    this.shooterWidth = this.shooterElement.width;
    this.shooterHeight = this.shooterElement.height;
    this.shooterPositionX = this.shooterElement.positionX;
    this.positionX = this.shooterPositionX + ((this.shooterWidth - this.width) / 2);
    this.shooterPositionY = this.shooterElement.positionY;
    this.positionY = this.shooterPositionY;
  }

  createBullet(type) {
    this.bulletElement = document.createElement('div');
    this.bulletElement.style.width = this.width + 'px';
    this.bulletElement.style.height = this.height + 'px';
    this.bulletElement.style.position = 'absolute';
    if (type === 'player') {
      this.bulletElement.classList.add('player-bullet');
      this.bulletElement.style.background = 'url(images/blue-bullet.png)';
      this.bulletElement.style.top = this.positionY + 'px';
    } else {
      this.bulletElement.classList.add('alien-bullet');
      this.bulletElement.style.background = 'url(images/red-bullet.png)';
      this.positionY = this.positionY + this.shooterHeight;
      this.bulletElement.style.top = this.positionY  + 'px';
    }
    this.bulletElement.style.left = this.positionX + 'px';
    this.parentElement.appendChild(this.bulletElement);
  }

  move() {
    if (this.bulletDirection >= 1) {
      this.positionY -= this.bulletSpeed;
    } else {
      this.positionY += this.bulletSpeed;
    }

    this.draw();
  }

  draw() {
    this.bulletElement.style.top = this.positionY + 'px';
  }

  isBulletOutOfGame() {
    if ((this.positionY + this.height) < 0 || this.parentElementHeight + this.height < this.positionY) {
      this.bulletElement.remove();
      return true;
    }
    return false;
  }

  checkCollision(alien) {
    return this.positionX < alien.positionX + alien.width &&
      this.positionX + this.width > alien.positionX &&
      this.positionY < alien.positionY + alien.height &&
      this.positionY + this.height > alien.positionY
  }
}

export default Bullet;
