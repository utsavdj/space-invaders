class Drop {
  constructor(parentElement) {
    this.parentElement = parentElement;
    this.init();
  }

  init(){
    this.dropSpeed = 4;
    this.width = 31;
    this.height = 16;
  }

  createDrop(positionX, generateRandomValue) {
    this.positionX = positionX;
    this.positionY = -this.height;
    var dropType = generateRandomValue(0, this.drops().length);
    this.properties = this.drops()[dropType];

    this.element = document.createElement('div');
    this.element.style.width = this.width + 'px';
    this.element.style.height = this.height + 'px';
    this.element.style.position = 'absolute';
    this.element.classList.add('drop');
    this.element.style.background = 'url(images/'+ this.properties.background +'.png)';
    this.element.style.backgroundSize = 'contain';
    this.element.style.top = this.positionY  + 'px';
    this.element.style.left = this.positionX + 'px';
    this.parentElement.appendChild(this.element);
  }

  move() {
    this.positionY += this.dropSpeed;
    this.update();
  }

  update() {
    this.element.style.top = this.positionY + 'px';
  }

  isOutOfGame() {
    var parentElementHeight = this.parentElement.offsetHeight;
    if ((this.positionY + this.height) < 0 || parentElementHeight + this.height < this.positionY) {
      this.element.remove();
      return true;
    }
    return false;
  }

  checkCollision(player) {
    return this.positionX < player.positionX + player.width &&
      this.positionX + this.width > player.positionX &&
      this.positionY < player.positionY + player.height &&
      this.positionY + this.height > player.positionY
  }

  drops() {
    return [
      {
        weapon: 'normal',
        background: 'drop-1'
      },
      {
        weapon: 'spread',
        background: 'drop-2'
      },
      {
        weapon: 'shield',
        shield: 3,
        background: 'drop-4'
      },
      {
        weapon: 'shield-breaker',
        background: 'drop-5'
      }
    ]
  }

}

export default Drop;
