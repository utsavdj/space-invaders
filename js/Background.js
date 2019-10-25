class Background {
  constructor(parentElement) {
    this.parentElement = parentElement;
    this.init();
  }

  init(){
    this.width = this.parentElement.clientWidth;
    this.height = this.parentElement.clientHeight;
    this.backgroundMovementCounter = 0;
    this.backgroundMovementOffset = 3;
    this.createBackground();
  }

  createBackground() {
    this.backgroundElement = document.createElement('div');
    this.backgroundElement.classList.add('background');
    this.backgroundElement.style.background = 'url(images/background.gif)';
    this.backgroundElement.style.width = this.width + 'px';
    this.backgroundElement.style.height = this.height + 'px';
    this.backgroundElement.style.backgroundSize = 'cover';
    this.backgroundElement.style.position = 'absolute';
    this.backgroundElement.style.backgroundRepeat = 'repeat-y';
    this.parentElement.appendChild(this.backgroundElement);
  }

  move() {
    this.backgroundElement.style.backgroundPosition = '0 ' +
      (this.backgroundMovementCounter += this.backgroundMovementOffset) + 'px';
  }

}

export default Background;
