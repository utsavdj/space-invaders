class Common {
  constructor() {
    this.init();
  }

  init(){}

  createElement(tag, className = null, text = null) {
    var element = document.createElement(tag);
    if (className) {
      element.classList.add(className);
    }
    if (text) {
      element.innerText = text;
    }
    return element;
  }

  generateRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  playSound(src) {
    var sound = new Audio();
    sound.src = src;
    sound.play();
  }

  getTotalNumberOfAliens(settings) {
    var noOfAliens = 0;
    for (var i = 0; i < settings.length; i++) {
      for (var j = 0; j < settings[i].aliens.length; j++) {
        for (var k = 0; k < settings[i].aliens[j].alienTypes.length; k++) {
          noOfAliens += settings[i].aliens[j].alienTypes[k].number;
        }
      }
    }
    return noOfAliens;
  }

}

export default Common;
