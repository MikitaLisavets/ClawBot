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
    if (this.position === 0) return null;
    return this.position -= 1;
  }

  moveRight() {
    if (this.position === this.maxPosition - 1) return null;
    return this.position += 1;
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

class Game {
  constructor(scene) {
    this.scene = scene;
  }
  setCommands(commands) {
    this.commands = commands;
  }
  playCommands() {

  }
}

class Scene {
  constructor(scene) {
    this.level = this.parseToLevel(scene.level);
    this.solution = this.parseToLevel(scene.solution);

    this.claw = new Claw(scene.clawPosition, this.level.length);
    this.maxStackSize = 6;
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
    if(this.claw.moveLeft() === null) {
      console.log('OVER');
      return;
    }
    this.render();
  }
  moveClawRight() {
    if(this.claw.moveRight()  === null) {
      console.log('OVER');
      return
    }

    this.render();
  }
  moveClawDown() {
    let position = this.claw.getPosition(),
        el;
    if ( this.claw.hasBox ) {
      if ( this.level[position].length === this.maxStackSize ) {
        console.log('OVER');
        return;
      }
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
          arr[i] = '[/]'
        } else {
          arr[i] = '{ }'
        }
      } else {
        arr[i] = '   ';
      }
    }
    console.clear();
    console.log(`| ${arr[0]} | ${arr[1]} | ${arr[2]} | ${arr[3]} |`);
    console.log('                          ');
    console.log(`| ${this.level[0][5] ? this.level[0][5].color : '   '} | ${this.level[1][5] ? this.level[1][5].color : '   '} | ${this.level[2][5] ? this.level[2][5].color : '   '} | ${this.level[3][5] ? this.level[3][5].color : '   '} |`);
    console.log(`| ${this.level[0][4] ? this.level[0][4].color : '   '} | ${this.level[1][4] ? this.level[1][4].color : '   '} | ${this.level[2][4] ? this.level[2][4].color : '   '} | ${this.level[3][4] ? this.level[3][4].color : '   '} |`);
    console.log(`| ${this.level[0][3] ? this.level[0][3].color : '   '} | ${this.level[1][3] ? this.level[1][3].color : '   '} | ${this.level[2][3] ? this.level[2][3].color : '   '} | ${this.level[3][3] ? this.level[3][3].color : '   '} |`);
    console.log(`| ${this.level[0][2] ? this.level[0][2].color : '   '} | ${this.level[1][2] ? this.level[1][2].color : '   '} | ${this.level[2][2] ? this.level[2][2].color : '   '} | ${this.level[3][2] ? this.level[3][2].color : '   '} |`);
    console.log(`| ${this.level[0][1] ? this.level[0][1].color : '   '} | ${this.level[1][1] ? this.level[1][1].color : '   '} | ${this.level[2][1] ? this.level[2][1].color : '   '} | ${this.level[3][1] ? this.level[3][1].color : '   '} |`);
    console.log(`| ${this.level[0][0] ? this.level[0][0].color : '   '} | ${this.level[1][0] ? this.level[1][0].color : '   '} | ${this.level[2][0] ? this.level[2][0].color : '   '} | ${this.level[3][0] ? this.level[3][0].color : '   '} |`);
  }
}





var game;

fetch('level.json')
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      response.json().then(function(data) {
        game = new Game(new Scene(data));
        game.scene.render();


        document.onkeydown = checkKey;

        function checkKey(e) {

            e = e || window.event;

            if (e.keyCode == '38') {
              game.scene.moveClawDown();
            }
            else if (e.keyCode == '40') {
              game.scene.moveClawDown();
            }
            else if (e.keyCode == '37') {
              game.scene.moveClawLeft();
            }
            else if (e.keyCode == '39') {
              game.scene.moveClawRight();
            }
        }
      });

    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
