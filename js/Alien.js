import Pattern from '../js/Pattern.js';

class Alien {
  constructor(parentElement) {
    this.parentElement = parentElement;
    this.init();
  }

  init() {
    this.width = 27;
    this.height = 44;
    this.isInPosition = false;
    this.isAllPatternComplete = false;
    this.isChildMoveDownPatternComplete = false;
    this.isMoveDownPatternComplete = false;
    this.isMovingDown = false;
    this.creationInterval = 0;
    this.moveDownInterval = 0;
    this.moveDownCounter = 0;
    this.movementCounter = 0;
    this.patternCounter = 0;
    this.finalPositionX = 0;
    this.finalPositionY = 0;
    this.moveOffset = 8;
    this.moveDirection = 1;
    this.positionY = -44;
    this.t = 0;
    this.tOffset = 0.01;
    this.isExploded = false;
    this.explosionCounter = 0;
    this.explosionInterval = 25;
    this.bulletDirectionY = -1;
    this.bulletFiredInterval = 100;
    this.isPlayerPositionSet = false;
    this.isRandom = false;
    this.health = 1;
    this.pattern = new Pattern();
  }

  createAlien(size, type, pattern = null, isChild = false, properties = null, parentPositionX = null, parentPositionY = null) {
    this.size = size;
    this.type = type;
    this.isChild = isChild;
    this.alienElement = document.createElement('div');
    this.alienElement.classList.add('alien');

    if (this.isChild) {
      this.parentAlienPositionX = parentPositionX;
      this.parentAlienPositionY = parentPositionY;

      this.properties = properties;
      this.patternStyle = this.properties.pattern;
      this.alienElement.style.width = this.properties.width + 'px';
      this.alienElement.style.height = this.properties.height + 'px';
    } else {
      this.patternStyle = pattern;
      this.properties = this.getAlienProperties(this.size, this.type);
      this.alienElement.style.width = this.width + 'px';
      this.alienElement.style.height = this.height + 'px';
    }
    this.alienElement.style.top = this.positionY + 'px';
    this.alienElement.style.position = 'absolute';
    this.alienElement.style.background = 'url(images/star-wars-sprite.png)';
    this.alienElement.style.backgroundPosition = this.properties.positionX + 'px ' + this.properties.positionY + 'px';
    this.parentElement.appendChild(this.alienElement);
    this.health = this.properties.health;
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

    if (Math.round(this.positionX - 1) === this.finalPositionX) {
      this.positionX = this.finalPositionX
    }

    if (Math.round(this.positionY - 1) === this.finalPositionY) {
      this.positionY = this.finalPositionY
    }

    if (Math.round(this.positionX) === this.finalPositionX && Math.round(this.positionY) === this.finalPositionY) {
      this.isInPosition = true;
      if (!this.isMoveDownPatternComplete) {
        this.t = 0;
        this.patternCounter = 0;
      }
    }
    this.drawToPosition();
  }

  move() {
    this.movementCounter++;
    if (this.movementCounter >= this.creationInterval) {
      if (!this.isAllPatternComplete) {
        this.coOrdinates = this.getPatternCoOrdinates();
        this.setPosition();
        this.draw();
      } else {
        if (!this.isInPosition) {
          this.setAlienInPosition();
        }else{
          var sidewaysMovementOffset = 20;
          if (this.movementCounter % sidewaysMovementOffset === 0) {
            this.moveX();
          }
        }
      }
    }
  }


  moveX() {
    if (this.moveDirection === 1) {
      this.moveDirection = -1;
      this.positionX = this.positionX + (this.moveDirection * this.moveOffset);
    } else {
      this.moveDirection = 1;
      this.positionX = this.positionX + (this.moveDirection * this.moveOffset);
    }
    this.alienElement.style.transition = '0.5s';
    this.draw();
  }

  setPosition() {
    this.positionX = this.coOrdinates.x;
    this.positionY = this.coOrdinates.y;
  }

  moveDown(playerPositionX) {
    this.moveDownCounter++;
    if (this.moveDownCounter >= this.moveDownInterval) {
      this.setPlayerPosition(playerPositionX);
      if (!this.isMoveDownPatternComplete) {
        this.isMovingDown = true;
        this.alienElement.style.transform = 'rotate(0deg)';
        this.alienElement.style.transition = 'transform 0.5s';
        this.coOrdinates = this.getMoveDownCoOrdinates();
        this.setPosition();
        this.draw();
      }
    }
  }

  moveAlienChild(playerPositionX) {
    if (!this.isChildMoveDownPatternComplete) {
      this.setPlayerPosition(playerPositionX);
      this.coOrdinates = this.getChildPatternCoOrdinates();
      if (this.coOrdinates) {
        this.setPosition();
        this.draw();
      }
    }
  }

  getChildPatternCoOrdinates() {
    if (this.t <= 1) {
      this.t += this.tOffset;
    } else {
      if (this.patternCounter >= this.pattern.getAlienChildPatterns(this.parentAlienPositionX,
        this.parentAlienPositionY, this.playerPositionX)[this.properties.pattern].length - 1) {
        this.isChildMoveDownPatternComplete = true;
      }

      if (this.pattern.getAlienChildPatterns(this.parentAlienPositionX, this.parentAlienPositionY,
        this.playerPositionX)[this.properties.pattern].length > 1 &&
        !this.isChildMoveDownPatternComplete) {
        this.patternCounter++;
        this.t = 0;
      }
    }
    if (!this.isChildMoveDownPatternComplete) {
      return this.pattern.generateCoOrdinates(this.t, this.pattern.getAlienChildPatterns(this.parentAlienPositionX,
        this.parentAlienPositionY, this.playerPositionX)[this.properties.pattern][this.patternCounter]);
    }
  }

