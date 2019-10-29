class Bullet {
  constructor(parentElement, shooterElement, bulletDirection) {
    this.parentElement = parentElement;
    this.shooterElement = shooterElement;
    this.bulletDirection = bulletDirection;
    this.init();
  }

  init() {
    this.parentElementHeight = this.parentElement.clientHeight;
    this.bulletSpeed = 5;
    this.width = 5;
    this.height = 20;
    this.shooterWidth = this.shooterElement.width;
    this.shooterHeight = this.shooterElement.height;
    this.shooterPositionX = this.shooterElement.positionX;
    this.positionX = this.shooterPositionX + ((this.shooterWidth - this.width) / 2);
    this.shooterPositionY = this.shooterElement.positionY;
    this.positionY = this.shooterPositionY;
  }

  createBullet(shooterType, bulletType = null, bulletIndex = null) {
    var bulletTypeIndex = this.findIndexOfArrayObject(this.bullets(), 'weapon', bulletType);
    if (bulletType) {
      this.properties = this.bullets()[bulletTypeIndex];
    } else {
      this.properties = this.bullets()[0];
    }
    this.positionX = this.shooterPositionX + ((this.shooterWidth - this.properties.width) / 2);
    this.bulletIndex = bulletIndex;
    if (bulletType === 'shield-breaker') {
      this.positionY = (this.bulletIndex * this.properties.intervalY) + this.properties.height + this.shooterPositionY;
    }
    this.createBulletElement(shooterType);
  }

  createBulletElement(shooterType) {
    this.bulletElement = document.createElement('div');
    this.bulletElement.style.position = 'absolute';
    this.bulletElement.style.background = 'url(images/star-wars-sprite.png)';
    if (shooterType === 'player') {
      this.bulletElement.classList.add('player-bullet');
      this.bulletElement.style.backgroundPosition = this.properties.positionX + 'px ' +
        this.properties.positionY + 'px';
      this.bulletElement.style.top = this.positionY + 'px';
    } else {
      this.bulletElement.classList.add('alien-bullet');
      this.bulletElement.style.backgroundPosition = this.properties.alienBullet.positionX + 'px ' +
        this.properties.alienBullet.positionY + 'px';
      // this.positionY = this.positionY;
      this.bulletElement.style.top = this.positionY + 'px';
    }
    this.bulletElement.style.width = this.properties.width + 'px';
    this.bulletElement.style.height = this.properties.height + 'px';
    this.bulletElement.style.left = this.positionX + 'px';
    this.parentElement.appendChild(this.bulletElement);
  }

  move() {
    if (this.bulletDirection >= 1) {
      this.positionY -= this.bulletSpeed;
    } else {
      this.positionY += this.bulletSpeed;
    }

    if (this.properties.weapon === 'spread') {
      if (this.bulletIndex === 0) {
        this.positionX -= 1
      } else if (this.bulletIndex === 2) {
        this.positionX += 1
      }
    }

    this.draw();
  }

  draw() {
    this.bulletElement.style.top = this.positionY + 'px';
    this.bulletElement.style.left = this.positionX + 'px';
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

  findIndexOfArrayObject(array, key, value) {
    var i = 0;
    var length = array.length;
    for (i; i < length; i++) {
      if (array[i][key] === value) {
        return i;
      }
    }
  }

  bullets() {
    return [
      {
        weapon: 'normal',
        positionX: -214,
        positionY: 0,
        alienBullet: {
          positionX: -214,
          positionY: -20,
        },
        width: 5,
        height: 15
      },
      {
        weapon: 'spread',
        positionX: -220,
        positionY: 0,
        alienBullet: {
          positionX: -220,
          positionY: -17,
        },
        width: 11,
        height: 17,
        intervalX: 15,
        intervalY: 15
      },
      {
        weapon: 'shield-breaker',
        positionX: -232,
        positionY: 0,
        alienBullet: {
          positionX: -232,
          positionY: -13,
        },
        width: 13,
        height: 13,
        intervalY: 20
      }
    ]
  }
}

export default Bullet;
