class GameLevel {
  constructor() {
  }

  getLevel(level) {
    if (level === 1) {
      return {
        bossHealth: 6,
        generateAlien: [{
          counter: 100,
          aliens: [
            {
              alienTypes: [{
                size: 'small',
                type: 'one',
                number: 5
              }],
              pattern: 'leftToPosition'
            },
            {
              alienTypes: [{
                size: 'small',
                type: 'two',
                number: 5
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
                number: 5
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
                number: 5
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
