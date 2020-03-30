import { v4 as uuidv4 } from 'uuid';

function Node(name, type, geometry) {
  this.key = uuidv4();
  this.name = name;
  this.type = type;
  this.geometry = geometry;
  this.children = [];
  this.parent;
}

Node.prototype = {
  addChild(child) {
    child.parent = this;
    // child.key = this.children.length;
    this.children.push(child);
  },
  delete(){
    this.parent.removeChild(this);
  },
  removeChild(child) {
    var index;
    for (var i = 0; i < this.children.length; i += 1) {
      if (child === this.children[i]) {
        index = i;
        break;
      }
    }

    this.children.splice(index, 1);
  },
  isRoot() {
    return this.parent === undefined;
  },
  log() {
    console.log(this.name, this.type, this);
  }
};

// let node = new Node("Bill", "Cube");
// node.setName("Jim");

export default Node;
