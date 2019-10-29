class GameOver {
  constructor() {
    this.init();
  }

  init(){}

  createGameOverElement(commonFunctions, gameElement) {
    var gameOverElement = commonFunctions.createElement('div', 'game-over');
    gameOverElement.style.zIndex = '20';
    gameOverElement.style.position = 'absolute';
    gameElement.appendChild(gameOverElement);

    var gameOverTextElement = commonFunctions.createElement('p', 'game-over-text', 'Game Over');
    gameOverElement.appendChild(gameOverTextElement);
  }
}

export default GameOver;
