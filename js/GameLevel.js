import * as patternConstants from "../js/constants/patternConstants.js";
import * as alienTypeConstants from "../js/constants/alienTypeConstants.js";

class GameLevel {
  constructor(level) {
    this.level = level;
  }

  getLevel() {
    if (this.level === 1) {
      return {
        dropInterval: 1000,
        coinGenerationInterval: 100,
        noOfCoinsGenerated: 5,
        noOfAliensToShootToGenerateCoins: 2,
        boss: {
          pauseInterval: 200,
          pause: 100,
          moveDownPause: 200,
          moveDownFireRate: 6,
          moveDownUpto: 200,
          score: 1000
        },
        totalAliens: 1,
        randomAliens: {
          interval: 300,
          minimumNumber: 1,
          maximumNumber: 4,
          minimumPattern: 1,
          maximumPattern: 2,
          aliens: [
            {
              size: alienTypeConstants.SMALL,
              type: alienTypeConstants.ONE
            },
            {
              size: alienTypeConstants.SMALL,
              type: alienTypeConstants.TWO
            }
          ],
          patterns: [patternConstants.TOP_LEFT_TO_BOTTOM_RIGHT, patternConstants.TOP_RIGHT_TO_BOTTOM_LEFT,
            patternConstants.BOTTOM_LEFT_TO_TOP_RIGHT, patternConstants.BOTTOM_RIGHT_TO_TOP_LEFT,
            patternConstants.TOP_LEFT_TO_BOTTOM_LEFT, patternConstants.TOP_RIGHT_TO_BOTTOM_RIGHT,
            patternConstants.BOTTOM_LEFT_TO_TOP_LEFT, patternConstants.BOTTOM_RIGHT_TO_TOP_RIGHT]
        },
        generateAlien: [{
          counter: 0,
          aliens: [
            {
              alienTypes: [{
                size: alienTypeConstants.SMALL,
                type: alienTypeConstants.TWO,
                number: 1
              }],
              pattern: patternConstants.LEFT_TO_POSITION
            },
            {
              alienTypes: [{
                size: alienTypeConstants.LARGE,
                type: alienTypeConstants.ONE,
                number: 0
              }],
              pattern: patternConstants.RIGHT_TO_POSITION
            }
          ]
        }, {
          counter: 1000,
          aliens: [
            {
              alienTypes: [{
                size: alienTypeConstants.MEDIUM,
                type: alienTypeConstants.ONE,
                number: 0
              }],
              pattern: patternConstants.RIGHT_TO_POSITION_TWO
            }
          ]
        }, {
          counter: 1500,
          aliens: [
            {
              alienTypes: [{
                size: alienTypeConstants.MEDIUM,
                type: alienTypeConstants.TWO,
                number: 0
              }],
              pattern: patternConstants.LEFT_TO_POSITION_TWO
            }
          ]
        }
        ]
      }
    } else if (this.level === 2) {
      return {
        dropInterval: 1000,
        coinGenerationInterval: 100,
        noOfCoinsGenerated: 5,
        noOfAliensToShootToGenerateCoins: 2,
        boss: {
          pauseInterval: 200,
          pause: 100,
          moveDownPause: 200,
          moveDownFireRate: 6,
          moveDownUpto: 200,
          score: 1000
        },
        totalAliens: 1,
        randomAliens: {
          interval: 300,
          minimumNumber: 1,
          maximumNumber: 4,
          minimumPattern: 1,
          maximumPattern: 2,
          aliens: [
            {
              size: alienTypeConstants.SMALL,
              type: alienTypeConstants.ONE
            },
            {
              size: alienTypeConstants.SMALL,
              type: alienTypeConstants.TWO
            }
          ],
          patterns: [patternConstants.TOP_LEFT_TO_BOTTOM_RIGHT, patternConstants.TOP_RIGHT_TO_BOTTOM_LEFT,
            patternConstants.BOTTOM_LEFT_TO_TOP_RIGHT, patternConstants.BOTTOM_RIGHT_TO_TOP_LEFT,
            patternConstants.TOP_LEFT_TO_BOTTOM_LEFT, patternConstants.TOP_RIGHT_TO_BOTTOM_RIGHT,
            patternConstants.BOTTOM_LEFT_TO_TOP_LEFT, patternConstants.BOTTOM_RIGHT_TO_TOP_RIGHT]
        },
        generateAlien: [{
          counter: 0,
          aliens: [
            {
              alienTypes: [{
                size: alienTypeConstants.MEDIUM,
                type: alienTypeConstants.TWO,
                number: 3
              }],
              pattern: patternConstants.LEFT_TO_POSITION
            },
            {
              alienTypes: [{
                size: alienTypeConstants.LARGE,
                type: alienTypeConstants.ONE,
                number: 3
              }],
              pattern: patternConstants.RIGHT_TO_POSITION
            }
          ]
        }, {
          counter: 1000,
          aliens: [
            {
              alienTypes: [{
                size: alienTypeConstants.MEDIUM,
                type: alienTypeConstants.ONE,
                number: 0
              }],
              pattern: patternConstants.RIGHT_TO_POSITION_TWO
            }
          ]
        }, {
          counter: 1500,
          aliens: [
            {
              alienTypes: [{
                size: alienTypeConstants.MEDIUM,
                type: alienTypeConstants.TWO,
                number: 0
              }],
              pattern: patternConstants.LEFT_TO_POSITION_TWO
            }
          ]
        }
        ]
      }
    }

  }
}

export default GameLevel;
