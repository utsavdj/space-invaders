class Pattern {
  constructor() {
  }

  generateCoOrdinates(t, pattern) {
    let cX = 3 * (pattern.p1.x - pattern.p0.x),
      bX = 3 * (pattern.p2.x - pattern.p1.x) - cX,
      aX = pattern.p3.x - pattern.p0.x - cX - bX;

    let cY = 3 * (pattern.p1.y - pattern.p0.y),
      bY = 3 * (pattern.p2.y - pattern.p1.y) - cY,
      aY = pattern.p3.y - pattern.p0.y - cY - bY;

    let x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + pattern.p0.x;
    let y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + pattern.p0.y;

    return {x: x, y: y};
  }

  moveDownPatterns(playerRecentPositionX, positionX, positionY) {
    this.currentPositionX = positionX;
    this.currentPositionY = positionY;
    return [{
      p0: {x: this.currentPositionX, y: this.currentPositionY},
      p1: {x: this.currentPositionX, y: this.currentPositionY - 40},
      p2: {x: this.currentPositionX + 50, y: this.currentPositionY - 40},
      p3: {x: this.currentPositionX + 50, y: this.currentPositionY}
    }, {
      p0: {x: this.currentPositionX + 50, y: this.currentPositionY},
      p1: {x: this.currentPositionX, y: this.currentPositionY + 80},
      p2: {x: playerRecentPositionX, y: this.currentPositionY - 40},
      p3: {x: playerRecentPositionX, y: this.currentPositionY + 200}
    }]
  }

  getAlienPositionAndInterval(){
    var numCols = 10;
    var numRows = 2;
    var xCounter = numCols/2;
    var array = [];
    var col = 0;
    var interval = numCols;
    var row = 0;

    for(var j = 0; j < numRows; j++) {
      for (var i = 0; i < xCounter; i++) {
        col = xCounter + (i + 1);
        array.push({x: col, y: j, interval: interval});
        interval -= 1;
        col = xCounter - i;
        row += 1;
        array.push({x: col, y: j, interval: interval});
        row = 0;
        interval -= 1;
      }
    }

    return array;
  }

  getPatterns(){
    return {
      leftToPosition: [{
        p0: {x: 215, y: -44},
        p1: {x: 225, y: 20},
        p2: {x: 150, y: 320},
        p3: {x: 150, y: 350}
      }, {
        p0: {x: 150, y: 350},
        p1: {x: 150, y: 550},
        p2: {x: -250, y: 550},
        p3: {x: -250, y: 350}
      }, {
        p0: {x: -250, y: 350},
        p1: {x: -250, y: 150},
        p2: {x: 150, y: 150},
        p3: {x: 150, y: 350}
      }, {
        p0: {x: 150, y: 350},
        p1: {x: 150, y: 445},
        p2: {x: 220, y: 445},
        p3: {x: 220, y: 350}
      }],
      rightToPosition: [{
        p0: {x: 315, y: -44},
        p1: {x: 315, y: 20},
        p2: {x: 390, y: 320},
        p3: {x: 390, y: 350}
      }, {
        p0: {x: 390, y: 350},
        p1: {x: 390, y: 550},
        p2: {x: 790, y: 550},
        p3: {x: 790, y: 350}
      }, {
        p0: {x: 790, y: 350},
        p1: {x: 790, y: 150},
        p2: {x: 390, y: 150},
        p3: {x: 390, y: 350}
      }, {
        p0: {x: 390, y: 350},
        p1: {x: 390, y: 445},
        p2: {x: 320, y: 445},
        p3: {x: 320, y: 350}
      }],
      leftToPositionTwo: [{
        p0: {x: 215, y: -44},
        p1: {x: 215, y: 100},
        p2: {x: 50, y: 125},
        p3: {x: 50, y: 225}
      }, {
        p0: {x: 50, y: 225},
        p1: {x: 50, y: 450},
        p2: {x: 215, y: 450},
        p3: {x: 215, y: 225}
      }],
      rightToPositionTwo: [{
        p0: {x: 315, y: -44},
        p1: {x: 315, y: 100},
        p2: {x: 480, y: 125},
        p3: {x: 480, y: 225}
      }, {
        p0: {x: 480, y: 225},
        p1: {x: 480, y: 450},
        p2: {x: 315, y: 450},
        p3: {x: 315, y: 225}
      }]
    };
  }

  getAlienChildPatterns(positionX, positionY, playerRecentPositionX){
    return {
      childLeftToDown: [{
        p0: {x: positionX, y: positionY},
        p1: {x: positionX, y: positionY-40},
        p2: {x: positionX+50, y: positionY-40},
        p3: {x: positionX+50, y: positionY}
      }, {
        p0: {x: positionX + 50, y: positionY},
        p1: {x: positionX, y: positionY + 80},
        p2: {x: playerRecentPositionX, y: positionY - 40},
        p3: {x: playerRecentPositionX+50, y: positionY + 200}
      }, {
        p0: {x: playerRecentPositionX+50, y: positionY + 200},
        p1: {x: playerRecentPositionX+50, y: positionY + 300},
        p2: {x: playerRecentPositionX-150, y: positionY + 300},
        p3: {x: playerRecentPositionX-150, y: positionY + 200}
      }, {
        p0: {x: playerRecentPositionX-150, y: positionY + 200},
        p1: {x: playerRecentPositionX-150, y: positionY - 230},
        p2: {x: playerRecentPositionX+130, y: positionY + 370},
        p3: {x: playerRecentPositionX+180, y: -44}
      }],
      childRightToDown: [{
        p0: {x: positionX, y: positionY},
        p1: {x: positionX, y: positionY-40},
        p2: {x: positionX-50, y: positionY-40},
        p3: {x: positionX-50, y: positionY}
      }, {
        p0: {x: positionX - 50, y: positionY},
        p1: {x: positionX, y: positionY + 80},
        p2: {x: playerRecentPositionX, y: positionY - 40},
        p3: {x: playerRecentPositionX-50, y: positionY + 200}
      }, {
        p0: {x: playerRecentPositionX-50, y: positionY + 200},
        p1: {x: playerRecentPositionX-50, y: positionY + 300},
        p2: {x: playerRecentPositionX+150, y: positionY + 300},
        p3: {x: playerRecentPositionX+150, y: positionY + 200}
      }, {
        p0: {x: playerRecentPositionX+150, y: positionY + 200},
        p1: {x: playerRecentPositionX+150, y: positionY - 230},
        p2: {x: playerRecentPositionX-130, y: positionY + 370},
        p3: {x: playerRecentPositionX-180, y: -44}
      }]
    }
  }
}

export default Pattern;
