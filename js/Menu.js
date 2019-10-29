class Menu {
  constructor(createElement) {
    this.createElement = createElement;
    this.init();
  }

  init(){}

  createMenu(parentElement) {
    var menuContainer = this.createElement('div', 'menu-container');
    parentElement.prepend(menuContainer);

    var menuTextElement = this.createElement('div', 'menu-main-text', 'Star InVaders');
    menuContainer.appendChild(menuTextElement);

    var instructionList = this.createElement('ul', 'instructions');
    menuContainer.appendChild(instructionList);

    var instructions = ['Press Left Arrow Key or A to Move Left', 'Press Right Arrow Key or D to Move Right',
      'Press ENTER or SPACE to shoot'];
    for (var i = 0; i < instructions.length; i++) {
      var instruction = this.createElement('li', null, instructions[i]);
      instructionList.appendChild(instruction);
    }

    var startButton = this.createElement('button', 'start-btn', 'Start Game');
    menuContainer.appendChild(startButton);
  }

}

export default Menu;
