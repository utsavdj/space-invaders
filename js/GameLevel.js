class GameLevel {
  constructor() {
  }

  getLevel(level) {
    if (level === 1) {
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
              size: 'small',
              type: 'one'
            },
            {
              size: 'small',
              type: 'two'
            }
          ]
        },
        generateAlien: [{
          counter: 0,
          aliens: [
            {
              alienTypes: [{
                size: 'small',
                type: 'one',
                number: 1
              }],
              pattern: 'leftToPosition'
            },
            {
              alienTypes: [{
                size: 'small',
                type: 'two',
                number: 0
              }],
              pattern: 'rightToPosition'
            }
          ]
        }, {
          counter: 1000,
          aliens: [
            {
              alienTypes: [{
                size: 'medium',
                type: 'two',
                number: 0
              }],
              pattern: 'rightToPositionTwo'
            }
          ]
        }, {
          counter: 1500,
          aliens: [
            {
              alienTypes: [{
                size: 'medium',
                type: 'one',
                number: 0
              }],
              pattern: 'leftToPositionTwo'
            }
          ]
        }
        ]
      }
    }

  }
}

export default GameLevel;
