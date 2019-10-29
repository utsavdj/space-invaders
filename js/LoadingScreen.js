class LoadingScreen {
  constructor(createElement) {
    this.createElement = createElement;
    this.init();
  }

  init(){}

  createLoadingScreen(parentElement) {
    this.loadingScreenElement = this.createElement('div', 'loading-screen');
    parentElement.appendChild(this.loadingScreenElement);

    var loadingScreenContainer = this.createElement('div', 'loading-screen-container');
    this.loadingScreenElement.appendChild(loadingScreenContainer);

    var loadingTextElement = this.createElement('div', 'loading-text', 'Loading...');
    loadingScreenContainer.appendChild(loadingTextElement);

    var loadingScreenElement = this.createElement('div', 'loader');
    loadingScreenContainer.appendChild(loadingScreenElement);
  }

}

export default LoadingScreen;