  setPlayerPosition(playerPositionX) {
    if (!this.isPlayerPositionSet) {
      this.isPlayerPositionSet = true;
      this.playerPositionX = playerPositionX;
    }
  }

  drawToPosition() {
    this.alienElement.style.transform = 'rotate(180deg)';
    this.alienElement.style.transition = 'transform 0.5s';
    this.alienElement.style.left = this.positionX + 'px';
    this.alienElement.style.top = this.positionY + 'px';
  }

  draw() {
    this.alienElement.style.left = this.positionX + 'px';
    this.alienElement.style.top = this.positionY + 'px';
  }

  getPatternCoOrdinates() {
    var pattern = null;
    var gameWidth = this.parentElement.offsetWidth;
    var gameCenterPositionX = gameWidth / 2;
    var gameHeight = this.parentElement.offsetHeight;
    if (!this.isChild) {
      pattern = this.pattern.getPatterns(gameCenterPositionX, gameHeight, this.height)[this.patternStyle];
    } else {
      pattern = this.pattern.getAlienChildPatterns(this.positionX, this.positionY)[this.patternStyle];
    }

    if (this.t <= 1) {
      this.t += this.tOffset;
    } else {
      if (this.patternCounter >= pattern.length - 1) {
        this.isAllPatternComplete = true;
      }

      if (pattern.length > 1 && !this.isAllPatternComplete) {
        this.patternCounter++;
        this.t = 0;
      }
    }

    return this.pattern.generateCoOrdinates(this.t, pattern[this.patternCounter]);
  }

  getMoveDownCoOrdinates() {
    if (this.t <= 1) {
      this.t += this.tOffset;
    } else {
      if (this.patternCounter >= this.pattern.moveDownPatterns(this.finalPositionX, this.finalPositionY).length - 1) {
        this.isMoveDownPatternComplete = true;
        this.isMovingDown = false;
        this.isInPosition = false;
      }

      if (this.pattern.moveDownPatterns(this.finalPositionX, this.finalPositionY).length > 1 &&
        !this.isMoveDownPatternComplete) {
        this.patternCounter++;
        this.t = 0;
      }
    }
    return this.pattern.generateCoOrdinates(this.t, this.pattern.moveDownPatterns(this.playerPositionX, this.finalPositionX,
      this.finalPositionY)[this.patternCounter]);
  }

  checkCollision(player) {
    return this.positionX < player.positionX + player.width &&
      this.positionX + this.width > player.positionX &&
      this.positionY < player.positionY + player.height &&
      this.positionY + this.height > player.positionY
  }

  explode() {
    var positionX = -50;
    var positionY = -44;
    if (this.isChild) {
      positionX = -113;
      positionY = -44;
    }
    this.alienElement.style.transition = 'none';
    this.alienElement.style.backgroundPosition = positionX + 'px ' + positionY + 'px';
  }

  checkIsPlayerClose(playerPositionX) {
    if (this.positionX < playerPositionX && this.positionX + this.width > playerPositionX) {
      return true;
    }
  }

  getAlienProperties(size, type) {
    for (var i = 0; i < this.aliens().length; i++) {
      var types = this.aliens()[i][size];
      if (types) {
        for (var j = 0; j < types.length; j++) {
          if (types[j][type]) {
            return types[j][type];
          }
        }
      }
    }
  }

  aliens() {
    return [{
      small: [{
        one: {
          positionX: -50,
          positionY: 0,
          score: 10,
          health: 1,
          weapon: 'normal'
        },
        two: {
          positionX: -104,
          positionY: 0,
          score: 10,
          health: 2,
          weapon: 'normal'
        }
      }]
    }, {
      medium: [{
        one: {
          positionX: -77,
          positionY: 0,
          score: 20,
          health: 2,
          weapon: 'normal',
          special: 're-generate',
          children: [
            {
              positionX: -77,
              positionY: -44,
              score: 25,
              health: 1,
              weapon: 'shield-breaker',
              width: 18,
              height: 30,
              pattern: 'childLeftToDown'
            },
            {
              positionX: -77,
              positionY: -44,
              score: 25,
              health: 1,
              weapon: 'shield-breaker',
              width: 18,
              height: 30,
              pattern: 'childRightToDown'
            }
          ]
        },
        two: {
          positionX: -158,
          positionY: 0,
          score: 20,
          health: 1,
          weapon: 'normal',
          special: 're-generate',
          children: [
            {
              positionX: -95,
              positionY: -44,
              score: 25,
              health: 2,
              weapon: 'normal',
              width: 18,
              height: 30,
              pattern: 'childLeftToDown'
            },
            {
              positionX: -95,
              positionY: -44,
              score: 25,
              health: 2,
              weapon: 'normal',
              width: 18,
              height: 30,
              pattern: 'childRightToDown'
            }
          ]
        }
      }]
    },{
      large: [{
        one: {
          positionX: -131,
          positionY: 0,
          score: 30,
          health: 3,
          weapon: 'spread'
        },
        two: {
          positionX: -185,
          positionY: 0,
          score: 30,
          health: 3,
          weapon: 'shield-breaker'
        }
      }]
    }];
  }
}

export default Alien;
