class Pattern {
  constructor() {
    this.isAllPatternComplete = false;
    this.patterns = [
      [{
        p0: {x: 100, y: 100},
        p1: {x: 150, y: 200},
        p2: {x: 250, y: 300},
        p3: {x: 300, y: 200}
      }]
    ];
  }

  generateCoOrdinates(t, pattern) {
    let cX = 3 * (pattern.p1.x - pattern.p0.x),
      bX = 3 * (pattern.p2.x - pattern.p1.x) - cX,
      aX = pattern.p3.x - pattern.p0.x - cX - bX;

    let cY = 3 * (pattern.p1.y - pattern.p0.y),
      bY = 3 * (pattern.p2.y - pattern.p1.y) - cY,
      aY = pattern.p3.y - pattern.p0.y - cY - bY;

    let x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + pattern.p0.x;
    let y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + pattern.p0.y;

    return {x: x, y: y};
  }
}

export default Pattern;
