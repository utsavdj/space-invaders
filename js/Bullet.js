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

  createBullet(shooterType, bulletType = null, bulletIndex = null) {
    var bulletTypeIndex = this.findIndexOfArrayObject(this.bullets(), 'weapon', bulletType);
    if(bulletType) {
      this.properties = this.bullets()[bulletTypeIndex];
    }else{
      this.properties = this.bullets()[0];
    }
    this.bulletIndex = bulletIndex;
    if(bulletType === 'shield-breaker'){
      this.positionY = (this.bulletIndex * this.properties.intervalY) + this.height + this.shooterPositionY;
    }
    this.createBulletElement(shooterType);
  }

  createBulletElement(shooterType){
    this.bulletElement = document.createElement('div');
    this.bulletElement.style.position = 'absolute';
    if (shooterType === 'player') {
      this.bulletElement.classList.add('player-bullet');
      this.bulletElement.style.background = 'url(images/'+ this.properties.background +'.png)';
      this.bulletElement.style.top = this.positionY + 'px';
    } else {
      this.bulletElement.classList.add('alien-bullet');
      this.bulletElement.style.background = 'url(images/'+ this.properties.alienBullet +'.png)';
      // this.positionY = this.positionY;
      this.bulletElement.style.top = this.positionY  + 'px';
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

    if(this.properties.weapon === 'spread'){
      if(this.bulletIndex === 0){
        this.positionX -= 1
      }else if(this.bulletIndex === 2){
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

  findIndexOfArrayObject(array, key, value){
    var i = 0;
    var length = array.length;
    for (i; i < length; i++){
      if(array[i][key] === value){
        return i;
      }
    }
  }

  bullets() {
    return [
      {
        weapon: 'normal',
        background: 'blue-bullet',
        alienBullet: 'red-bullet',
        width: 5,
        height: 15
      },
      {
        weapon: 'spread',
        background: 's-bullet',
        alienBullet: 's-red-bullet',
        width: 9,
        height: 13,
        intervalX: 15,
        intervalY: 15
      },
      {
        weapon: 'shield-breaker',
        shieldHealth: 3,
        background: 'c-bullet',
        alienBullet: 'c-red-bullet',
        width: 9,
        height: 9,
        intervalY: 15
      }
    ]
  }
}

export default Bullet;
