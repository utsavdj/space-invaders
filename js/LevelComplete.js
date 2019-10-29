class LevelComplete {
  constructor() {
    this.init();
  }

  init(){}

  createLevelCompleteElement(gameElement, createElement, level) {
    var levelCompleteElement = createElement('div', 'level-complete');
    levelCompleteElement.style.zIndex = '20';
    levelCompleteElement.style.position = 'absolute';
    gameElement.appendChild(levelCompleteElement);

    var levelCompleteTextElement = createElement('p', 'level-complete-text',
      'Level ' + level + ' Complete');
    levelCompleteElement.appendChild(levelCompleteTextElement);

    var continueButton = createElement('button', 'continue-btn', 'Continue');
    levelCompleteElement.appendChild(continueButton);
  }
}

export default LevelComplete;
