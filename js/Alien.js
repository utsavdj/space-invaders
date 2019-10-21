import Pattern from '../js/Pattern.js';

class Alien {
  constructor(parentElement) {
    this.parentElement = parentElement;
    this.width = 27;
    this.height = 44;
    this.isInPosition = false;
    this.isAllPatternComplete = false;
    this.creationInterval = 0;
    this.movementCounter = 0;
    this.patternCounter = 0;
    this.finalPositionX = 0;
    this.finalPositionY = 0;
    this.positionX = -44;
    this.t = 0;
    this.tOffset = 0.01;
    this.createAlien();
    this.pattern = new Pattern();
  }

  createAlien() {
    this.alienElement = document.createElement('div');
    this.alienElement.classList.add('alien');
    this.alienElement.style.width = this.width + 'px';
    this.alienElement.style.height = this.height + 'px';
    this.alienElement.style.top = this.positionX + 'px';
    this.alienElement.style.position = 'absolute';
    this.alienElement.style.background = 'url(images/star-wars-sprite.png)';
    this.alienElement.style.backgroundPosition = '-50px 0';
    this.parentElement.appendChild(this.alienElement);
  }

  setAlienInPosition() {
    if (this.positionX !== this.finalPositionX) {
      if (this.finalPositionX > this.positionX) {
        this.positionX++;
      } else {
        this.positionX--;
      }
    }
    if (this.positionY !== this.finalPositionY) {
      if (this.finalPositionY > this.positionY) {
        this.positionY++;
      } else {
        this.positionY--;
      }
    }

    if (Math.round(this.positionX-1) === this.finalPositionX){
      this.positionX = this.finalPositionX
    }

    if (Math.round(this.positionY-1) === this.finalPositionY){
      this.positionY = this.finalPositionY
    }

    if (Math.round(this.positionX) === this.finalPositionX && Math.round(this.positionY) === this.finalPositionY) {
      this.isInPosition = true;
    }
    this.drawToPosition();
  }

  move() {
    this.movementCounter++;
    if (this.movementCounter >= this.creationInterval) {
      if (!this.isAllPatternComplete) {
        this.coOrdinates = this.getPatternCoOrdinates(0);
        this.positionX = this.coOrdinates.x;
        this.positionY = this.coOrdinates.y;
        this.draw();
      } else {
        if (!this.isInPosition) {
          this.setAlienInPosition();
        }
      }
    }
  }

  drawToPosition() {
    this.alienElement.style.transform = 'rotate(0deg)';
    this.alienElement.style.left = this.positionX + 'px';
    this.alienElement.style.top = this.positionY + 'px';
  }

  draw() {
    this.degree = Math.atan2(this.positionY, this.positionX) * (180 / Math.PI);
    this.alienElement.style.transform = 'rotate(' + this.degree + 'deg)';
    this.alienElement.style.left = this.positionX + 'px';
    this.alienElement.style.top = this.positionY + 'px';
  }

  getPatternCoOrdinates(pattern) {
    if (this.t <= 1) {
      this.t += this.tOffset;
    } else {
      if (this.patternCounter >= this.pattern.patterns[pattern].length - 1) {
        this.isAllPatternComplete = true;
      }
      if (this.patternCounter < this.pattern.patterns[pattern].length - 1) {
        this.patternCounter++;
        this.t = 0;
      }
    }
    return this.pattern.generateCoOrdinates(this.t, this.pattern.patterns[pattern][0]);
  }
}

export default Alien;
