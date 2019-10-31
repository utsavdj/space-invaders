import {ROWS, COLS} from "../js/constants/gameConstants.js";

class Pattern {
  constructor() {
  }

  generateCoOrdinates(t, pattern) {
    var x = (Math.pow((1-t), 3) * pattern.p1.x) + (3 *  Math.pow((1-t), 2) * t * pattern.p2.x) +
      (3 * (1-t) * Math.pow(t, 2) * pattern.p3.x) + (Math.pow(t, 3) * pattern.p4.x);
    var y = (Math.pow((1-t), 3) * pattern.p1.y) + (3 *  Math.pow((1-t), 2) * t * pattern.p2.y) +
      (3 * (1-t) * Math.pow(t, 2) * pattern.p3.y) + (Math.pow(t, 3) * pattern.p4.y);

    return {x: x, y: y};
  }

  moveDownPatterns(playerRecentPositionX, positionX, positionY) {
    return [{
      p1: {x: positionX, y: positionY},
      p2: {x: positionX, y: positionY - 40},
      p3: {x: positionX + 50, y: positionY - 40},
      p4: {x: positionX + 50, y: positionY}
    }, {
      p1: {x: positionX + 50, y: positionY},
      p2: {x: positionX, y: positionY + 80},
      p3: {x: playerRecentPositionX, y: positionY - 40},
      p4: {x: playerRecentPositionX, y: positionY + 200}
    }]
  }

