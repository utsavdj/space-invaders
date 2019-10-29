class Score {
  constructor() {
    this.init();
  }

  init(){}

  createScores(buttonsContainer, level, score, hiScore, createElement){
    var scoreTextElement = createElement('div', 'level-text', 'Level ' + level);
    buttonsContainer.appendChild(scoreTextElement);
    var scoreTextElement = createElement('div', 'score-text', 'Score');
    buttonsContainer.appendChild(scoreTextElement);
    var scoreElement = createElement('div', 'score', score.toString());
    buttonsContainer.appendChild(scoreElement);
    var hiScoreTextElement = createElement('div', 'hi-score-text', 'Hi Score');
    buttonsContainer.appendChild(hiScoreTextElement);
    var hiScoreElement = createElement('div', 'hi-score', hiScore.toString());
    buttonsContainer.appendChild(hiScoreElement);

    return scoreElement;
  }

}

export default Score;
