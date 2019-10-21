import Background from '../js/Background.js';
import Player from '../js/Player.js';
import Alien from '../js/Alien.js';
import Pattern from '../js/Pattern.js';
import Position from '../js/Position.js';

class Game {
  constructor(gameId) {
    this.parentElement = document.getElementById(gameId);
    this.background = new Background(this.parentElement);
    this.player = new Player(this.parentElement);
    this.aliens = [];
    this.keyState = {};
    this.position = new Position();
    this.numberOfAliens = 10;
    this.counter = 0;
    this.alienCreationCounter = 0;
    this.alienCreationInterval = 0;
    this.alienCreationIntervalOffset = 15;
    this.checkKeyPress();
    window.requestAnimationFrame(this.render.bind(this));
  }

  render() {
    this.background.move();
    this.assignKeys();
    if(this.counter < this.numberOfAliens) {
      this.alienCreationCounter++;
      this.createAliens();
      this.alien.finalPositionX = 84 + (this.alien.width * this.alienCreationCounter + (this.alienCreationCounter*10));
      this.alien.finalPositionY = 93 + ((this.alien.height + 10) * 4);
    }
    for (let i = 0; i < this.aliens.length; i++) {
      this.aliens[i].move();
    }
    this.counter++;
    window.requestAnimationFrame(this.render.bind(this));
  }

  createAliens() {
    this.alien = new Alien(this.parentElement);
    this.alien.creationInterval = this.alienCreationInterval;
    this.aliens.push(this.alien);
    this.alienCreationInterval += this.alienCreationIntervalOffset;
  }

  assignKeys() {
    if (this.keyState['ArrowLeft'] || this.keyState['KeyA']) {
      if (this.player.positionX >= 5) {
        this.player.move(-5, 0);
        console.log(this.aliens);
      }
    } else if (this.keyState['ArrowRight'] || this.keyState['KeyD']) {
      if (this.player.positionX <= this.background.width - this.player.width - 5) {
        this.player.move(5, 0);
      }
    } else if (this.keyState['ArrowUp'] || this.keyState['KeyW']) {
      if (this.player.positionY >= 5) {
        this.player.move(0, -5);
      }
    } else if (this.keyState['ArrowDown'] || this.keyState['KeyS']) {
      if (this.player.positionY <= this.background.height - this.player.height - 6) {
        this.player.move(0, 5);
      }
    } else if (this.keyState['space'] || this.keyState['Enter']) {
      // if (isKeyPressed) {
      //   return;
      // }

    }
  }

  checkKeyPress() {
    let isKeyPressed = false;
    document.onkeydown = event => {

      isKeyPressed = true;
      const control = event.code;
      this.keyState[control] = true;
    };

    // check key if key is pressed if pressed prevent unlimited press
    document.onkeyup = event => {
      this.player.playerElement.style.transform = 'rotate(0deg)';
      isKeyPressed = false;
      const control = event.code;
      this.keyState[control] = false;
      if (control === 'Space') {
      }
    };
  }

  playSound(src) {
    const sound = new Audio();
    sound.src = src;
    sound.play();
  }
}

export default Game;
