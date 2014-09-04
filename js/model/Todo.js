var EventHandler = require('famous/core/EventHandler'),
  Util = require('../util/Util');

// constructor
// ------------------------------------------------------------

function Todo(options) {
  this.label = options && options.label ? options.label : '';
  this.id = options && options.id ? options.id : Util.createUUID();
  this.completed = options && options.completed ? options.completed : false;
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
    return true;
  } else {
    return false;
  }
}

Todo.UPDATED = "todo:updated";
Todo.prototype.update = function (value) {
  if (this.label !== value) {
    this.label = value;
    this.emit(Todo.UPDATED, this.label);
    return true;
  } else {
    return false;
  }
}

Todo.prototype.toJSON = function (value) {
  return {
    id: this.id,
    label: this.label,
    completed: this.completed
  }
}

Todo.fromJSON = function(json){
  return new Todo(json);
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
