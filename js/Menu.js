import {NO_OF_LEVELS} from "../js/constants/gameConstants.js";

class Menu {
  constructor(createElement) {
    this.createElement = createElement;
    this.init();
  }

  init() {
  }

  createMenu(parentElement) {
    let menuContainer = this.createElement('div', 'menu-container');
    parentElement.prepend(menuContainer);

    let menuTextElement = this.createElement('div', 'menu-main-text', 'Star InVaders');
    menuContainer.appendChild(menuTextElement);

    let instructionList = this.createElement('ul', 'instructions');
    menuContainer.appendChild(instructionList);

    let instructions = ['Press Left Arrow Key or A to Move Left', 'Press Right Arrow Key or D to Move Right',
      'Press Up Arrow Key or W to Move Up', 'Press Down Arrow Key or S to Move Down',
      'Press ENTER or SPACE to shoot'];
    for (let i = 0; i < instructions.length; i++) {
      let instruction = this.createElement('li', null, instructions[i]);
      instructionList.appendChild(instruction);
    }

    let startButton = this.createElement('button', 'start-btn', 'Start Game');
    menuContainer.appendChild(startButton);
    this.createMenuLevels(menuContainer);
  }

  createMenuLevels(menuContainer) {
    var menuLevelContainerElement = this.createElement('div', 'menu-level-container');
    menuContainer.appendChild(menuLevelContainerElement);

    var menuLevelTextElement = this.createElement('div', 'menu-level-text', 'Levels');
    menuLevelContainerElement.appendChild(menuLevelTextElement);

    var menuLevelsElement = this.createElement('ul', 'menu-levels');
    menuLevelContainerElement.appendChild(menuLevelsElement);

    for (var level = 1; level <= NO_OF_LEVELS; level++) {
      var menuLevelElement = this.createElement('li');
      menuLevelsElement.appendChild(menuLevelElement);

      var menuLevelNameElement = this.createElement('span', 'menu-level-name', 'Level ' + level);
      menuLevelElement.appendChild(menuLevelNameElement);

      var menuLevelBtnElement = this.createElement('button', 'menu-level-btn', 'Start Level');
      menuLevelBtnElement.setAttribute('data-level', level);
      menuLevelElement.appendChild(menuLevelBtnElement);

      var menuBossRoundBtnElement = this.createElement('button', 'menu-boss-round-btn', 'Start Boss Round');
      menuBossRoundBtnElement.setAttribute('data-level', level);
      menuLevelElement.appendChild(menuBossRoundBtnElement);
    }
  }

}

export default Menu;
