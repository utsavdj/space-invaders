class Position {
  constructor() {
    this.positionX = 0;

    this.isInPosition = false;
    this.directionX = 1;
    this.currentPosition = 4;
    this.counter = 0;

    this.spreadOffset = 1;
    this.spreadCounter = 0;
    this.spreadDirectionX = 1;

    this.numberX = 10;
    this.numberY = 2;
    this.offsetX = 5;
    this.offsetY = 5;
  }

  move(){
    this.counter++;
    if(!this.isInPosition || this.counter !== 4){
      if(this.counter === 8){
        this.counter = 0;
        this.directionX = -this.directionX;
      }
    }
  }
}

export default Position;
