'use strict';

class Box {
  constructor(color) {
    this.color = color;
  }
  getColor() {
    return this.color;
  }
}

class Claw {
  constructor(position, maxPosition) {
    this.position = position;
    this.maxPosition = maxPosition;
    this.hasBox = false;
    this.box = null;
  }

  moveLeft() {
    if (this.position === 0) return false;
    this.position -= 1;
  }

  moveRight() {
    if (this.position === this.maxPosition - 1) return false;
    this.position += 1;
  }

  getPosition() {
    return this.position;
  }

  setBox(box) {
    this.hasBox = true;
    this.box = box;
  }

  getBox() {
    let result;
    this.hasBox = false;
    result = this.box;
    this.box = null;
    return result;
  }
}

class Scene {
  constructor(scene) {
    this.level = this.parseToLevel(scene.level);
    this.solution = this.parseToLevel(scene.solution);

    this.claw = new Claw(scene.clawPosition, this.level.length);
  }

  parseToLevel(data) {
    let level = [],
        scene = data,
        stack;
    for (let i = 0, len = scene.length; i < len; i += 1) {
      stack = [];
      for (let j = 0, jlen = scene[i].length; j < jlen; j += 1) {
        stack.push(new Box(scene[i][j]));
      }
      level.push(stack);
    }
    return level;
  }

  checkResult() {
    return JSON.stringify(this.level) === JSON.stringify(this.solution);
  }

  moveClawLeft() {
    this.claw.moveLeft();
    this.render();
  }
  moveClawRight() {
    this.claw.moveRight();
    this.render();
  }
  moveClawDown() {
    let position = this.claw.getPosition(),
        el;
    if ( this.claw.hasBox ) {
      this.level[position].push(this.claw.getBox());
    } else {
      if (this.level[position].length) {
        this.claw.setBox(this.level[position].pop());
      }
    }
    this.render();
    if (this.checkResult()) console.log('WIN');
  }

  render() {
    var arr = [];
    for (let i = 0, len = this.level.length; i < len; i += 1) {
      if (i === this.claw.getPosition()) {
        if (this.claw.hasBox) {
          arr[i] = "[x]"
        } else {
          arr[i] = "[ ]"
        }
      } else {
        arr[i] = "...";
      }
    }
    console.clear();
    console.log(arr)
    console.log(`["[${this.level[0].length}]", "[${this.level[1].length}]", "[${this.level[2].length}]", "[${this.level[3].length}]"]`);
  }
}





var s;

fetch('level.json')
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      response.json().then(function(data) {
        s = new Scene(data);
        s.render();

        document.onkeydown = checkKey;

        function checkKey(e) {

            e = e || window.event;

            if (e.keyCode == '38') {
                // up arrow
            }
            else if (e.keyCode == '40') {
                s.moveClawDown();
            }
            else if (e.keyCode == '37') {
                s.moveClawLeft();
            }
            else if (e.keyCode == '39') {
                s.moveClawRight();
            }

        }
      });

    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
