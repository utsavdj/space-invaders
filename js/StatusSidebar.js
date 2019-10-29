class StatusSidebar {
  constructor(createElement) {
    this.createElement = createElement;
    this.init();
  }

  init(){}

  createStatusSideBar(gameContainer, gameContainerHeight) {
    this.statusSideBarElement = this.createElement('div', 'status-container');
    this.statusSideBarElement.style.height = gameContainerHeight + 'px';
    gameContainer.appendChild(this.statusSideBarElement);
  }

  createStatusContainer(className, text) {
    var containerElement = this.createElement('div', className + '-container');
    this.statusSideBarElement.appendChild(containerElement);

    var textElement = this.createElement('p', className + '-text', text);
    containerElement.appendChild(textElement);

    this.createStatus(containerElement, className, className + '-health', 'Health');
    this.createStatus(containerElement, className, className + '-shield', 'Shield');
  }

  createInnerContainer(containerElement, className) {
    var innerContainerWidth = 70;
    var innerContainerElement = this.createElement('div', className + '-inner-container');
    innerContainerElement.style.width = innerContainerWidth + 'px';
    containerElement.appendChild(innerContainerElement);

    return innerContainerElement;
  }

  createStatus(containerElement, innerContainerClassName, className, text) {
    var statusHeight = 120;
    var statusWidth = 20;
    var statusText = this.createElement('p', className + '-text', text);
    var innerContainerElement = this.createInnerContainer(containerElement, innerContainerClassName);
    innerContainerElement.appendChild(statusText);

    var statusContainerElement = this.createElement('div', className + '-container');
    statusContainerElement.style.height = statusHeight + 'px';
    statusContainerElement.style.width = statusWidth + 'px';
    innerContainerElement.appendChild(statusContainerElement);

    var statusElement = this.createElement('div', className);
    statusElement.style.height = statusHeight + 'px';
    statusElement.style.width = statusWidth + 'px';
    if(className === 'player-shield'){
      statusElement.style.top = statusHeight + 'px';
    }
    statusContainerElement.appendChild(statusElement);
  }
}

export default StatusSidebar;
