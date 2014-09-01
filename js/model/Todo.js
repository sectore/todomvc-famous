var EventHandler = require('famous/core/EventHandler'),
  Util = require('../util/util');

// constructor
// ------------------------------------------------------------

function Todo(label) {
  this.label = label || '';
  this.id = Util.createUUID();
  this.completed = false;
  this.outputEventHandler = new EventHandler();
}

Todo.prototype.toggleComplete = function () {
  var value = !this.completed;
  this.setCompleted(value);
}

Todo.COMPLETED = "todo:completed";
Todo.prototype.setCompleted = function (value) {
  if (this.completed !== value) {
    this.completed = value;
    this.emit(Todo.COMPLETED, this.completed);
  }
}

Todo.UPDATED = "todo:updated";
Todo.prototype.update = function (value) {
  if (this.label !== value) {
    this.label = value;
    this.emit(Todo.UPDATED, this.label);
  }
}

// event handling
// ------------------------------------------------------------

Todo.prototype.on = function (type, callback) {
  return this.outputEventHandler.on(type, callback);
};

Todo.prototype.off = function (type, callback) {
  return this.outputEventHandler.removeListener(type, callback);
};

Todo.prototype.emit = function (type, data) {
  return this.outputEventHandler.emit(type, data);
};

module.exports = Todo;
