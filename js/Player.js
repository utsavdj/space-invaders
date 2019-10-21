class Player {
  constructor(parentElement) {
    this.parentElement = parentElement;
    this.width = 49;
    this.height = 73;
    this.positionX = 276;
    this.positionY = 572;

    this.createPlayer();
  }

  createPlayer() {
    this.playerElement = document.createElement('div');
    this.playerElement.classList.add('player');
    this.playerElement.style.width = this.width + 'px';
    this.playerElement.style.height = this.height + 'px';
    this.playerElement.style.background = 'url(images/star-wars-sprite.png)';
    this.playerElement.style.position = 'absolute';
    this.playerElement.style.top = this.positionY + 'px';
    this.playerElement.style.left = this.positionX + 'px';
    // this.playerElement.style.transition = 'all 0.5s';
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

}

export default Player;