  getAlienPositionAndInterval(){
    var numCols = COLS;
    var numRows = ROWS;
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

  getPatterns(gameCenterPositionX, gameHeight, alienHeight){
    return {
      test: [{
        p1: {x: 250, y: 350},
        p2: {x: 250, y: 350},
        p3: {x: 250, y: 350},
        p4: {x: 250, y: 350}
      }],
      leftToPosition: [{
        p1: {x: gameCenterPositionX - 55, y: -alienHeight},
        p2: {x: gameCenterPositionX - 45, y: 20},
        p3: {x: gameCenterPositionX - 120, y: 320},
        p4: {x: gameCenterPositionX - 120, y: 350}
      }, {
        p1: {x: gameCenterPositionX - 120, y: 350},
        p2: {x: gameCenterPositionX - 120, y: 550},
        p3: {x: gameCenterPositionX - 520, y: 550},
        p4: {x: gameCenterPositionX - 520, y: 350}
      }, {
        p1: {x: gameCenterPositionX - 520, y: 350},
        p2: {x: gameCenterPositionX - 520, y: 150},
        p3: {x: gameCenterPositionX - 120, y: 150},
        p4: {x: gameCenterPositionX - 120, y: 350}
      }, {
        p1: {x: gameCenterPositionX - 120, y: 350},
        p2: {x: gameCenterPositionX - 120, y: 445},
        p3: {x: gameCenterPositionX - 50, y: 445},
        p4: {x: gameCenterPositionX - 50, y: 350}
      }],
      rightToPosition: [{
        p1: {x: gameCenterPositionX + 55, y: -alienHeight},
        p2: {x: gameCenterPositionX + 45, y: 20},
        p3: {x: gameCenterPositionX + 120, y: 320},
        p4: {x: gameCenterPositionX + 120, y: 350}
      }, {
        p1: {x: gameCenterPositionX + 120, y: 350},
        p2: {x: gameCenterPositionX + 120, y: 550},
        p3: {x: gameCenterPositionX + 520, y: 550},
        p4: {x: gameCenterPositionX + 520, y: 350}
      }, {
        p1: {x: gameCenterPositionX + 520, y: 350},
        p2: {x: gameCenterPositionX + 520, y: 150},
        p3: {x: gameCenterPositionX + 120, y: 150},
        p4: {x: gameCenterPositionX + 120, y: 350}
      }, {
        p1: {x: gameCenterPositionX + 120, y: 350},
        p2: {x: gameCenterPositionX + 120, y: 445},
        p3: {x: gameCenterPositionX + 50, y: 445},
        p4: {x: gameCenterPositionX + 50, y: 350}
      }],
      leftToPositionTwo: [{
        p1: {x: gameCenterPositionX - 55, y: -alienHeight},
        p2: {x: gameCenterPositionX - 55, y: 100},
        p3: {x: gameCenterPositionX - 220, y: 125},
        p4: {x: gameCenterPositionX - 220, y: 225}
      }, {
        p1: {x: gameCenterPositionX - 220, y: 225},
        p2: {x: gameCenterPositionX - 220, y: 450},
        p3: {x: gameCenterPositionX - 55, y: 450},
        p4: {x: gameCenterPositionX - 55, y: 225}
      }],
      rightToPositionTwo: [{
        p1: {x: gameCenterPositionX + 55, y: -alienHeight},
        p2: {x: gameCenterPositionX + 55, y: 100},
        p3: {x: gameCenterPositionX + 220, y: 125},
        p4: {x: gameCenterPositionX + 220, y: 225}
      }, {
        p1: {x: gameCenterPositionX + 220, y: 225},
        p2: {x: gameCenterPositionX + 220, y: 450},
        p3: {x: gameCenterPositionX + 55, y: 450},
        p4: {x: gameCenterPositionX + 55, y: 225}
      }],
      topLeftToBottomRight: [{
        p1: {x: gameCenterPositionX - 55, y: -alienHeight},
        p2: {x: gameCenterPositionX - 45, y: 20},
        p3: {x: gameCenterPositionX - 190, y: 310},
        p4: {x: gameCenterPositionX - 190, y: 350}
      },{
        p1: {x: gameCenterPositionX - 190, y: 350},
        p2: {x: gameCenterPositionX - 190, y: 445},
        p3: {x: gameCenterPositionX + 10, y: 445},
        p4: {x: gameCenterPositionX + 10, y: 350}
      },{
        p1: {x: gameCenterPositionX + 10, y: 350},
        p2: {x: gameCenterPositionX + 10, y: 230},
        p3: {x: gameCenterPositionX - 190, y: 230},
        p4: {x: gameCenterPositionX - 190, y: 350}
      },{
        p1: {x: gameCenterPositionX - 190, y: 350},
        p2: {x: gameCenterPositionX - 190, y: 455},
        p3: {x: gameCenterPositionX + 170, y: 460},
        p4: {x: gameCenterPositionX + 170, y: gameHeight + alienHeight}
      }],
      topRightToBottomLeft: [{
        p1: {x: gameCenterPositionX + 55, y: -alienHeight},
        p2: {x: gameCenterPositionX + 45, y: 20},
        p3: {x: gameCenterPositionX + 190, y: 310},
        p4: {x: gameCenterPositionX + 190, y: 350}
      },{
        p1: {x: gameCenterPositionX + 190, y: 350},
        p2: {x: gameCenterPositionX + 190, y: 445},
        p3: {x: gameCenterPositionX - 10, y: 445},
        p4: {x: gameCenterPositionX - 10, y: 350}
      },{
        p1: {x: gameCenterPositionX - 10, y: 350},
        p2: {x: gameCenterPositionX - 10, y: 230},
        p3: {x: gameCenterPositionX + 190, y: 230},
        p4: {x: gameCenterPositionX + 190, y: 350}
      },{
        p1: {x: gameCenterPositionX + 190, y: 350},
        p2: {x: gameCenterPositionX + 190, y: 455},
        p3: {x: gameCenterPositionX - 170, y: 460},
        p4: {x: gameCenterPositionX - 170, y: gameHeight + alienHeight}
      }],
      bottomLeftToTopRight: [{
        p1: {x: gameCenterPositionX - 55, y: gameHeight + alienHeight},
        p2: {x: gameCenterPositionX - 45, y: 460},
        p3: {x: gameCenterPositionX - 190, y: 455},
        p4: {x: gameCenterPositionX - 190, y: 350}
      },{
        p1: {x: gameCenterPositionX - 190, y: 350},
        p2: {x: gameCenterPositionX - 190, y: 100},
        p3: {x: gameCenterPositionX + 10, y: 100},
        p4: {x: gameCenterPositionX + 10, y: 350}
      },{
        p1: {x: gameCenterPositionX + 10, y: 350},
        p2: {x: gameCenterPositionX + 10, y: 440},
        p3: {x: gameCenterPositionX - 190, y: 440},
        p4: {x: gameCenterPositionX - 190, y: 350}
      },{
        p1: {x: gameCenterPositionX - 190, y: 350},
        p2: {x: gameCenterPositionX - 190, y: 310},
        p3: {x: gameCenterPositionX + 170, y: 20},
        p4: {x: gameCenterPositionX + 170, y: -alienHeight}
      }],
      bottomRightToTopLeft: [{
        p1: {x: gameCenterPositionX + 55, y: gameHeight + alienHeight},
        p2: {x: gameCenterPositionX + 45, y: 460},
        p3: {x: gameCenterPositionX + 190, y: 455},
        p4: {x: gameCenterPositionX + 190, y: 350}
      },{
        p1: {x: gameCenterPositionX + 190, y: 350},
        p2: {x: gameCenterPositionX + 190, y: 100},
        p3: {x: gameCenterPositionX - 10, y: 100},
        p4: {x: gameCenterPositionX - 10, y: 350}
      },{
        p1: {x: gameCenterPositionX - 10, y: 350},
        p2: {x: gameCenterPositionX - 10, y: 440},
        p3: {x: gameCenterPositionX + 190, y: 440},
        p4: {x: gameCenterPositionX + 190, y: 350}
      },{
        p1: {x: gameCenterPositionX + 190, y: 350},
        p2: {x: gameCenterPositionX + 190, y: 310},
        p3: {x: gameCenterPositionX - 170, y: 20},
        p4: {x: gameCenterPositionX - 170, y: -alienHeight}
      }],
      topLeftToBottomLeft: [{
        p1: {x: gameCenterPositionX - 190, y: -alienHeight},
        p2: {x: gameCenterPositionX - 70, y: 45},
        p3: {x: gameCenterPositionX + 40, y: 205},
        p4: {x: gameCenterPositionX + 40, y: 200}
      },{
        p1: {x: gameCenterPositionX + 40, y: 200},
        p2: {x: gameCenterPositionX + 35, y: 330},
        p3: {x: gameCenterPositionX - 100, y: 500},
        p4: {x: gameCenterPositionX - 190, y: gameHeight + alienHeight}
      }],
      topRightToBottomRight: [{
        p1: {x: gameCenterPositionX + 190, y: -alienHeight},
        p2: {x: gameCenterPositionX + 70, y: 45},
        p3: {x: gameCenterPositionX - 40, y: 205},
        p4: {x: gameCenterPositionX - 40, y: 200}
      },{
        p1: {x: gameCenterPositionX - 40, y: 200},
        p2: {x: gameCenterPositionX - 35, y: 330},
        p3: {x: gameCenterPositionX + 100, y: 500},
        p4: {x: gameCenterPositionX + 190, y: gameHeight + alienHeight}
      }],
      bottomLeftToTopLeft: [{
        p1: {x: gameCenterPositionX - 190, y: gameHeight + alienHeight},
        p2: {x: gameCenterPositionX - 70, y: 500},
        p3: {x: gameCenterPositionX + 40, y: 330},
        p4: {x: gameCenterPositionX + 40, y: 200}
      },{
        p1: {x: gameCenterPositionX + 40, y: 200},
        p2: {x: gameCenterPositionX + 40, y: 205},
        p3: {x: gameCenterPositionX - 70, y: 45},
        p4: {x: gameCenterPositionX - 190, y: -alienHeight}
      }],
      bottomRightToTopRight: [{
        p1: {x: gameCenterPositionX + 190, y: gameHeight + alienHeight},
        p2: {x: gameCenterPositionX + 70, y: 500},
        p3: {x: gameCenterPositionX - 40, y: 330},
        p4: {x: gameCenterPositionX - 40, y: 200}
      },{
        p1: {x: gameCenterPositionX - 40, y: 200},
        p2: {x: gameCenterPositionX - 40, y: 205},
        p3: {x: gameCenterPositionX + 70, y: 45},
        p4: {x: gameCenterPositionX + 190, y: -alienHeight}
      }]
    };
  }

  getAlienChildPatterns(positionX, positionY, playerRecentPositionX){
    return {
      childLeftToDown: [{
        p1: {x: positionX, y: positionY},
        p2: {x: positionX, y: positionY-40},
        p3: {x: positionX+50, y: positionY-40},
        p4: {x: positionX+50, y: positionY}
      }, {
        p1: {x: positionX + 50, y: positionY},
        p2: {x: positionX, y: positionY + 80},
        p3: {x: playerRecentPositionX, y: positionY - 40},
        p4: {x: playerRecentPositionX+50, y: positionY + 200}
      }, {
        p1: {x: playerRecentPositionX+50, y: positionY + 200},
        p2: {x: playerRecentPositionX+50, y: positionY + 300},
        p3: {x: playerRecentPositionX-150, y: positionY + 300},
        p4: {x: playerRecentPositionX-150, y: positionY + 200}
      }, {
        p1: {x: playerRecentPositionX-150, y: positionY + 200},
        p2: {x: playerRecentPositionX-150, y: positionY - 230},
        p3: {x: playerRecentPositionX+130, y: positionY + 370},
        p4: {x: playerRecentPositionX+180, y: -44}
      }],
      childRightToDown: [{
        p1: {x: positionX, y: positionY},
        p2: {x: positionX, y: positionY-40},
        p3: {x: positionX-50, y: positionY-40},
        p4: {x: positionX-50, y: positionY}
      }, {
        p1: {x: positionX - 50, y: positionY},
        p2: {x: positionX, y: positionY + 80},
        p3: {x: playerRecentPositionX, y: positionY - 40},
        p4: {x: playerRecentPositionX-50, y: positionY + 200}
      }, {
        p1: {x: playerRecentPositionX-50, y: positionY + 200},
        p2: {x: playerRecentPositionX-50, y: positionY + 300},
        p3: {x: playerRecentPositionX+150, y: positionY + 300},
        p4: {x: playerRecentPositionX+150, y: positionY + 200}
      }, {
        p1: {x: playerRecentPositionX+150, y: positionY + 200},
        p2: {x: playerRecentPositionX+150, y: positionY - 230},
        p3: {x: playerRecentPositionX-130, y: positionY + 370},
        p4: {x: playerRecentPositionX-180, y: -44}
      }]
    }
  }
}

export default Pattern;
